/**
 * Visit Questionnaire Component
 * Multi-step medical questionnaire for telemedicine visits
 */
import React, { useState } from "react";
import styles from "./VisitQuestionnaire.module.css";

// Questionnaire questions by visit type
const QUESTIONNAIRE_CONFIG = {
  ED: {
    title: "ED Treatment Questionnaire",
    sections: [
      {
        title: "Medical History",
        questions: [
          {
            id: "ed_symptoms",
            type: "radio",
            question: "How would you describe your erectile dysfunction symptoms?",
            options: [
              "Difficulty achieving an erection",
              "Difficulty maintaining an erection",
              "Both achieving and maintaining",
              "Occasional issues only"
            ]
          },
          {
            id: "ed_duration",
            type: "radio",
            question: "How long have you experienced these symptoms?",
            options: [
              "Less than 3 months",
              "3-6 months",
              "6-12 months",
              "More than 1 year"
            ]
          },
          {
            id: "heart_condition",
            type: "radio",
            question: "Do you have any heart conditions?",
            options: ["No", "Yes - controlled with medication", "Yes - uncontrolled"]
          },
          {
            id: "nitrates",
            type: "radio",
            question: "Do you take nitrate medications (e.g., nitroglycerin)?",
            options: ["No", "Yes"]
          },
          {
            id: "blood_pressure",
            type: "radio",
            question: "Do you have high or low blood pressure?",
            options: ["No", "High blood pressure", "Low blood pressure"]
          }
        ]
      },
      {
        title: "Current Medications",
        questions: [
          {
            id: "current_meds",
            type: "textarea",
            question: "Please list all medications you are currently taking:",
            placeholder: "Enter medication names and dosages..."
          },
          {
            id: "allergies",
            type: "textarea",
            question: "Do you have any known drug allergies?",
            placeholder: "Enter allergies or 'None'..."
          }
        ]
      },
      {
        title: "Lifestyle",
        questions: [
          {
            id: "alcohol",
            type: "radio",
            question: "How often do you consume alcohol?",
            options: ["Never", "Occasionally", "Weekly", "Daily"]
          },
          {
            id: "smoking",
            type: "radio",
            question: "Do you smoke or use tobacco products?",
            options: ["No", "Former smoker", "Yes - occasionally", "Yes - daily"]
          }
        ]
      }
    ]
  },
  WEIGHTLOSS: {
    title: "Weight Loss Treatment Questionnaire",
    sections: [
      {
        title: "Weight History",
        questions: [
          {
            id: "current_weight",
            type: "text",
            question: "What is your current weight (lbs)?",
            placeholder: "Enter weight..."
          },
          {
            id: "height",
            type: "text",
            question: "What is your height (e.g., 5'10\")?",
            placeholder: "Enter height..."
          },
          {
            id: "weight_goal",
            type: "text",
            question: "What is your target weight (lbs)?",
            placeholder: "Enter goal weight..."
          },
          {
            id: "weight_loss_attempts",
            type: "radio",
            question: "Have you tried to lose weight before?",
            options: [
              "No, this is my first attempt",
              "Yes, with diet and exercise only",
              "Yes, with other medications",
              "Yes, with multiple methods"
            ]
          }
        ]
      },
      {
        title: "Medical History",
        questions: [
          {
            id: "diabetes",
            type: "radio",
            question: "Do you have diabetes?",
            options: ["No", "Pre-diabetic", "Type 1", "Type 2"]
          },
          {
            id: "thyroid",
            type: "radio",
            question: "Do you have any thyroid conditions?",
            options: ["No", "Hypothyroidism", "Hyperthyroidism", "Other"]
          },
          {
            id: "eating_disorder",
            type: "radio",
            question: "Have you ever been diagnosed with an eating disorder?",
            options: ["No", "Yes - currently managing", "Yes - in the past"]
          },
          {
            id: "current_meds",
            type: "textarea",
            question: "Please list all medications you are currently taking:",
            placeholder: "Enter medication names and dosages..."
          }
        ]
      },
      {
        title: "Lifestyle",
        questions: [
          {
            id: "exercise",
            type: "radio",
            question: "How often do you exercise?",
            options: ["Rarely/Never", "1-2 times per week", "3-4 times per week", "5+ times per week"]
          },
          {
            id: "diet",
            type: "radio",
            question: "How would you describe your current diet?",
            options: [
              "Mostly processed foods",
              "Mixed - some healthy, some processed",
              "Mostly whole foods",
              "Following a specific diet plan"
            ]
          }
        ]
      }
    ]
  },
  GENERAL: {
    title: "Health Questionnaire",
    sections: [
      {
        title: "General Health",
        questions: [
          {
            id: "reason",
            type: "textarea",
            question: "What is the reason for your visit today?",
            placeholder: "Describe your symptoms or concerns..."
          },
          {
            id: "duration",
            type: "radio",
            question: "How long have you had these symptoms?",
            options: ["Less than a week", "1-2 weeks", "2-4 weeks", "More than a month"]
          },
          {
            id: "current_meds",
            type: "textarea",
            question: "Please list all medications you are currently taking:",
            placeholder: "Enter medication names and dosages..."
          },
          {
            id: "allergies",
            type: "textarea",
            question: "Do you have any known drug allergies?",
            placeholder: "Enter allergies or 'None'..."
          }
        ]
      }
    ]
  }
};

export default function VisitQuestionnaire({ visitType = "GENERAL", onComplete, onCancel }) {
  const config = QUESTIONNAIRE_CONFIG[visitType] || QUESTIONNAIRE_CONFIG.GENERAL;
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const totalSections = config.sections.length;
  const section = config.sections[currentSection];

  const handleChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: null }));
  };

  const validateSection = () => {
    const newErrors = {};
    section.questions.forEach(q => {
      if (!responses[q.id] || responses[q.id].trim() === "") {
        newErrors[q.id] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateSection()) return;

    if (currentSection < totalSections - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{config.title}</h2>
        <div className={styles.progress}>
          <span className={styles.progressText}>
            Section {currentSection + 1} of {totalSections}
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{section.title}</h3>

        <div className={styles.questions}>
          {section.questions.map((q) => (
            <div key={q.id} className={styles.questionBlock}>
              <label className={styles.questionLabel}>{q.question}</label>

              {q.type === "radio" && (
                <div className={styles.radioGroup}>
                  {q.options.map((option, idx) => (
                    <label key={idx} className={styles.radioOption}>
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        checked={responses[q.id] === option}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioLabel}>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "text" && (
                <input
                  type="text"
                  value={responses[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className={styles.textInput}
                />
              )}

              {q.type === "textarea" && (
                <textarea
                  value={responses[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className={styles.textArea}
                  rows={3}
                />
              )}

              {errors[q.id] && (
                <span className={styles.error}>{errors[q.id]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <div className={styles.navButtons}>
          {currentSection > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className={styles.backButton}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className={styles.nextButton}
          >
            {currentSection === totalSections - 1 ? "Continue to Consent" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
