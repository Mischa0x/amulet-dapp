// ShopFilters.jsx
import { useState } from "react";
import styles from "./ShopFilters.module.css";

const SKILLS = [
  "ALL",
  "ALTERNATIVE",
  "CLARITY",
  "HORMONAL",
  "LONGEVITY",
  "METABOLICS",
  "REGEN",
  "RESTORATION",
  "STRUCTURE",
  "VITALITY",
];

export default function ShopFilters({
  /** Controlled (optional). If omitted, component uses internal state */
  selectedSkill,
  onSkillChange, // (skill: string) => void
  sortBy,
  onSortChange, // (sort: "PRICE" | "NAME") => void
  className,
}) {
  // Fallback a estado interno cuando NO es controlado
  const [skillInternal, setSkillInternal] = useState("ALL");

  const skill = selectedSkill ?? skillInternal;

  const setSkill = (val) => {
    if (onSkillChange) onSkillChange(val);
    else setSkillInternal(val);
  };

  return (
    <section
      className={`${styles.filtersBar} ${className ?? ""}`}
      aria-label="Catalog filters"
    >
      {/* Skills row */}
      <div className={styles.group}>
        <div className={styles.chips} role="tablist" aria-label="Skill">
          {SKILLS.map((s) => {
            const active = s === skill;
            return (
              <button
                key={s}
                role="tab"
                aria-selected={active}
                className={`${styles.chip} ${active ? styles.active : ""}`}
                onClick={() => setSkill(s)}
                title={s}
              >
                <span className={styles.chipText}>{s}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
