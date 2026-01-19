/**
 * Visits Page - Redesigned
 *
 * Clean, compact design following rewards page methodology.
 * Shows visit summary stats and collapsible list of visits.
 */

import React, { useState } from "react";
import styles from "./Visits.module.css";

// Mock visits data
const VISITS = [
  {
    id: 1,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "Jan 9, 2025",
    status: "pending",
    consultationType: "Longevity Consultation",
    price: 299,
    reason: "Longevity enhancement optimization and metabolic assessment",
    items: [
      { name: "Sildenafil 50mg", type: "Medication", price: 29.99 },
      { name: "Doctor Consultation", type: "Service", price: 100 },
    ],
  },
  {
    id: 2,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "Aug 22, 2025",
    status: "approved",
    consultationType: "Follow-up Visit",
    price: 149,
    reason: "Follow-up on longevity protocol and lab results review",
    items: [
      { name: "Lab Panel Review", type: "Service", price: 149 },
    ],
  },
  {
    id: 3,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "Aug 15, 2025",
    status: "denied",
    consultationType: "Initial Consultation",
    price: 299,
    reason: "Incomplete medical history documentation",
    items: [],
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: styles.statusPending,
    icon: "⏳",
  },
  approved: {
    label: "Approved",
    className: styles.statusApproved,
    icon: "✓",
  },
  denied: {
    label: "Denied",
    className: styles.statusDenied,
    icon: "✕",
  },
};

export default function Visits() {
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Calculate stats
  const stats = {
    total: VISITS.length,
    pending: VISITS.filter(v => v.status === "pending").length,
    approved: VISITS.filter(v => v.status === "approved").length,
    denied: VISITS.filter(v => v.status === "denied").length,
  };

  const displayedVisits = showAll ? VISITS : VISITS.slice(0, 3);

  const toggleExpand = (id) => {
    setExpandedVisit(expandedVisit === id ? null : id);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Doctor Visits</h1>
          <span className={styles.subtitle}>{stats.total} total visits</span>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Visits</span>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statValue} ${styles.pendingValue}`}>{stats.pending}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statValue} ${styles.approvedValue}`}>{stats.approved}</span>
            <span className={styles.statLabel}>Approved</span>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statValue} ${styles.deniedValue}`}>{stats.denied}</span>
            <span className={styles.statLabel}>Denied</span>
          </div>
        </div>

        {/* Visits List */}
        <div className={styles.visitsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Visits</h2>
          </div>

          <div className={styles.visitsList}>
            {displayedVisits.map((visit) => {
              const config = STATUS_CONFIG[visit.status];
              const isExpanded = expandedVisit === visit.id;

              return (
                <div
                  key={visit.id}
                  className={`${styles.visitCard} ${isExpanded ? styles.expanded : ''}`}
                >
                  <div
                    className={styles.visitHeader}
                    onClick={() => toggleExpand(visit.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.visitMain}>
                      <div className={styles.visitInfo}>
                        <span className={styles.visitDoctor}>{visit.doctorName}</span>
                        <span className={styles.visitType}>{visit.consultationType}</span>
                      </div>
                      <div className={styles.visitMeta}>
                        <span className={styles.visitDate}>{visit.date}</span>
                        <span className={styles.visitPrice}>${visit.price}</span>
                      </div>
                    </div>
                    <div className={styles.visitRight}>
                      <span className={`${styles.statusBadge} ${config.className}`}>
                        <span className={styles.statusIcon}>{config.icon}</span>
                        {config.label}
                      </span>
                      <span className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.visitDetails}>
                      <div className={styles.detailSection}>
                        <span className={styles.detailLabel}>Reason for Visit</span>
                        <p className={styles.detailText}>{visit.reason}</p>
                      </div>

                      {visit.items.length > 0 && (
                        <div className={styles.detailSection}>
                          <span className={styles.detailLabel}>Order Items</span>
                          <div className={styles.itemsList}>
                            {visit.items.map((item, idx) => (
                              <div key={idx} className={styles.orderItem}>
                                <div className={styles.itemInfo}>
                                  <span className={styles.itemName}>{item.name}</span>
                                  <span className={styles.itemType}>{item.type}</span>
                                </div>
                                <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {visit.status === "pending" && (
                        <div className={styles.actionRow}>
                          <button className={styles.primaryButton}>
                            Complete Questionnaire
                          </button>
                          <button className={styles.secondaryButton}>
                            Cancel Visit
                          </button>
                        </div>
                      )}

                      {visit.status === "approved" && (
                        <div className={styles.actionRow}>
                          <button className={styles.primaryButton}>
                            View Prescription
                          </button>
                          <button className={styles.secondaryButton}>
                            Message Doctor
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {VISITS.length > 3 && (
            <button
              className={styles.expandButton}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Show Less
                  <span className={styles.expandArrow}>▲</span>
                </>
              ) : (
                <>
                  View All Visits ({VISITS.length})
                  <span className={styles.expandArrow}>▼</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Info Card */}
        <div className={styles.infoCard}>
          <div className={styles.infoTitle}>How Doctor Visits Work</div>
          <div className={styles.infoText}>
            Complete the required questionnaires and consent forms. A licensed physician will review
            your information and either approve your prescription or request additional details.
            Approved prescriptions are sent directly to our partner pharmacy.
          </div>
        </div>
      </div>
    </div>
  );
}
