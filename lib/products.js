/**
 * Product catalog for AI recommendations
 *
 * This is a simplified catalog used by the chat API for product recommendations.
 * The full product data with pricing is in /src/data/products.json
 */

export const PRODUCTS = [
  { id: "ed-viagra", name: "Sildenafil (Viagra)", category: "Erectile Dysfunction", description: "Fast-acting ED medication" },
  { id: "ed-cialis", name: "Tadalafil (Cialis)", category: "Erectile Dysfunction", description: "Long-acting ED treatment, ~36-hour window" },
  { id: "hair-finasteride", name: "Finasteride (Propecia)", category: "Hair Loss", description: "Blocks DHT to slow hair loss" },
  { id: "hair-minoxidil", name: "Minoxidil", category: "Hair Loss", description: "Topical treatment for hair growth" },
  { id: "weight-ozempic", name: "Semaglutide (Ozempic, Wegovy)", category: "Weight Loss", description: "GLP-1 for weight loss" },
  { id: "weight-mounjaro", name: "Tirzepatide (Mounjaro)", category: "Weight Loss", description: "Dual GLP-1/GIP for weight loss" },
  { id: "mental-ssri", name: "SSRIs/SNRIs", category: "Mental Health", description: "Antidepressants like sertraline, fluoxetine" },
  { id: "mental-bupropion", name: "Bupropion", category: "Mental Health", description: "Antidepressant, fewer sexual side effects" },
  { id: "mental-propranolol", name: "Propranolol", category: "Mental Health", description: "Beta-blocker for performance anxiety" },
  { id: "sleep-trazodone", name: "Trazodone", category: "Sleep", description: "Low-dose for insomnia" },
  { id: "sleep-melatonin", name: "Melatonin", category: "Sleep", description: "OTC supplement for sleep" },
  { id: "focus-modafinil", name: "Modafinil", category: "Focus", description: "Wakefulness-promoting for focus" },
  { id: "hrt-testosterone", name: "Testosterone", category: "HRT", description: "For hypogonadism in men" },
  { id: "hrt-estrogen", name: "Estrogen / Progesterone", category: "HRT", description: "Women's HRT for menopause" },
  { id: "ketamine", name: "Ketamine", category: "Mental Health", description: "Therapeutic use for depression" },
];

/**
 * Get product catalog as a formatted string for AI prompts
 * @returns {string} Formatted product list
 */
export function getProductCatalogForPrompt() {
  return PRODUCTS.map(p => `- ${p.id}: ${p.name} (${p.category})`).join('\n');
}
