/**
 * Visit Consent Component
 * Handles telehealth and privacy consent agreements
 */
import React, { useState } from "react";
import styles from "./VisitConsent.module.css";

const CONSENT_ITEMS = [
  {
    id: "telehealth",
    title: "Telehealth Consent",
    required: true,
    content: `I understand and agree to the following:

1. Telehealth involves the use of electronic communications to enable health care providers to share individual patient medical information for the purpose of diagnosis, treatment, follow-up and/or education.

2. I understand that the laws that protect privacy and the confidentiality of medical information also apply to telemedicine.

3. I understand that I have the right to withhold or withdraw my consent to the use of telemedicine in the course of my care at any time.

4. I understand that I may expect the anticipated benefits from the use of telemedicine in my care, but that no results can be guaranteed or assured.

5. I understand that my healthcare information may be shared with other individuals for scheduling and billing purposes.

6. I have read and understand the information provided above regarding telemedicine, and I hereby give my informed consent to participate in a telemedicine visit.`
  },
  {
    id: "privacy",
    title: "Privacy Policy Consent",
    required: true,
    content: `I acknowledge that I have read and understand the Privacy Policy.

1. I consent to the collection, use, and disclosure of my personal health information for the purposes of diagnosis, treatment, and healthcare operations.

2. I understand that my information will be stored securely and only accessed by authorized healthcare providers and staff.

3. I understand that I may request access to my medical records at any time.

4. I understand that my information will not be sold or shared with third parties for marketing purposes.

5. I consent to receive communications regarding my healthcare via email, text message, or phone.`
  },
  {
    id: "hipaa",
    title: "HIPAA Authorization",
    required: false,
    content: `By signing below, I authorize the release of my health information in accordance with the Health Insurance Portability and Accountability Act (HIPAA).

This authorization allows healthcare providers to share my medical information for the purposes of treatment coordination, billing, and healthcare operations.

I understand that I may revoke this authorization at any time by submitting a written request.`
  }
];

export default function VisitConsent({ onComplete, onBack }) {
  const [consents, setConsents] = useState({});
  const [expandedItem, setExpandedItem] = useState(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const requiredConsents = CONSENT_ITEMS.filter(c => c.required);
  const allRequiredChecked = requiredConsents.every(c => consents[c.id]);

  const handleToggle = (id) => {
    setConsents(prev => ({ ...prev, [id]: !prev[id] }));
    setError("");
  };

  const handleSubmit = () => {
    if (!allRequiredChecked) {
      setError("Please agree to all required consents");
      return;
    }
    if (!signature.trim()) {
      setError("Please enter your signature");
      return;
    }

    onComplete({
      consents,
      signature,
      signedAt: new Date().toISOString()
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Consent & Agreements</h2>
        <p className={styles.subtitle}>
          Please review and agree to the following to proceed with your visit
        </p>
      </div>

      <div className={styles.consentList}>
        {CONSENT_ITEMS.map((item) => (
          <div key={item.id} className={styles.consentItem}>
            <div className={styles.consentHeader}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={consents[item.id] || false}
                  onChange={() => handleToggle(item.id)}
                  className={styles.checkbox}
                />
                <span className={styles.consentTitle}>
                  {item.title}
                  {item.required && <span className={styles.required}>*</span>}
                </span>
              </label>
              <button
                type="button"
                className={styles.expandButton}
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              >
                {expandedItem === item.id ? "Hide" : "View"}
              </button>
            </div>

            {expandedItem === item.id && (
              <div className={styles.consentContent}>
                {item.content.split('\n').map((line, idx) => (
                  <p key={idx} className={styles.contentLine}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.signatureSection}>
        <label className={styles.signatureLabel}>
          Electronic Signature <span className={styles.required}>*</span>
        </label>
        <p className={styles.signatureHint}>
          Type your full legal name as your electronic signature
        </p>
        <input
          type="text"
          value={signature}
          onChange={(e) => {
            setSignature(e.target.value);
            setError("");
          }}
          placeholder="Your full name"
          className={styles.signatureInput}
        />
      </div>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onBack}
          className={styles.backButton}
        >
          Back to Questionnaire
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={!allRequiredChecked || !signature.trim()}
        >
          Submit for Review
        </button>
      </div>
    </div>
  );
}
