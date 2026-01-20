/**
 * Visits API - Combined endpoint for questionnaire, consent, and send-to-doc
 * POST /api/visits?action=questionnaire
 * GET  /api/visits?action=questionnaire&orderId={id}
 * POST /api/visits?action=consent
 * GET  /api/visits?action=consent&orderId={id}
 * POST /api/visits?action=send-to-doc
 */
import { db } from '../../lib/db.js';
import {
  medicationQuestionnaires,
  consentAgreements,
  orders,
  users,
  belugaApiRequests
} from '../../lib/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../../lib/auth.js';
import crypto from 'crypto';

const BELUGA_API_URL = process.env.BELUGA_API_URL || 'https://stagingapi.belugahealth.com';
const BELUGA_API_KEY = process.env.BELUGA_STAGING_API_KEY;

function generateMasterId() {
  return `AMULET-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

// ============ QUESTIONNAIRE ============
async function handleQuestionnaire(req, res, user) {
  if (req.method === 'POST') {
    const { orderId, questionnaireType, responses } = req.body;
    if (!orderId || !questionnaireType || !responses) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.userId))).limit(1);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const [existing] = await db.select().from(medicationQuestionnaires)
      .where(and(
        eq(medicationQuestionnaires.orderId, orderId),
        eq(medicationQuestionnaires.questionnaireType, questionnaireType)
      )).limit(1);

    if (existing) {
      await db.update(medicationQuestionnaires)
        .set({ responses, completed: true, updatedAt: new Date() })
        .where(eq(medicationQuestionnaires.id, existing.id));
      return res.status(200).json({ message: 'Questionnaire updated', id: existing.id });
    }

    const [questionnaire] = await db.insert(medicationQuestionnaires)
      .values({ orderId, userId: user.userId, questionnaireType, responses, completed: true })
      .returning({ id: medicationQuestionnaires.id });
    return res.status(201).json({ message: 'Questionnaire saved', id: questionnaire.id });
  }

  if (req.method === 'GET') {
    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ message: 'Order ID required' });

    const questionnaires = await db.select().from(medicationQuestionnaires)
      .where(and(
        eq(medicationQuestionnaires.orderId, parseInt(orderId)),
        eq(medicationQuestionnaires.userId, user.userId)
      ));
    return res.status(200).json(questionnaires);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

// ============ CONSENT ============
async function handleConsent(req, res, user) {
  if (req.method === 'POST') {
    const { orderId, consentType, agreed } = req.body;
    if (!orderId || !consentType || agreed === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validTypes = ['telehealth', 'privacy', 'hipaa'];
    if (!validTypes.includes(consentType)) {
      return res.status(400).json({ message: 'Invalid consent type' });
    }

    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.userId))).limit(1);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const [existing] = await db.select().from(consentAgreements)
      .where(and(
        eq(consentAgreements.orderId, orderId),
        eq(consentAgreements.consentType, consentType)
      )).limit(1);

    if (existing) {
      return res.status(409).json({ message: 'Consent already recorded', id: existing.id });
    }

    const [consent] = await db.insert(consentAgreements)
      .values({ orderId, userId: user.userId, consentType, agreed, agreedAt: new Date() })
      .returning({ id: consentAgreements.id });
    return res.status(201).json({ message: 'Consent recorded', id: consent.id });
  }

  if (req.method === 'GET') {
    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ message: 'Order ID required' });

    const consents = await db.select().from(consentAgreements)
      .where(and(
        eq(consentAgreements.orderId, parseInt(orderId)),
        eq(consentAgreements.userId, user.userId)
      ));
    return res.status(200).json(consents);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

// ============ SEND TO DOC ============
async function handleSendToDoc(req, res, tokenUser) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId, visitType } = req.body;
  if (!orderId || !visitType) {
    return res.status(400).json({ message: 'Order ID and visit type required' });
  }

  const [order] = await db.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, tokenUser.userId))).limit(1);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const [user] = await db.select().from(users).where(eq(users.id, tokenUser.userId)).limit(1);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const consents = await db.select().from(consentAgreements).where(eq(consentAgreements.orderId, orderId));
  const hasTelemedicineConsent = consents.some(c => c.consentType === 'telehealth' && c.agreed);
  const hasPrivacyConsent = consents.some(c => c.consentType === 'privacy' && c.agreed);

  if (!hasTelemedicineConsent || !hasPrivacyConsent) {
    return res.status(400).json({ message: 'Required consents not completed' });
  }

  const [questionnaire] = await db.select().from(medicationQuestionnaires)
    .where(and(eq(medicationQuestionnaires.orderId, orderId), eq(medicationQuestionnaires.completed, true))).limit(1);
  if (!questionnaire) return res.status(400).json({ message: 'Questionnaire not completed' });

  const masterId = generateMasterId();

  const belugaPayload = {
    master_id: masterId,
    visit_type: visitType.toUpperCase(),
    patient: {
      first_name: user.firstName || user.username,
      last_name: user.lastName || 'User',
      email: user.email,
      phone: user.phone || '',
      date_of_birth: user.dob || '',
      sex: user.bioSex === 'M' ? 'male' : user.bioSex === 'F' ? 'female' : 'other',
      address: {
        line1: user.firstLine || '',
        line2: user.secondLine || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zipCode || '',
      },
    },
    questionnaire_responses: questionnaire.responses,
    consents: { telehealth: hasTelemedicineConsent, privacy: hasPrivacyConsent },
  };

  const [belugaRequest] = await db.insert(belugaApiRequests)
    .values({ orderId, userId: tokenUser.userId, masterId, visitType, requestPayload: belugaPayload, status: 'pending' })
    .returning({ id: belugaApiRequests.id });

  try {
    const response = await fetch(`${BELUGA_API_URL}/v1/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${BELUGA_API_KEY}` },
      body: JSON.stringify(belugaPayload),
    });

    const belugaResponse = await response.json();

    await db.update(belugaApiRequests).set({
      responsePayload: belugaResponse,
      httpStatus: response.status,
      status: response.ok ? 'success' : 'error',
      visitId: belugaResponse.visit_id || null,
      respondedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(belugaApiRequests.id, belugaRequest.id));

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Beluga API error', error: belugaResponse });
    }

    await db.update(orders).set({ orderStatus: 'submitted_to_doc' }).where(eq(orders.id, orderId));

    return res.status(200).json({ message: 'Visit submitted successfully', masterId, visitId: belugaResponse.visit_id });

  } catch (fetchError) {
    await db.update(belugaApiRequests).set({
      status: 'error', errorMessage: fetchError.message, updatedAt: new Date()
    }).where(eq(belugaApiRequests.id, belugaRequest.id));
    throw fetchError;
  }
}

// ============ MAIN HANDLER ============
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const user = await verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const action = req.query.action || req.body?.action;

    switch (action) {
      case 'questionnaire':
        return await handleQuestionnaire(req, res, user);
      case 'consent':
        return await handleConsent(req, res, user);
      case 'send-to-doc':
        return await handleSendToDoc(req, res, user);
      default:
        return res.status(400).json({
          message: 'Invalid action. Use ?action=questionnaire, ?action=consent, or ?action=send-to-doc'
        });
    }
  } catch (error) {
    console.error('Visits API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
