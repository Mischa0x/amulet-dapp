// ShopProductGrid.jsx
import styles from "./ShopProductGrid.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../../store/CartContext";

const skillToBadgeClass = (skill) => {
  const s = (skill || "").toUpperCase();
  if (s === "RESTORATION") return styles.badgeRestoration;
  if (s === "VITALITY") return styles.badgeVitality;
  if (s === "REGEN") return styles.badgeRegen;
  if (s === "HORMONAL") return styles.badgeHormonal;
  if (s === "CLARITY") return styles.badgeClarity;
  if (s === "ALTERNATIVE") return styles.badgeAlternative;
  if (s === "METABOLICS") return styles.badgeMetabolics;
  if (s === "LONGEVITY") return styles.badgeLongevity;
  if (s === "STRUCTURE") return styles.badgeStructure;
  return "";
};

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

export default function ShopProductGrid({
  products = [],
  searchQuery = "",
  selectedSkill = "ALL",
}) {
  const { addItem } = useCart();

  const normalizedSkill = (selectedSkill || "ALL").toUpperCase();
  const q = (searchQuery || "").toLowerCase();

  const filtered = products.filter((p) => {
    // 🔍 filtro por texto (usa los mismos campos que antes en ShopCatalog)
    const text = `${p.title || p.name || ""} ${
      p.subtitle || ""
    } ${p.tags?.join(" ") || ""}`.toLowerCase();
    const matchesSearch = q ? text.includes(q) : true;

    // 🧬 filtro por skill
    const productSkill = (p.skill || "").toUpperCase();
    const matchesSkill =
      normalizedSkill === "ALL" ? true : productSkill === normalizedSkill;

    return matchesSearch && matchesSkill;
  });

  return (
    <section className={styles.grid} aria-label="Products">
      {filtered.map((p) => (
        <article
          key={p.id}
          className={styles.card}
          aria-labelledby={`title-${p.id}`}
        >
          <Link
            to={`/product/${p.id}`}
            className={styles.cardLink}
            aria-label={`View ${p.name}`}
          >
            <div className={styles.cardContent}>
              {p.skill && (
                <div
                  className={`${styles.badge} ${skillToBadgeClass(p.skill)}`}
                >
                  {p.badgeIcon && (
                    <img
                      className={styles.badgeIcon}
                      src={p.badgeIcon}
                      alt=""
                    />
                  )}
                  <span className={styles.badgeText}>{p.skill}</span>
                </div>
              )}

              <div className={styles.mediaRect}>
                {p.skill && (
                  <img
                    className={styles.skillIcon}
                    src={skillToIcon(p.skill)}
                    alt={p.skill}
                  />
                )}
              </div>

              <div className={styles.body}>
                <h3
                  id={`title-${p.id}`}
                  className={styles.title}
                  title={p.name}
                >
                  {p.name}
                </h3>
                {p.description && (
                  <p className={styles.desc}>{p.description}</p>
                )}
              </div>
            </div>
          </Link>

          <div className={styles.footer}>
            <div className={styles.separator} aria-hidden="true" />
            <button
              type="button"
              className={styles.cta}
              onClick={() => addItem(p, 1)}
              aria-label={`Add ${p.name} to cart`}
            >
              <span className={styles.ctaLabel}>ADD TO CART</span>
              <span className={styles.ctaPrice}>
                {typeof p.price === "number" ? `${p.price.toFixed(2)} $` : ""}
              </span>
              <img
                src="/assets/cart-plus.svg"
                alt=""
                aria-hidden="true"
                className={styles.ctaIconPlus}
              />
            </button>
          </div>
        </article>
      ))}

      {filtered.length === 0 && (
        <p className={styles.emptyState}>
          No results. Try a different filter or search term.
        </p>
      )}
    </section>
  );
}
