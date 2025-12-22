// visits.js
import React, { useState } from "react";
import styles from "./visits.module.css";
import PrivacyPolicyAgreement from "../../components/Questionnaries/PrivacyPolicyAgreement.jsx";


const VISITS = [
  {
    id: 1,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "01.09.2025",
    status: "pending",
    consultationName: "Longevity Consultation",
    consultationPrice: "$ 299.00",
    visitReason: "Longevity enhancement optimization and metabolic assessment",
    statusMessage:
      "Your longevity enhancement protocol has been sent to the doctor for review.",
  },
  {
    id: 2,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "22.08.2025",
    status: "approved",
    consultationName: "Longevity Consultation",
    consultationPrice: "$ 299.00",
    visitReason: "Follow-up on longevity protocol and lab results review.",
    statusMessage:
      "Your visit has been approved. You can proceed with the scheduled consultation.",
  },
  {
    id: 3,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "22.08.2025",
    status: "denied",
    consultationName: "Longevity Consultation",
    consultationPrice: "$ 299.00",
    visitReason: "Longevity consultation request with incomplete data.",
    statusMessage:
      "Your visit request was not approved. Please review the requirements and try again.",
  },
];

// Config para clases/íconos según estado
const STATUS_CONFIG = {
  pending: {
    label: "PENDING QUESTIONNAIRE",
    cardClass: styles.cardBlue,
    chipClass: styles.chipWarn,
    textClass: styles.statusTextWarn,
    icon: "/assets/bx-time.svg",
    iconAlt: "Pending",
  },
  approved: {
    label: "APPROVED",
    cardClass: styles.cardGrey,
    chipClass: styles.chipOk,
    textClass: styles.statusTextOk,
    icon: "/assets/checkbox-approved-green.svg",
    iconAlt: "Approved",
  },
  denied: {
    label: "DENIED",
    cardClass: styles.cardGrey,
    chipClass: styles.chipErr,
    textClass: styles.statusTextErr,
    icon: "/assets/cancel-red.svg",
    iconAlt: "Denied",
  },
  payment: {
    label: "PAYMENT PENDING",
    text: " - PAYMENT PENDING",
  },
};

