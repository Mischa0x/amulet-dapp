/**
 * Medications API endpoint
 * GET /api/products/medications - List all medications
 * GET /api/products/medications?id=123 - Get specific medication
 */
import { db } from '../../lib/db.js';
import { medications, medicationsXVendor } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (id) {
      // Get specific medication with vendor info
      const [medication] = await db
        .select()
        .from(medications)
        .where(eq(medications.id, parseInt(id)))
        .limit(1);

      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      // Get vendor pricing
      const vendorPricing = await db
        .select({
          price: medicationsXVendor.price,
          inStock: medicationsXVendor.inStock,
          vendorId: medicationsXVendor.vendorId,
        })
        .from(medicationsXVendor)
        .where(eq(medicationsXVendor.medicationId, parseInt(id)));

      return res.status(200).json({
        ...medication,
        vendors: vendorPricing,
      });
    }

    // List all medications
    const allMedications = await db
      .select({
        id: medications.id,
        name: medications.name,
        description: medications.description,
        sku: medications.sku,
        imageUrl: medications.imageUrl,
        category: medications.category,
        requiresPrescription: medications.requiresPrescription,
        sideEffects: medications.sideEffects,
        dosage: medications.dosage,
      })
      .from(medications);

    // Get pricing for each medication
    const medicationsWithPricing = await Promise.all(
      allMedications.map(async (med) => {
        const pricing = await db
          .select({
            price: medicationsXVendor.price,
            inStock: medicationsXVendor.inStock,
          })
          .from(medicationsXVendor)
          .where(eq(medicationsXVendor.medicationId, med.id))
          .limit(1);

        return {
          ...med,
          price: pricing[0]?.price || null,
          inStock: pricing[0]?.inStock ?? true,
        };
      })
    );

    return res.status(200).json(medicationsWithPricing);
  } catch (error) {
    console.error('Medications API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
