import React, { useMemo } from "react";
import styles from "./Cart.module.css";
import { useCart } from "../../store/CartContext";
import OrderSummary from "./OrderSummary";

// Map skill to icon (same as ShopProductGrid)
const skillToIcon = (skill) => {
  const s = (skill || "").toLowerCase();
  const icons = {
    restoration: "/assets/skill-restoration.svg",
    vitality: "/assets/skill-vitality.svg",
    regen: "/assets/skill-regen.svg",
    hormonal: "/assets/skill-hormonal.svg",
    clarity: "/assets/skill-clarity.svg",
    alternative: "/assets/skill-alternative.svg",
    metabolics: "/assets/skill-metabolics.svg",
    longevity: "/assets/skill-longevity.svg",
    structure: "/assets/skill-structure.svg",
  };
  return icons[s] || "/assets/skill-longevity.svg";
};

export default function Cart() {
  const { items, count, total, updateQty, removeItem } = useCart();
  const lines = useMemo(() => Object.values(items || {}), [items]);

  const TAX_RATE = 0.08;
  const shipping = 0;
  const tax = +(total * TAX_RATE).toFixed(2);
  const grandTotal = +(total + tax + shipping).toFixed(2);


  const handleQtyInput = (id) => (e) => {
    const raw = e.target.value;
    const n = Math.max(1, Math.min(10, Number(raw || 0)));
    updateQty(id, n);
  };

  const dec = (id, current) => updateQty(id, Math.max(1, current - 1));
  const inc = (id, current) => updateQty(id, Math.min(10, current + 1));



  return (
    <div className={styles.cartPage}>
      {/* LEFT column — section header + items */}
      <div className={styles.leftCol}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>LONGEVITY PRODUCTS</div>
      
        </div>

        <div className={styles.itemsPane}>
          {lines.length === 0 && (
            <div className={styles.itemCard}>
              <div className={styles.itemRow}>
                <div className={styles.itemText}>Your cart is empty.</div>
              </div>
            </div>
          )}

          {lines.map(({ id, product, qty, lineTotal }) => (
            <div key={id} className={styles.itemCard}>
              <div className={styles.itemRow}>
                {/* left: product info */}
                <div className={styles.itemInfo}>
                  <div className={styles.itemImageBox}>
                    <img
                      className={styles.itemImage}
                      src={skillToIcon(product?.skill)}
                      alt={product?.skill || "Product"}
                    />
                  </div>
                  <div className={styles.itemText}>
                    <div className={styles.itemTitle}>
                      {product?.name || "Product"}
                    </div>
                    <div className={styles.itemUnitPrice}>
                      ${Number(product?.price || 0).toFixed(2)} per unit
                    </div>
                    <div className={styles.itemSubtotal}>
                      Subtotal: ${Number(lineTotal || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* right: qty controls */}
                <div className={styles.qtyRow}>
                  {/* Desktop controller */}
                  <div className={styles.desktopControls}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => dec(id, qty)}
                      aria-label={`Decrease ${product?.name} quantity`}
                    >
                      <img
                        className={styles.iconBox}
                        src="/assets/minus-thick.svg"
                        alt="-"
                      />
                    </button>

                    <div className={styles.qtyBadge}>
                      <div className={styles.qtyMax}>MAX 10</div>
                      <div className={styles.qtyValue}>{qty}</div>
                    </div>

                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => inc(id, qty)}
                      aria-label={`Increase ${product?.name} quantity`}
                    >
                      <img
                        className={styles.iconBox}
                        src="/assets/plus-thick.svg"
                        alt="+"
                      />
                    </button>
                  </div>

                  {/* Mobile controller */}
                  <div className={styles.mobileControls}>
                    <div className={styles.qtyInputGroup}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={qty}
                        onChange={handleQtyInput(id)}
                        className={styles.qtyInput}
                        aria-label={`Quantity for ${product?.name}`}
                      />
                      <span className={styles.qtyMaxText}>max 10 items</span>
                    </div>

                    <button
                      className={styles.deleteBtn}
                      aria-label={`Remove ${product?.name}`}
                      type="button"
                      onClick={() => removeItem(id)}
                    >
                      <img
                        src="/assets/trash.svg"
                        alt=""
                        className={styles.deleteIcon}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT column — Order summary */}
<OrderSummary
  count={count}
  subtotal={+total.toFixed(2)}
  tax={tax}
  total={grandTotal}
  showCheckoutCta={true}     // ✅ show the button here
  shippingPending={false}
  currencySymbol="$"
  currencyCode="USD"
/>
    </div>
  );
}
