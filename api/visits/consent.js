/**
 * Consent agreement endpoint
 * POST /api/visits/consent
 * Records user consent for telehealth and privacy
 */
import { db } from '../../lib/db.js';
import { consentAgreements, orders } from '../../lib/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify authentication
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { orderId, consentType, agreed } = req.body;

      if (!orderId || !consentType || agreed === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Valid consent types
      const validTypes = ['telehealth', 'privacy', 'hipaa'];
      if (!validTypes.includes(consentType)) {
        return res.status(400).json({ message: 'Invalid consent type' });
      }

      // Verify order belongs to user
      const [order] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.userId, user.userId)))
        .limit(1);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if consent already exists
      const [existing] = await db
        .select()
        .from(consentAgreements)
        .where(and(
          eq(consentAgreements.orderId, orderId),
          eq(consentAgreements.consentType, consentType)
        ))
        .limit(1);

      if (existing) {
        return res.status(409).json({ message: 'Consent already recorded', id: existing.id });
      }

      // Record consent
      const [consent] = await db
        .insert(consentAgreements)
        .values({
          orderId,
          userId: user.userId,
          consentType,
          agreed,
          agreedAt: new Date(),
        })
        .returning({ id: consentAgreements.id });

      return res.status(201).json({ message: 'Consent recorded', id: consent.id });
    }

    if (req.method === 'GET') {
      const { orderId } = req.query;

      if (!orderId) {
        return res.status(400).json({ message: 'Order ID required' });
      }

      const consents = await db
        .select()
        .from(consentAgreements)
        .where(and(
          eq(consentAgreements.orderId, parseInt(orderId)),
          eq(consentAgreements.userId, user.userId)
        ));

      return res.status(200).json(consents);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Consent API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
