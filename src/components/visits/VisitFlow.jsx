/**
 * Visit Flow Component
 * Orchestrates the complete visit submission flow:
 * 1. Questionnaire
 * 2. Consent
 * 3. Submit to Doctor (Beluga)
 */
import React, { useState } from "react";
import VisitQuestionnaire from "./VisitQuestionnaire";
import VisitConsent from "./VisitConsent";
import styles from "./VisitFlow.module.css";

// API URL - empty string uses same origin (Vercel Functions)
const API_URL = import.meta.env.VITE_API_URL || "";

const STEPS = {
  QUESTIONNAIRE: "questionnaire",
  CONSENT: "consent",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error"
};

export default function VisitFlow({ visit, orderId, visitType = "GENERAL", onClose, onSuccess }) {
  const [step, setStep] = useState(STEPS.QUESTIONNAIRE);
  const [questionnaireResponses, setQuestionnaireResponses] = useState(null);
  const [error, setError] = useState(null);
  const [masterId, setMasterId] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  const handleQuestionnaireComplete = async (responses) => {
    setQuestionnaireResponses(responses);

    // Save questionnaire to API
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/visits/questionnaire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          questionnaireType: visitType,
          responses
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save questionnaire");
      }

      setStep(STEPS.CONSENT);
    } catch (err) {
      setError(err.message);
      setStep(STEPS.ERROR);
    }
  };

  const handleConsentComplete = async (consentData) => {
    setStep(STEPS.SUBMITTING);

    try {
      const token = getAuthToken();

      // Save each consent
      for (const [consentType, agreed] of Object.entries(consentData.consents)) {
        if (agreed) {
          await fetch(`${API_URL}/api/visits/consent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : ""
            },
            credentials: "include",
            body: JSON.stringify({
              orderId,
              consentType,
              agreed: true
            })
          });
        }
      }

      // Submit to doctor
      const res = await fetch(`${API_URL}/api/visits/send-to-doc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          visitType
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit visit");
      }

      setMasterId(data.masterId);
      setStep(STEPS.SUCCESS);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message);
      setStep(STEPS.ERROR);
    }
  };

  const handleRetry = () => {
    setError(null);
    setStep(STEPS.QUESTIONNAIRE);
  };

  if (step === STEPS.SUBMITTING) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <h3 className={styles.loadingTitle}>Submitting Your Visit</h3>
          <p className={styles.loadingText}>
            Please wait while we submit your information for review...
          </p>
        </div>
      </div>
    );
  }

  if (step === STEPS.SUCCESS) {
    return (
      <div className={styles.container}>
        <div className={styles.successState}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>Visit Submitted Successfully!</h3>
          <p className={styles.successText}>
            Your visit request has been submitted for physician review.
            You will receive a notification once the doctor has reviewed your case.
          </p>
          {masterId && (
            <p className={styles.referenceId}>
              Reference ID: <strong>{masterId}</strong>
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className={styles.doneButton}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (step === STEPS.ERROR) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>!</div>
          <h3 className={styles.errorTitle}>Something Went Wrong</h3>
          <p className={styles.errorText}>{error || "An unexpected error occurred"}</p>
          <div className={styles.errorActions}>
            <button
              type="button"
              onClick={handleRetry}
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${step === STEPS.QUESTIONNAIRE ? styles.active : styles.completed}`}>
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>Questionnaire</span>
        </div>
        <div className={styles.stepConnector} />
        <div className={`${styles.step} ${step === STEPS.CONSENT ? styles.active : ""}`}>
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>Consent</span>
        </div>
      </div>

      {step === STEPS.QUESTIONNAIRE && (
        <VisitQuestionnaire
          visitType={visitType}
          onComplete={handleQuestionnaireComplete}
          onCancel={onClose}
        />
      )}

      {step === STEPS.CONSENT && (
        <VisitConsent
          onComplete={handleConsentComplete}
          onBack={() => setStep(STEPS.QUESTIONNAIRE)}
        />
      )}
    </div>
  );
}
