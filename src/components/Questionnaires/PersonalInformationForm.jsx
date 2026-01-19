import React from "react";
import styles from "../../pages/Checkout/Checkout.module.css";

export default function PersonalInformationForm() {
  return (
    <div className={styles.shippingPage}>
      <div className={styles.contentGridQuestionnaries}>
        <section className={styles.formCard} aria-labelledby="pi-title">
          <div className={styles.formBody}>
            {/* =======================
                Personal Information
               ======================= */}
            <div className={styles.sectionHeaderRow}>
              <h2 id="pi-title" className={styles.sectionTitle}>
                Personal Information
              </h2>
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.float}>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="firstName" className={styles.floatLabel}>
                  First Name *
                </label>
              </div>

              <div className={styles.float}>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="lastName" className={styles.floatLabel}>
                  Last Name *
                </label>
              </div>
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.float}>
                <input
                  id="dob"
                  name="dob"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="dob" className={styles.floatLabel}>
                  Date of Birth * (MM/DD/YYYY)
                </label>
              </div>

              <div className={styles.float}>
                <select
                  id="sex"
                  name="sex"
                  className={styles.hasFloat}
                  defaultValue=""
                >
                  <option value="" disabled hidden></option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
                <label htmlFor="sex" className={styles.floatLabel}>
                  Sex *
                </label>
              </div>
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.float}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="phone" className={styles.floatLabel}>
                  Phone Number * (US format)
                </label>
              </div>

              <div className={styles.float}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="email" className={styles.floatLabel}>
                  Contact Email *
                </label>
              </div>
            </div>

            {/* helper notes under the row */}
            <div className={styles.rowTwo} style={{ marginTop: "-6px" }}>
              <p className={styles.noteTiny} style={{ margin: 0 }}>
                Enter a valid US phone number (10 digits, numbers only)
              </p>
              <p className={styles.noteTiny} style={{ margin: 0 }}>
                This email will be used for doctor communication and order updates
              </p>
            </div>

            <br />

            {/* =======================
                Address Information
               ======================= */}
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>Address Information</h2>
            </div>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="street"
                  name="street"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="street" className={styles.floatLabel}>
                  Street Address *
                </label>
              </div>
            </div>

            <div className={styles.rowTwo}>
              <div className={styles.float}>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="city" className={styles.floatLabel}>
                  City *
                </label>
              </div>

              <div className={styles.float}>
                <select
                  id="state"
                  name="state"
                  className={styles.hasFloat}
                  defaultValue=""
                >
                  <option value="" disabled hidden></option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                  {/* add the rest later */}
                </select>
                <label htmlFor="state" className={styles.floatLabel}>
                  State *
                </label>
              </div>
            </div>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="zip" className={styles.floatLabel}>
                  ZIP Code *
                </label>
              </div>
            </div>

            <br />

            {/* =======================
                Action
               ======================= */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className={styles.payNowBtn}>
                Complete Setup
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
