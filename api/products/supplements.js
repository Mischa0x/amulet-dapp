/**
 * Supplements API endpoint
 * GET /api/products/supplements - List all supplements
 * GET /api/products/supplements?id=123 - Get specific supplement
 */
import { db } from '../../lib/db.js';
import { supplements, supplementsXVendor, vendors, supplementVendors } from '../../lib/schema.js';
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
      // Get specific supplement with vendor info
      const [supplement] = await db
        .select()
        .from(supplements)
        .where(eq(supplements.id, parseInt(id)))
        .limit(1);

      if (!supplement) {
        return res.status(404).json({ message: 'Supplement not found' });
      }

      // Get vendor pricing
      const vendorPricing = await db
        .select({
          price: supplementsXVendor.price,
          inStock: supplementsXVendor.inStock,
          vendorId: supplementsXVendor.vendorId,
        })
        .from(supplementsXVendor)
        .where(eq(supplementsXVendor.supplementId, parseInt(id)));

      return res.status(200).json({
        ...supplement,
        vendors: vendorPricing,
      });
    }

    // List all supplements
    const allSupplements = await db
      .select({
        id: supplements.id,
        name: supplements.name,
        description: supplements.description,
        sku: supplements.sku,
        imageUrl: supplements.imageUrl,
        category: supplements.category,
        benefits: supplements.benefits,
        ingredients: supplements.ingredients,
        dosage: supplements.dosage,
        keyword: supplements.keyword,
      })
      .from(supplements);

    // Get pricing for each supplement
    const supplementsWithPricing = await Promise.all(
      allSupplements.map(async (supp) => {
        const pricing = await db
          .select({
            price: supplementsXVendor.price,
            inStock: supplementsXVendor.inStock,
          })
          .from(supplementsXVendor)
          .where(eq(supplementsXVendor.supplementId, supp.id))
          .limit(1);

        return {
          ...supp,
          price: pricing[0]?.price || null,
          inStock: pricing[0]?.inStock ?? true,
        };
      })
    );

    return res.status(200).json(supplementsWithPricing);
  } catch (error) {
    console.error('Supplements API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
