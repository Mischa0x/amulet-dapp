/**
 * Products API - Combined endpoint for supplements, medications, labs
 * GET /api/products?type=supplements
 * GET /api/products?type=medications
 * GET /api/products?type=labs
 * GET /api/products?type=supplements&id=123
 */
import { db } from '../../lib/db.js';
import {
  supplements, supplementsXVendor,
  medications, medicationsXVendor,
  labs, labsXVendor
} from '../../lib/schema.js';
import { eq } from 'drizzle-orm';

async function handleSupplements(req, res) {
  const { id } = req.query;

  if (id) {
    const [supplement] = await db
      .select()
      .from(supplements)
      .where(eq(supplements.id, parseInt(id)))
      .limit(1);

    if (!supplement) {
      return res.status(404).json({ message: 'Supplement not found' });
    }

    const vendorPricing = await db
      .select({
        price: supplementsXVendor.price,
        inStock: supplementsXVendor.inStock,
        vendorId: supplementsXVendor.vendorId,
      })
      .from(supplementsXVendor)
      .where(eq(supplementsXVendor.supplementId, parseInt(id)));

    return res.status(200).json({ ...supplement, vendors: vendorPricing });
  }

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

  const supplementsWithPricing = await Promise.all(
    allSupplements.map(async (supp) => {
      const pricing = await db
        .select({ price: supplementsXVendor.price, inStock: supplementsXVendor.inStock })
        .from(supplementsXVendor)
        .where(eq(supplementsXVendor.supplementId, supp.id))
        .limit(1);
      return { ...supp, price: pricing[0]?.price || null, inStock: pricing[0]?.inStock ?? true };
    })
  );

  return res.status(200).json(supplementsWithPricing);
}

async function handleMedications(req, res) {
  const { id } = req.query;

  if (id) {
    const [medication] = await db
      .select()
      .from(medications)
      .where(eq(medications.id, parseInt(id)))
      .limit(1);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    const vendorPricing = await db
      .select({
        price: medicationsXVendor.price,
        inStock: medicationsXVendor.inStock,
        vendorId: medicationsXVendor.vendorId,
      })
      .from(medicationsXVendor)
      .where(eq(medicationsXVendor.medicationId, parseInt(id)));

    return res.status(200).json({ ...medication, vendors: vendorPricing });
  }

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

  const medicationsWithPricing = await Promise.all(
    allMedications.map(async (med) => {
      const pricing = await db
        .select({ price: medicationsXVendor.price, inStock: medicationsXVendor.inStock })
        .from(medicationsXVendor)
        .where(eq(medicationsXVendor.medicationId, med.id))
        .limit(1);
      return { ...med, price: pricing[0]?.price || null, inStock: pricing[0]?.inStock ?? true };
    })
  );

  return res.status(200).json(medicationsWithPricing);
}

async function handleLabs(req, res) {
  const { id } = req.query;

  if (id) {
    const [lab] = await db
      .select()
      .from(labs)
      .where(eq(labs.id, parseInt(id)))
      .limit(1);

    if (!lab) {
      return res.status(404).json({ message: 'Lab test not found' });
    }

    const vendorPricing = await db
      .select({
        price: labsXVendor.price,
        isAvailable: labsXVendor.isAvailable,
        vendorId: labsXVendor.vendorId,
      })
      .from(labsXVendor)
      .where(eq(labsXVendor.labId, parseInt(id)));

    return res.status(200).json({ ...lab, vendors: vendorPricing });
  }

  const allLabs = await db
    .select({
      id: labs.id,
      name: labs.name,
      description: labs.description,
      remoteCode: labs.remoteCode,
      keyword: labs.keyword,
    })
    .from(labs);

  const labsWithPricing = await Promise.all(
    allLabs.map(async (lab) => {
      const pricing = await db
        .select({ price: labsXVendor.price, isAvailable: labsXVendor.isAvailable })
        .from(labsXVendor)
        .where(eq(labsXVendor.labId, lab.id))
        .limit(1);
      return { ...lab, price: pricing[0]?.price || null, isAvailable: pricing[0]?.isAvailable ?? true };
    })
  );

  return res.status(200).json(labsWithPricing);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { type } = req.query;

    switch (type) {
      case 'supplements':
        return await handleSupplements(req, res);
      case 'medications':
        return await handleMedications(req, res);
      case 'labs':
        return await handleLabs(req, res);
      default:
        return res.status(400).json({
          message: 'Invalid type. Use ?type=supplements, ?type=medications, or ?type=labs'
        });
    }
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
