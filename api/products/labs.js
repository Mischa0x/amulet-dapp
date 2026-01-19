/**
 * Labs API endpoint
 * GET /api/products/labs - List all lab tests
 * GET /api/products/labs?id=123 - Get specific lab test
 */
import { db } from '../../lib/db.js';
import { labs, labsXVendor } from '../../lib/schema.js';
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
      // Get specific lab with vendor info
      const [lab] = await db
        .select()
        .from(labs)
        .where(eq(labs.id, parseInt(id)))
        .limit(1);

      if (!lab) {
        return res.status(404).json({ message: 'Lab test not found' });
      }

      // Get vendor pricing
      const vendorPricing = await db
        .select({
          price: labsXVendor.price,
          isAvailable: labsXVendor.isAvailable,
          vendorId: labsXVendor.vendorId,
        })
        .from(labsXVendor)
        .where(eq(labsXVendor.labId, parseInt(id)));

      return res.status(200).json({
        ...lab,
        vendors: vendorPricing,
      });
    }

    // List all labs
    const allLabs = await db
      .select({
        id: labs.id,
        name: labs.name,
        description: labs.description,
        remoteCode: labs.remoteCode,
        keyword: labs.keyword,
      })
      .from(labs);

    // Get pricing for each lab
    const labsWithPricing = await Promise.all(
      allLabs.map(async (lab) => {
        const pricing = await db
          .select({
            price: labsXVendor.price,
            isAvailable: labsXVendor.isAvailable,
          })
          .from(labsXVendor)
          .where(eq(labsXVendor.labId, lab.id))
          .limit(1);

        return {
          ...lab,
          price: pricing[0]?.price || null,
          isAvailable: pricing[0]?.isAvailable ?? true,
        };
      })
    );

    return res.status(200).json(labsWithPricing);
  } catch (error) {
    console.error('Labs API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
