/**
 * Beluga Health Webhook Handler
 * POST /api/webhooks/beluga
 * Receives visit status updates from Beluga Health
 */
import { db } from '../../lib/db.js';
import { belugaApiRequests, belugaWebhookEvents, orders } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const BELUGA_WEBHOOK_SECRET = process.env.BELUGA_WEBHOOK_SECRET;

/**
 * Verify Beluga webhook signature
 */
function verifySignature(payload, signature) {
  if (!BELUGA_WEBHOOK_SECRET) {
    console.warn('BELUGA_WEBHOOK_SECRET not configured, skipping signature verification');
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', BELUGA_WEBHOOK_SECRET)
    .update(payload)
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(signature || ''),
    Buffer.from(expectedSignature)
  );
}

/**
 * Map Beluga event types to visit statuses
 */
function mapEventToStatus(eventType) {
  const statusMap = {
    'CONSULT_CREATED': 'in_review',
    'CONSULT_STARTED': 'in_review',
    'RX_WRITTEN': 'approved',
    'CONSULT_CONCLUDED': 'completed',
    'CONSULT_CANCELED': 'cancelled',
    'CONSULT_REJECTED': 'rejected',
    'CONSULT_FAILED': 'failed',
  };
  return statusMap[eventType] || 'pending';
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get raw body for signature verification
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const signature = req.headers['x-beluga-signature'] || req.headers['x-webhook-signature'];

    // Verify signature (optional in staging)
    if (BELUGA_WEBHOOK_SECRET && signature) {
      if (!verifySignature(rawBody, signature)) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ message: 'Invalid signature' });
      }
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { event_type, master_id, visit_id, data } = payload;

    if (!event_type || !master_id) {
      return res.status(400).json({ message: 'Missing event_type or master_id' });
    }

    console.log(`Beluga webhook received: ${event_type} for ${master_id}`);

    // Store webhook event
    const [webhookEvent] = await db
      .insert(belugaWebhookEvents)
      .values({
        masterId: master_id,
        eventType: event_type,
        eventPayload: payload,
        processingStatus: 'pending',
      })
      .returning({ id: belugaWebhookEvents.id });

    try {
      // Find the original request
      const [belugaRequest] = await db
        .select()
        .from(belugaApiRequests)
        .where(eq(belugaApiRequests.masterId, master_id))
        .limit(1);

      if (!belugaRequest) {
        console.warn(`No request found for master_id: ${master_id}`);
        await db
          .update(belugaWebhookEvents)
          .set({
            processingStatus: 'error',
            errorMessage: 'No matching request found',
          })
          .where(eq(belugaWebhookEvents.id, webhookEvent.id));
        return res.status(200).json({ message: 'Acknowledged (no matching request)' });
      }

      // Update the request with new status
      const newStatus = mapEventToStatus(event_type);
      await db
        .update(belugaApiRequests)
        .set({
          visitStatus: newStatus,
          lastWebhookEvent: event_type,
          webhookReceivedAt: new Date(),
          doctorResponse: data?.doctor_response || null,
          visitId: visit_id || belugaRequest.visitId,
          updatedAt: new Date(),
        })
        .where(eq(belugaApiRequests.id, belugaRequest.id));

      // Update order status based on event
      let orderStatus = 'processing';
      if (event_type === 'RX_WRITTEN') {
        orderStatus = 'prescription_ready';
      } else if (event_type === 'CONSULT_CONCLUDED') {
        orderStatus = 'completed';
      } else if (event_type === 'CONSULT_CANCELED' || event_type === 'CONSULT_REJECTED') {
        orderStatus = 'cancelled';
      }

      await db
        .update(orders)
        .set({ orderStatus })
        .where(eq(orders.id, belugaRequest.orderId));

      // Mark webhook as processed
      await db
        .update(belugaWebhookEvents)
        .set({ processingStatus: 'success' })
        .where(eq(belugaWebhookEvents.id, webhookEvent.id));

      return res.status(200).json({
        message: 'Webhook processed successfully',
        event_type,
        master_id,
        new_status: newStatus,
      });

    } catch (processingError) {
      // Mark webhook as error but still return 200 to prevent retries
      await db
        .update(belugaWebhookEvents)
        .set({
          processingStatus: 'error',
          errorMessage: processingError.message,
        })
        .where(eq(belugaWebhookEvents.id, webhookEvent.id));

      console.error('Webhook processing error:', processingError);
      return res.status(200).json({ message: 'Acknowledged with error' });
    }

  } catch (error) {
    console.error('Beluga webhook error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Disable body parser for raw body access
export const config = {
  api: {
    bodyParser: false,
  },
};