export default function Visits() {
  const [selectedVisit, setSelectedVisit] = useState(VISITS[0]);
  const [activeTab, setActiveTab] = useState("privacy"); 

  const selectedConfig = STATUS_CONFIG[selectedVisit.status];

  return (
    <div className={styles.visitsOverview}>
      <div className={styles.container}>
        {/* Page title */}
        <div className={styles.pageTitle}>
          <span className={styles.pageTitleText}>LONGEVITY DOCTOR VISITS</span>
        </div>

        {/* Main grid: left list + right panel */}
        <div className={styles.mainGrid}>
          {/* LEFT — visits list */}
          <div className={styles.leftCol}>
            {VISITS.map((visit) => {
              const config = STATUS_CONFIG[visit.status];
              const isActive = selectedVisit.id === visit.id;

              return (
                <div
                  key={visit.id}
                  className={`${styles.card} ${config.cardClass} ${
                    isActive ? styles.cardActive : ""
                  }`}
                  onClick={() => setSelectedVisit(visit)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedVisit(visit);
                    }
                  }}
                >
                  <div className={styles.cardMeta}>
                    <div className={styles.cardTitle}>{visit.doctorName}</div>
                    <div className={styles.cardSubtitle}>
                      {visit.specialization}
                    </div>
                    <div className={styles.cardDate}>{visit.date}</div>
                  </div>

                  <div
                    className={`${styles.statusChip} ${config.chipClass}`}
                  >
                    <span className={styles.statusIconWrap}>
                      <img
                        className={styles.statusIcon}
                        src={config.icon}
                        alt={config.iconAlt}
                      />
                    </span>
                    
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — panel (dinámico según selectedVisit) */}
          <div className={styles.rightCol}>
            <div className={styles.panelHeader}>
              <div
                className={`${styles.statusChip} ${selectedConfig.chipClass}`}
              >
                <span className={styles.statusIconWrap}>
                  <img
                    className={styles.statusIcon}
                    src={selectedConfig.icon}
                    alt={selectedConfig.iconAlt}
                  />
                </span>
                <span className={selectedConfig.textClass}>
                  {selectedConfig.label}
                </span>
               
              </div>


                   <div
                className={`${styles.statusChip} ${selectedConfig.chipClass}`}
              >
                <span className={styles.statusIconWrap}>
                  <img
                    className={styles.statusIcon}
                    src={selectedConfig.icon}
                    alt={selectedConfig.iconAlt}
                  />
                </span>
                <span className={selectedConfig.textClass}>
                 PAYMENT PENDING
                </span>
               
              </div>


            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoSection}>
                <div className={styles.infoTitle}>ORDER ITEMS</div>
                <div className={styles.infoRow}>
                  <span className={styles.statusIconWrap}>
                    <img
                      className={styles.statusIcon}
                      src={selectedConfig.icon}
                      alt={selectedConfig.iconAlt}
                    />
                  </span>
                  <p className={styles.infoText}>
                   Sildenafil 50mg
Medication
Sildenafil Citrate 50mg oral tablet for erectile dysfunction treatment. Effective PDE5 inhibitor for improved blood flow.

Vendor: Health Labs Inc. $29.99
                  </p>
                </div>

                    <div className={styles.infoRow}>
                  <span className={styles.statusIconWrap}>
                    <img
                      className={styles.statusIcon}
                      src={selectedConfig.icon}
                      alt={selectedConfig.iconAlt}
                    />
                  </span>
                  <p className={styles.infoText}>
Doctor Visit
Medication
Doctor Visit - Required for medication prescription and revision

Vendor: Wellness Pharmacy $100.00

                  </p>
                </div>

                
              </div>
            </div>
              <div className={styles.infoTitle}>VISIT DETAILS</div>
<div className={styles.tabsRow}>
  <div
    className={`${styles.tabChip} ${activeTab === "privacy" ? styles.tabActive : ""}`}
    role="button"
    tabIndex={0}
    onClick={() => setActiveTab("privacy")}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("privacy")}
  >
    <span className={activeTab === "privacy" ? styles.tabTextActive : styles.tabText}>
      PRIVACY POLICY AGREEMENT
    </span>
  </div>

  <div
    className={`${styles.tabChip} ${activeTab === "medications" ? styles.tabActive : ""}`}
    role="button"
    tabIndex={0}
    onClick={() => setActiveTab("medications")}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("medications")}
  >
    <span className={activeTab === "medications" ? styles.tabTextActive : styles.tabText}>
      MEDICATIONS
    </span>
  </div>

  <div
    className={`${styles.tabChip} ${activeTab === "assessments" ? styles.tabActive : ""}`}
    role="button"
    tabIndex={0}
    onClick={() => setActiveTab("assessments")}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("assessments")}
  >
    <span className={activeTab === "assessments" ? styles.tabTextActive : styles.tabText}>
      ASSESSMENTS
    </span>
  </div>

  <div
    className={`${styles.tabChip} ${activeTab === "requirements" ? styles.tabActive : ""}`}
    role="button"
    tabIndex={0}
    onClick={() => setActiveTab("requirements")}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveTab("requirements")}
  >
    <span className={activeTab === "requirements" ? styles.tabTextActive : styles.tabText}>
      REQUIREMENTS
    </span>
  </div>
</div>


         {activeTab === "privacy" && <PrivacyPolicyAgreement />}

{activeTab === "medications" && (
  <div className={styles.detailsCard}>
    <div className={styles.detailLong}>
      <div className={styles.detailBlock}>
        <div className={styles.detailLabel}>MEDICATIONS</div>
        <p className={styles.detailBody}>Coming next…</p>
      </div>
    </div>
  </div>
)}

{activeTab === "assessments" && (
  <div className={styles.detailsCard}>
    <div className={styles.detailLong}>
      <div className={styles.detailBlock}>
        <div className={styles.detailLabel}>ASSESSMENTS</div>
        <p className={styles.detailBody}>Coming next…</p>
      </div>
    </div>
  </div>
)}

{activeTab === "requirements" && (
  <div className={styles.detailsCard}>
    <div className={styles.detailLong}>
      <div className={styles.detailBlock}>
        <div className={styles.detailLabel}>REQUIREMENTS</div>
        <p className={styles.detailBody}>Coming next…</p>
      </div>
    </div>
  </div>
)}

          </div>
        </div>

        {/* trailing icon */}
        <div className={styles.trailingIcon}>
          <img
            className={styles.infiniteOutline}
            src="/assets/infinite-outline.svg"
            alt="Amulet infinite"
          />
        </div>
      </div>
    </div>
  );
}
