/**
 * Medical questionnaire endpoint
 * POST /api/visits/questionnaire
 * Saves questionnaire responses for medication orders
 */
import { db } from '../../lib/db.js';
import { medicationQuestionnaires, orders } from '../../lib/schema.js';
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
      const { orderId, questionnaireType, responses } = req.body;

      if (!orderId || !questionnaireType || !responses) {
        return res.status(400).json({ message: 'Missing required fields' });
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

      // Check if questionnaire already exists
      const [existing] = await db
        .select()
        .from(medicationQuestionnaires)
        .where(and(
          eq(medicationQuestionnaires.orderId, orderId),
          eq(medicationQuestionnaires.questionnaireType, questionnaireType)
        ))
        .limit(1);

      if (existing) {
        // Update existing questionnaire
        await db
          .update(medicationQuestionnaires)
          .set({
            responses,
            completed: true,
            updatedAt: new Date(),
          })
          .where(eq(medicationQuestionnaires.id, existing.id));

        return res.status(200).json({ message: 'Questionnaire updated', id: existing.id });
      }

      // Create new questionnaire
      const [questionnaire] = await db
        .insert(medicationQuestionnaires)
        .values({
          orderId,
          userId: user.userId,
          questionnaireType,
          responses,
          completed: true,
        })
        .returning({ id: medicationQuestionnaires.id });

      return res.status(201).json({ message: 'Questionnaire saved', id: questionnaire.id });
    }

    if (req.method === 'GET') {
      const { orderId } = req.query;

      if (!orderId) {
        return res.status(400).json({ message: 'Order ID required' });
      }

      const questionnaires = await db
        .select()
        .from(medicationQuestionnaires)
        .where(and(
          eq(medicationQuestionnaires.orderId, parseInt(orderId)),
          eq(medicationQuestionnaires.userId, user.userId)
        ));

      return res.status(200).json(questionnaires);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Questionnaire API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
