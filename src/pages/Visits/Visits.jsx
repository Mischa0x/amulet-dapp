/**
 * Visits Page - Redesigned
 *
 * Clean, compact design following rewards page methodology.
 * Shows visit summary stats and collapsible list of visits.
 * Integrates with VisitFlow for completing questionnaires.
 */

import React, { useState, useEffect } from "react";
import { VisitFlow } from "../../components/visits";
import styles from "./Visits.module.css";

// API URL - empty string uses same origin (Vercel Functions)
const API_URL = import.meta.env.VITE_API_URL || "";

// Mock visits data (fallback when API is not available)
const MOCK_VISITS = [
  {
    id: 1,
    orderId: 1,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "Jan 9, 2025",
    status: "pending",
    visitType: "ED",
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
    orderId: 2,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "Aug 22, 2025",
    status: "approved",
    visitType: "WEIGHTLOSS",
    consultationType: "Follow-up Visit",
    price: 149,
    reason: "Follow-up on longevity protocol and lab results review",
    items: [
      { name: "Lab Panel Review", type: "Service", price: 149 },
    ],
  },
  {
    id: 3,
    orderId: 3,
    doctorName: "Dr. Katherine Voss",
    specialization: "Longevity Medicine",
    date: "Aug 15, 2025",
    status: "denied",
    visitType: "GENERAL",
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
    icon: "...",
  },
  in_review: {
    label: "In Review",
    className: styles.statusPending,
    icon: "...",
  },
  approved: {
    label: "Approved",
    className: styles.statusApproved,
    icon: "OK",
  },
  completed: {
    label: "Completed",
    className: styles.statusApproved,
    icon: "OK",
  },
  denied: {
    label: "Denied",
    className: styles.statusDenied,
    icon: "X",
  },
  rejected: {
    label: "Rejected",
    className: styles.statusDenied,
    icon: "X",
  },
  cancelled: {
    label: "Cancelled",
    className: styles.statusDenied,
    icon: "X",
  },
};

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [activeFlow, setActiveFlow] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // No auth, use mock data
        setVisits(MOCK_VISITS);
        setLoading(false);
        return;
      }

      // Try to fetch real visits
      // For now, we'll use mock data since the visits list API isn't implemented yet
      // In production, this would call /api/visits to get user's visits
      setVisits(MOCK_VISITS);
      setLoading(false);
    } catch (err) {
      // Fallback to mock data
      setVisits(MOCK_VISITS);
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: visits.length,
    pending: visits.filter(v => v.status === "pending" || v.status === "in_review").length,
    approved: visits.filter(v => v.status === "approved" || v.status === "completed").length,
    denied: visits.filter(v => v.status === "denied" || v.status === "rejected" || v.status === "cancelled").length,
  };

  const displayedVisits = showAll ? visits : visits.slice(0, 3);

  const toggleExpand = (id) => {
    setExpandedVisit(expandedVisit === id ? null : id);
  };

  const handleStartQuestionnaire = (visit) => {
    setActiveFlow({
      visit,
      orderId: visit.orderId,
      visitType: visit.visitType || "GENERAL"
    });
  };

  const handleFlowClose = () => {
    setActiveFlow(null);
  };

  const handleFlowSuccess = (data) => {
    // Update the visit status locally
    setVisits(prev => prev.map(v =>
      v.id === activeFlow.visit.id
        ? { ...v, status: "in_review" }
        : v
    ));
    // Refresh visits after a short delay
    setTimeout(fetchVisits, 1000);
  };

  if (activeFlow) {
    return (
      <div className={styles.page}>
        <VisitFlow
          visit={activeFlow.visit}
          orderId={activeFlow.orderId}
          visitType={activeFlow.visitType}
          onClose={handleFlowClose}
          onSuccess={handleFlowSuccess}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Doctor Visits</h1>
            <span className={styles.subtitle}>{stats.total} total visits</span>
          </div>
          <button
            type="button"
            className={styles.newVisitButton}
            onClick={() => handleStartQuestionnaire({ id: Date.now(), orderId: Date.now(), visitType: "GENERAL" })}
          >
            + New Visit
          </button>
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

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <span>Loading visits...</span>
            </div>
          ) : (
            <div className={styles.visitsList}>
              {displayedVisits.map((visit) => {
                const config = STATUS_CONFIG[visit.status] || STATUS_CONFIG.pending;
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
                          V
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
                            <button
                              className={styles.primaryButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartQuestionnaire(visit);
                              }}
                            >
                              Complete Questionnaire
                            </button>
                            <button className={styles.secondaryButton}>
                              Cancel Visit
                            </button>
                          </div>
                        )}

                        {(visit.status === "approved" || visit.status === "completed") && (
                          <div className={styles.actionRow}>
                            <button className={styles.primaryButton}>
                              View Prescription
                            </button>
                            <button className={styles.secondaryButton}>
                              Message Doctor
                            </button>
                          </div>
                        )}

                        {visit.status === "in_review" && (
                          <div className={styles.reviewNotice}>
                            <span className={styles.reviewIcon}>...</span>
                            <span>A physician is reviewing your case. You will be notified when a decision is made.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {visits.length > 3 && (
            <button
              className={styles.expandButton}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Show Less
                  <span className={styles.expandArrow}>^</span>
                </>
              ) : (
                <>
                  View All Visits ({visits.length})
                  <span className={styles.expandArrow}>v</span>
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
