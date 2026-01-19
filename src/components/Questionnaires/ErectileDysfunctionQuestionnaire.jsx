import React from "react";
import styles from "../../pages/Checkout/Checkout.module.css";

export default function ErectileDysfunctionQuestionnaire() {
  return (
    <div className={styles.shippingPage}>
      <div className={styles.contentGridQuestionnaries}>
        <section
          className={styles.formCard}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edq-title"
        >
          <div className={styles.formBody}>
            {/* =======================
                Header
               ======================= */}
            <div className={styles.sectionHeaderRow}>
              <h2 id="edq-title" className={styles.sectionTitle}>
                ED Purchase Questionnaire
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
              Please answer the following questions to help us process your order.
            </p>

            <br />

            {/* =======================
                Q1: Sex assigned at birth
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              What was your sex assigned at birth?
            </h2>

            {["Male", "Female"].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="radio" name="sexAssignedAtBirth" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q2: Height
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              What is your height in feet and inches?
            </h2>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="height"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="height" className={styles.floatLabel}>
                  e.g. 5 ft 10 in or 6 ft 1 in
                </label>
              </div>
            </div>

            <br />

            {/* =======================
                Q3: Weight
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              What is your weight in pounds?
            </h2>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="weight"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="weight" className={styles.floatLabel}>
                  e.g. 180
                </label>
              </div>
            </div>

            <br />

            {/* =======================
                Q4: Medical conditions
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Please identify all your current medical conditions
            </h2>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="conditions"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="conditions" className={styles.floatLabel}>
                  List your medical conditions
                </label>
              </div>
            </div>

            <br />

            {/* =======================
                Q5: Medications
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Please list all your current medications including dosages
            </h2>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="medications"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="medications" className={styles.floatLabel}>
                  List your medications and dosages
                </label>
              </div>
            </div>

            <br />

            {/* =======================
                Q6: Allergies
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Please list all of your known allergies
            </h2>

            <div className={styles.rowOne}>
              <div className={styles.float}>
                <input
                  id="allergies"
                  type="text"
                  placeholder=" "
                  className={styles.hasFloat}
                />
                <label htmlFor="allergies" className={styles.floatLabel}>
                  List your allergies
                </label>
              </div>
            </div>

            <br />

            {/* =======================
                Q7: Erection difficulty
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Do you ever have a problem getting or maintaining an erection that
              is rigid enough for sex?
            </h2>

            {[
              "Yes – every time",
              "Yes – more than half the time",
              "Yes – on occasion",
              "Yes – but rarely",
              "I never have a problem getting or maintaining an erection for as long as I want",
            ].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="radio" name="erectionDifficulty" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q8: Morning erections
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Do you get erections…
            </h2>

            {["When you wake up", "Other times", "Neither"].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="radio" name="morningErections" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q9: Prior ED treatment
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Have you ever been formally treated for ED or tried any medicines,
              vitamins, or supplements to treat it?
            </h2>

            {["Yes", "No"].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="radio" name="priorTreatment" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q10: Physical exam
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Have you had a physical exam with a healthcare provider in the past
              5 years?
            </h2>

            {[
              "Yes, I am in good health",
              "Yes, but they found problems",
              "No",
            ].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="radio" name="physicalExam" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q11: Blood pressure
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Was your blood pressure taken in the past year?
            </h2>

            {[
              "Yes",
              "No, I will get a new blood pressure measurement",
            ].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="radio" name="bloodPressure" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q12: Contraindicated medications
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Do you take any of the following medicines? Select all that apply.
            </h2>

            {[
              "Nitroglycerin spray, ointment, patches or tablets",
              "Isosorbide mononitrate, or isosorbide dinitrate (Isordil, Dilatrate, Sorbitrate, Imdur, Ismo, Monoket)",
              "Other medicines containing nitrates",
              "Alpha blocker medications: doxazosin (Cardura), prazosin (Minipress), terazosin (Hytrin)",
              "Riociguat (Adempas)",
              "None apply",
            ].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="checkbox" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q13: Cardiovascular risk factors
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Do any of the following cardiovascular risk factors apply to you?
              Select all that apply.
            </h2>

            {[
              "Diabetes",
              "High cholesterol",
              "High blood pressure",
              "My father had a heart attack or heart disease at 55 years or younger",
              "My mother had a heart attack or heart disease at 65 years or younger",
              "None apply to me",
            ].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="checkbox" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q14: Diagnosed conditions
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Do you have or have you previously been diagnosed with any of the
              following? Check all that apply.
            </h2>

            {[
              "Prostate cancer",
              "Enlarged prostate (BPH)",
              "Kidney transplant or any condition affecting the kidney",
              "Pulmonary artery hypertension (PAH)",
              "Liver disease",
              "Multiple Sclerosis (MS) or similar disease",
              "Spinal injuries and/or paralysis",
              "Neurological diseases",
              "Stomach, intestinal, or bowel ulcers",
              "Heart arrhythmias (abnormal beating of the heart)",
              "Any acquired, congenital, or developmental abnormalities of the heart including heart murmurs",
              "None of these apply to me",
            ].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="checkbox" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
                Q15: Cardiovascular symptoms
               ======================= */}
            <h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
              Do any of the following cardiovascular symptoms apply to you?
              Select all that apply.
            </h2>

            {[
              "Chest pain or shortness of breath when climbing 2 flights of stairs or walking 4 blocks",
              "Chest pain or shortness of breath with sexual activity",
              "Unexplained fainting or dizziness",
              "Prolonged cramping of the legs with exercise",
              "Abnormal heart beats or rhythms",
              "None of these apply to me",
            ].map((opt) => (
              <label key={opt} className={styles.checkRow}>
                <input type="checkbox" />
                <span>{opt}</span>
              </label>
            ))}

            <br />

            {/* =======================
    Q16: Recreational drugs
   ======================= */}
<h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
  Do you use any of the following recreational drugs? Select all that apply.
</h2>

<p className={styles.noteTiny} style={{ marginTop: 6 }}>
  Severe reactions may result if ED meds are used in conjunction with recreational drugs.
</p>

{[
  "Poppers or Rush",
  "Amyl Nitrate or Butyl Nitrate",
  "Cocaine",
  "Cigarettes",
  "Other",
  "No I don't use any of these",
].map((opt) => (
  <label key={opt} className={styles.checkRow}>
    <input type="checkbox" />
    <span>{opt}</span>
  </label>
))}

<br />

{/* =======================
    Q17: Peyronie's / curvature
   ======================= */}
<h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
  Do you have a marked curve or bend in the penis that interferes with sex, or
  Peyronie's Disease?
</h2>

{["Yes", "No"].map((opt) => (
  <label key={opt} className={styles.checkRow}>
    <input type="radio" name="penileCurve" />
    <span>{opt}</span>
  </label>
))}

<br />

{/* =======================
    Q18: Pain with erections/ejaculation
   ======================= */}
<h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
  Do you experience pain with erections or ejaculation?
</h2>

{["Yes", "No"].map((opt) => (
  <label key={opt} className={styles.checkRow}>
    <input type="radio" name="painWithErections" />
    <span>{opt}</span>
  </label>
))}

<br />

{/* =======================
    Q19: Tight foreskin
   ======================= */}
<h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
  Is your foreskin too tight?
</h2>

{["Yes", "No"].map((opt) => (
  <label key={opt} className={styles.checkRow}>
    <input type="radio" name="foreskinTight" />
    <span>{opt}</span>
  </label>
))}

<br />
{/* =======================
    Q20: Additional medical conditions
   ======================= */}
<h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
  Do you have now, or have you ever had any of the following conditions?
  Select all that apply.
</h2>

{[
  "Priapism (erection lasting longer than 4 hours)",
  "Retinitis Pigmentosa",
  "Sudden vision loss",
  "Neurologic disease or stroke",
  "Blood clotting disorder, abnormal bleeding or bruising",
  "Stomach or intestinal ulcer",
  "A prior heart attack or heart failure",
  "Peripheral artery disease",
  "Any history of QT prolongation",
  "Sickle cell anemia, Myeloma, Leukemia",
  "Idiopathic Hypertrophic Subaortic Stenosis",
  "Use of blood thinners",
  "None apply",
].map((opt) => (
  <label key={opt} className={styles.checkRow}>
    <input type="checkbox" />
    <span>{opt}</span>
  </label>
))}

<br />

{/* =======================
    Q21: Questions for the doctor
   ======================= */}
<h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
  What other information or questions do you have for the doctor?
</h2>

<div className={styles.rowOne}>
  <div className={styles.float}>
    <input
      id="doctorQuestions"
      type="text"
      placeholder=" "
      className={styles.hasFloat}
    />
    <label htmlFor="doctorQuestions" className={styles.floatLabel}>
      Enter your questions here
    </label>
  </div>
</div>

<br />
{/* =======================
    Q22: PDE5 Inhibitors – Informed Consent
   ======================= */}
<h2 className={styles.sectionTitle}>
  Informed Consent for the Use of PDE5 Inhibitors for Erectile Dysfunction
</h2>

<p className={styles.noteTiny}>
  You have been diagnosed with or have reported that you have a known diagnosis
  of organic or psychogenic (situation) erectile dysfunction, a condition
  characterized by the inability to achieve or maintain an erection sufficient
  for satisfactory sexual performance. Phosphodiesterase Type 5 Inhibitors
  (PDE5i) are medications prescribed to treat this condition by enhancing
  erectile function.
</p>

<p className={styles.noteTiny}>
  Common PDE5 inhibitors include Sildenafil (Viagra), Tadalafil (Cialis),
  Vardenafil (Levitra), and Avanafil (Stendra). These medications work by
  increasing blood flow to the penis during sexual stimulation.
</p>

<p className={styles.noteTiny}>
  The use of PDE5 inhibitors may improve your ability to achieve and maintain an
  erection, enhance sexual performance and satisfaction, and improve your
  quality of life and personal relationships.
</p>

<p className={styles.noteTiny}>
  While PDE5 inhibitors are generally well-tolerated, possible side effects may
  include headache, flushing, indigestion or upset stomach, nasal congestion,
  dizziness or lightheadedness, visual disturbances such as blurred vision or
  changes in color perception, back pain or muscle aches (more common with
  Tadalafil), hearing loss or ringing in the ears (rare), priapism (a prolonged
  erection lasting more than four hours), and allergic reactions like rash,
  itching, or swelling.
</p>

<p className={styles.noteTiny}>
  Do not use PDE5 inhibitors if you take nitrates for chest pain (angina), use
  recreational drugs called “poppers” (amyl nitrate or nitrite), have severe
  heart or liver problems, have recently had a stroke or heart attack, or have
  low blood pressure.
</p>

<p className={styles.noteTiny}>
  Alternative treatments include lifestyle changes such as exercise, weight
  loss, quitting smoking, and reducing alcohol intake; psychotherapy or
  counseling for psychological causes of erectile dysfunction; vacuum erection
  devices; penile injections or suppositories; hormone therapy if low
  testosterone levels are contributing; and surgical options such as penile
  implants or vascular surgery.
</p>

<p className={styles.noteTiny}>
  I understand the potential benefits, risks, and side effects of using PDE5
  inhibitors. I have been informed about alternative treatment options. I agree
  to inform my healthcare provider of any side effects or adverse reactions I
  may experience. I understand that this consent is voluntary and that I can
  withdraw from treatment at any time.
</p>

<p className={styles.noteTiny}>
  By selecting below, I consent to the use of PDE5 inhibitors for the treatment
  of my erectile dysfunction.
</p>

<br />

{/* =======================
    Consent choice
   ======================= */}
<h2 className={styles.sectionTitle} style={{ fontSize: 20 }}>
  Consent
</h2>

{[
  "I have read and understand the information and I wish to proceed",
  "I have read the information and I DO NOT wish to proceed",
].map((opt) => (
  <label key={opt} className={styles.checkRow}>
    <input type="radio" name="pde5Consent" />
    <span>{opt}</span>
  </label>
))}

<br />
{/* =======================
    Q23: Identity Verification
   ======================= */}
<h2 className={styles.sectionTitle}>
  Identity Verification
</h2>

<p className={styles.noteTiny}>
  Upload a photo of a valid government-issued photo ID such as a driver's
  license or passport which has your picture, name and date of birth clearly
  visible. If applicable, upload a photo of the front and the back especially
  when using a military ID as your date of birth is on the back of the card.
  Make sure the photo is clear and legible.
</p>

<br />

{/* File upload */}
<div className={styles.rowOne}>
  <div className={styles.float}>
    <input
      id="identityUpload"
      type="file"
      className={styles.hasFloat}
    />
    <label htmlFor="identityUpload" className={styles.floatLabel}>
      Image upload
    </label>
  </div>
</div>

<br />

{/* Copyright / legal note */}
<p
  className={styles.noteTiny}
  style={{ textAlign: "center", opacity: 0.7 }}
>
  Copyright © 2024 Beluga Health. All Rights Reserved.
  <br />
  This document and its contents are protected by copyright law. Clients of
  Beluga Health are granted permission to copy the content solely for the
  purpose of integrating with Beluga Health services and systems. Any other
  use, reproduction, distribution, or transmission of this document or its
  content, in whole or in part, is strictly prohibited without the prior
  written permission of Beluga Health. For permission requests, contact Beluga
  Health at info@belugahealth.com.
</p>

<br />

{/* =======================
    Final Actions
   ======================= */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  }}
>
 

  <button type="button" className={styles.payNowBtn}>
    Submit
  </button>
</div>

<br />


          
            
          </div>

          
        </section>
        
      </div>
      
    </div>
  );
}
