/**
 * Send to Doctor (Beluga Health) endpoint
 * POST /api/visits/send-to-doc
 * Submits completed questionnaire and consent to Beluga for telemedicine review
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

/**
 * Generate a unique master ID for Beluga
 */
function generateMasterId() {
  return `AMULET-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const tokenUser = await verifyToken(req);
    if (!tokenUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { orderId, visitType } = req.body;

    if (!orderId || !visitType) {
      return res.status(400).json({ message: 'Order ID and visit type required' });
    }

    // Get order
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, tokenUser.userId)))
      .limit(1);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, tokenUser.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check required consents
    const consents = await db
      .select()
      .from(consentAgreements)
      .where(eq(consentAgreements.orderId, orderId));

    const hasTelemedicineConsent = consents.some(c => c.consentType === 'telehealth' && c.agreed);
    const hasPrivacyConsent = consents.some(c => c.consentType === 'privacy' && c.agreed);

    if (!hasTelemedicineConsent || !hasPrivacyConsent) {
      return res.status(400).json({ message: 'Required consents not completed' });
    }

    // Get questionnaire
    const [questionnaire] = await db
      .select()
      .from(medicationQuestionnaires)
      .where(and(
        eq(medicationQuestionnaires.orderId, orderId),
        eq(medicationQuestionnaires.completed, true)
      ))
      .limit(1);

    if (!questionnaire) {
      return res.status(400).json({ message: 'Questionnaire not completed' });
    }

    // Generate master ID
    const masterId = generateMasterId();

    // Build Beluga request payload
    const belugaPayload = {
      master_id: masterId,
      visit_type: visitType.toUpperCase(), // 'ED' or 'WEIGHTLOSS'
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
      consents: {
        telehealth: hasTelemedicineConsent,
        privacy: hasPrivacyConsent,
      },
    };

    // Store request before sending
    const [belugaRequest] = await db
      .insert(belugaApiRequests)
      .values({
        orderId,
        userId: tokenUser.userId,
        masterId,
        visitType,
        requestPayload: belugaPayload,
        status: 'pending',
      })
      .returning({ id: belugaApiRequests.id });

    // Send to Beluga
    let belugaResponse;
    let httpStatus;

    try {
      const response = await fetch(`${BELUGA_API_URL}/v1/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BELUGA_API_KEY}`,
        },
        body: JSON.stringify(belugaPayload),
      });

      httpStatus = response.status;
      belugaResponse = await response.json();

      // Update request with response
      await db
        .update(belugaApiRequests)
        .set({
          responsePayload: belugaResponse,
          httpStatus,
          status: response.ok ? 'success' : 'error',
          visitId: belugaResponse.visit_id || null,
          respondedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(belugaApiRequests.id, belugaRequest.id));

      if (!response.ok) {
        return res.status(response.status).json({
          message: 'Beluga API error',
          error: belugaResponse,
        });
      }

      // Update order status
      await db
        .update(orders)
        .set({ orderStatus: 'submitted_to_doc' })
        .where(eq(orders.id, orderId));

      return res.status(200).json({
        message: 'Visit submitted successfully',
        masterId,
        visitId: belugaResponse.visit_id,
      });

    } catch (fetchError) {
      // Update request with error
      await db
        .update(belugaApiRequests)
        .set({
          status: 'error',
          errorMessage: fetchError.message,
          updatedAt: new Date(),
        })
        .where(eq(belugaApiRequests.id, belugaRequest.id));

      throw fetchError;
    }

  } catch (error) {
    console.error('Send to doc error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
