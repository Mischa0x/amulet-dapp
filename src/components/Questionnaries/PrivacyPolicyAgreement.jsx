import React from "react";
import styles from "../../pages/Checkout/Checkout.module.css";

export default function PrivacyPolicyAgreement() {
  return (
    <div className={styles.shippingPage}>
      <div className={styles.contentGrid}>
        <section
          className={styles.formCard}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
        >
          <div className={styles.formBody}>
            {/* =======================
                Header
               ======================= */}
            <div className={styles.sectionHeaderRow}>
              <h2 id="privacy-title" className={styles.sectionTitle}>
                Privacy Policy Agreement
              </h2>

              <button
                type="button"
                className={styles.linkInline}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className={styles.noteTiny}>
              Please review and agree to our privacy policy.
            </p>

            {/* =======================
                Document panel
               ======================= */}
            <div className={styles.cardRow}>
              <div className={styles.cardRowLeft}>
                <div className={styles.cardCol}>
                  <div className={styles.cardTitle}>
                    Please review the document by clicking the link below:
                  </div>
                </div>
              </div>

              <button type="button" className={styles.addToOrderBtn}>
                Open Document
              </button>
            </div>

            {/* =======================
                Agreement checkbox
               ======================= */}
            <label className={styles.checkRow}>
              <input type="checkbox" />
              <span>
                I have read and agree to the terms and conditions outlined in the
                document.
              </span>
            </label>

            <br />

            {/* =======================
                Actions
               ======================= */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button type="button" className={styles.linkInline}>
                Cancel
              </button>

              <button type="button" className={styles.payNowBtn}>
                Agree &amp; Continue
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
