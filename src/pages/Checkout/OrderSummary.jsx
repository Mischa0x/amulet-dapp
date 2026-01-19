import React, { useMemo, useState } from "react";
import styles from "./OrderSummary.module.css";
import { useCart } from "../../store/CartContext";
import { useNavigate } from "react-router-dom";

export default function OrderSummary({
  count,
  subtotal,
  shipping,
  tax,
  total,
  showCheckoutCta = false,
  shippingPending = false,
  currencySymbol = "$",
  currencyCode = "USD",
  classNameOverride = "",
  showTax = false,
}) {
  const { items = {}, total: cartSubtotal = 0 } = useCart();
  const lines = useMemo(() => Object.values(items), [items]);
  const navigate = useNavigate();


  // Fallback math (keeps Cart working if props aren’t passed)
  const derivedSubtotal = typeof subtotal === "number" ? subtotal : +cartSubtotal.toFixed(2);
  const derivedTax = typeof tax === "number" ? tax : 0;
  const derivedShipping = typeof shipping === "number" ? shipping : (shippingPending ? null : 0);
  const derivedTotal =
    typeof total === "number"
      ? total
      : +(derivedSubtotal + (showTax ? derivedTax : 0) + (derivedShipping || 0)).toFixed(2);

  // Discount mock (UI only for now)
  const [code, setCode] = useState("");

  return (
    <aside className={`${styles.summaryCard}  ${styles.stickyDesktop} ${classNameOverride}`} aria-labelledby="summary-title">
      {/* Line items preview */}
      {lines.map(({ id, product, qty }) => (
        <div key={id} className={styles.itemRow}>
          <div className={styles.itemThumbWrap}>
            <img
              className={styles.itemThumb}
              src={product?.image || "/assets/futurePill.svg"}
              alt=""
            />
            <span className={styles.qtyBadge}>{qty}</span>
          </div>
          <div className={styles.itemTitle}>{product?.name || "Product"}</div>
          <div className={styles.itemPrice}>
            {currencySymbol}
            {Number(product?.price || 0).toFixed(2)}
          </div>
        </div>
      ))}

      {/* Discount / Gift code */}
      <div className={styles.discountRow}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Discount code or gift card"
          className={styles.discountInput}
          aria-label="Discount code or gift card"
        />
        <button
          type="button"
          className={styles.discountApply}
          disabled={!code.trim()}
          onClick={() => {/* Discount codes not yet implemented */}}
        >
          Apply
        </button>
      </div>

      {/* Totals */}
      <div className={styles.totalsBlock}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Subtotal</span>
          <span className={styles.totalValue}>
            {currencySymbol}
            {derivedSubtotal.toFixed(2)}
          </span>
        </div>

        {showTax && (
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Tax</span>
            <span className={styles.totalValue}>
              {currencySymbol}
              {derivedTax.toFixed(2)}
            </span>
          </div>
        )}

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Shipping</span>
          <span className={styles.shippingValue}>
            {shippingPending
              ? "Enter shipping address"
              : derivedShipping === 0
              ? "FREE"
              : `${currencySymbol}${Number(derivedShipping || 0).toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className={`${styles.totalRow} ${styles.totalFinalRow}`}>
        <span className={styles.totalFinalLabel}>Total</span>
        <span className={styles.totalFinalValue}>
          <span className={styles.currencyCode}>{currencyCode}</span>{" "}
          {currencySymbol}
          {derivedTotal.toFixed(2)}
        </span>
      </div>

      {/* (Optional) CTA preserved for Cart usage */}
        {showCheckoutCta && (
          <button
            type="button"
            className={styles.checkoutCta}
            onClick={() => navigate("/checkout")}
          >
            PROCEED TO CHECKOUT
            <img
              src="/assets/bx-right-arrow-alt.svg"
              alt=""
              className={styles.checkoutArrow}
            />
          </button>
        )}


      {/* Security badges (kept inside the card) */}
      <div className={styles.badgesRow}>
        <div className={styles.badge}>
          <img src="/assets/exclamation-octagon-green.svg" alt="" />
          <span>256-BIT ENCRYPTION</span>
        </div>
        <div className={styles.badge}>
          <img src="/assets/exclamation-octagon-blue.svg" alt="" />
          <span>AI-OPTIMIZED PROTOCOLS</span>
        </div>
        <div className={styles.badge}>
          <img src="/assets/exclamation-octagon-purple.svg" alt="" />
          <span>LONGEVITY VERIFIED</span>
        </div>
      </div>
    </aside>
  );
}
