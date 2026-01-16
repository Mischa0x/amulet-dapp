// src/pages/Product/ProductPage.jsx
import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import styles from "./ProductPage.module.css";
import { getProductById } from "../../services/ProductsService";
import { useCart } from "../../store/CartContext";

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

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const product = useMemo(() => getProductById(id), [id]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const incrementQuantity = () => setQuantity((q) => q + 1);

  if (!product) {
    return (
      <div className={styles.productPage}>
        <div className={styles.container}>
          <p>Product not found.</p>
          <Link to="/shop">← Back to catalog</Link>
        </div>
      </div>
    );
  }

  const {
    name = "Unnamed product",
    description = "",
    price = 0,
    cycles = 60,
    inventoryAvailable = true,
    metrics = { calmRise: 0.6, clarityRise: 0.7 },
    dosageProtocol = "See label",
    cycleCount = cycles ?? 60,
    composition = [],
    skill = "RESTORATION",
    category = "",
  } = product;

  const calmPct = Math.round((metrics?.calmRise ?? 0) * 100);
  const clarityPct = Math.round((metrics?.clarityRise ?? 0) * 100);
  const totalPrice = (price * quantity).toFixed(2);

  const handleAddToCart = () => {
    if (!inventoryAvailable || quantity < 1) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        {/* Back link */}
        <Link to="/shop" className={styles.backLink}>
          ← Back to shop
        </Link>

        <div className={styles.layout}>
          {/* Left: Icon + Badge */}
          <div className={styles.iconSection}>
            <div className={styles.iconWrapper}>
              <img
                className={styles.skillIcon}
                src={skillToIcon(skill)}
                alt={skill}
              />
            </div>
            <div className={styles.badgeRow}>
              <span className={styles.skillBadge}>{String(skill).toUpperCase()}</span>
              {category && <span className={styles.categoryBadge}>{category}</span>}
            </div>
          </div>

          {/* Right: Details */}
          <div className={styles.detailsSection}>
            {/* Header */}
            <header className={styles.header}>
              <h1 className={styles.title}>{name}</h1>
              {description && <p className={styles.description}>{description}</p>}
            </header>

            {/* Metrics */}
            <div className={styles.metricsSection}>
              <div className={styles.metricsHeader}>
                <img src="/assets/heartbeatBlue.svg" alt="" className={styles.metricsIcon} />
                <span>ENHANCEMENT METRICS</span>
              </div>
              <div className={styles.metricsGrid}>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>CALM RISE</span>
                  <div className={styles.meter}>
                    <div className={styles.meterTrack}>
                      <div
                        className={styles.meterFill}
                        style={{ width: `${Math.min(100, Math.max(0, calmPct))}%` }}
                      />
                    </div>
                    <span className={styles.metricValue}>+{calmPct}%</span>
                  </div>
                </div>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>CLARITY RISE</span>
                  <div className={styles.meter}>
                    <div className={styles.meterTrack}>
                      <div
                        className={styles.meterFill}
                        style={{ width: `${Math.min(100, Math.max(0, clarityPct))}%` }}
                      />
                    </div>
                    <span className={styles.metricValue}>+{clarityPct}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs Row */}
            <div className={styles.specsRow}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>DOSAGE</span>
                <span className={styles.specValue}>{dosageProtocol}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>CYCLES</span>
                <span className={styles.specValue}>{cycleCount}</span>
              </div>
              {composition?.length > 0 && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>COMPOSITION</span>
                  <div className={styles.compositionChips}>
                    {composition.map((item, idx) => (
                      <span key={idx} className={styles.chip}>{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Section */}
            <div className={styles.purchaseSection}>
              <div className={styles.priceRow}>
                <div className={styles.priceBlock}>
                  <span className={styles.price}>${price.toFixed(2)}</span>
                  <span className={styles.cycleLabel}>{cycleCount} cycles</span>
                </div>
                <span className={`${styles.stockBadge} ${inventoryAvailable ? styles.inStock : styles.outOfStock}`}>
                  {inventoryAvailable ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>

              <div className={styles.purchaseControls}>
                <div className={styles.quantityControls}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={decrementQuantity}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={incrementQuantity}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={`${styles.ctaButton} ${added ? styles.ctaAdded : ""}`}
                  onClick={handleAddToCart}
                  disabled={!inventoryAvailable}
                >
                  <img src="/assets/shopping-bag-white.svg" alt="" className={styles.ctaIcon} />
                  <span>{added ? "Added!" : `Add to cart — $${totalPrice}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
