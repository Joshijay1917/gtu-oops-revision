"use client";
import { useState } from 'react';
import styles from './SurveyModal.module.css';

interface SurveyModalProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function SurveyModal({ onClose, onComplete }: SurveyModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [responses, setResponses] = useState({
    needCOAWebsite: null as boolean | null,
    needMobileApp: null as boolean | null,
    device: null as string | null,
    helpProvideMaterial: null as boolean | null,
    branch: null as string | null,
    provideBranchMaterial: null as boolean | null,
    email: ""
  });

  const handleNext = async () => {
    if (step === 1) {
      if (responses.needCOAWebsite === false && responses.needMobileApp === false) {
        // If both are NO, we don't save to DB and don't ask for email.
        onComplete();
        return;
      }
      if (responses.needMobileApp === false) {
        // Skip mobile app specific questions
        setStep(3);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      await submitSurvey();
    }
  };

  const submitSurvey = async () => {
    if (!responses.email.match(/^[a-zA-Z0-9.]+@vvpedulink\.ac\.in$/)) {
      setError("Email must be in format: rollno.name.surename@vvpedulink.ac.in");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responses)
      });
      if (res.ok) {
        onComplete();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save responses.");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>Quick Survey</h2>

        {step === 1 && (
          <div>
            <div className={styles.questionContainer}>
              <p className={styles.questionText}>1. Do you need the same type of website for COA Subject?</p>
              <div className={styles.buttonGroup}>
                <button 
                  className={`${styles.btn} ${responses.needCOAWebsite === true ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, needCOAWebsite: true})}
                >Yes</button>
                <button 
                  className={`${styles.btn} ${responses.needCOAWebsite === false ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, needCOAWebsite: false})}
                >No</button>
              </div>
            </div>

            <div className={styles.questionContainer}>
              <p className={styles.questionText}>2. In next sem, would you like if I create a mobile application to get material day by day?</p>
              <div className={styles.subText}>
                &rarr; You can get notification before deadline.<br/>
                &rarr; You can get material day wise. Ex. you get photos of today's lecture when you bunk!
              </div>
              <div className={styles.buttonGroup}>
                <button 
                  className={`${styles.btn} ${responses.needMobileApp === true ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, needMobileApp: true})}
                >Yes</button>
                <button 
                  className={`${styles.btn} ${responses.needMobileApp === false ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, needMobileApp: false})}
                >No</button>
              </div>
            </div>

            <button 
              className={styles.nextBtn} 
              disabled={responses.needCOAWebsite === null || responses.needMobileApp === null}
              onClick={handleNext}
            >
              {responses.needCOAWebsite === false && responses.needMobileApp === false ? 'Finish' : 'Next'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className={styles.questionContainer}>
              <p className={styles.questionText}>3. Which device do you use?</p>
              <div className={styles.buttonGroup}>
                <button 
                  className={`${styles.btn} ${responses.device === 'android' ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, device: 'android'})}
                >Android</button>
                <button 
                  className={`${styles.btn} ${responses.device === 'ios' ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, device: 'ios'})}
                >iOS</button>
              </div>
            </div>

            <div className={styles.questionContainer}>
              <p className={styles.questionText}>4. Can you help me to provide material if for some reason I cannot attend lecture?</p>
              <div className={styles.buttonGroup}>
                <button 
                  className={`${styles.btn} ${responses.helpProvideMaterial === true ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, helpProvideMaterial: true})}
                >Yes</button>
                <button 
                  className={`${styles.btn} ${responses.helpProvideMaterial === false ? styles.btnActive : ''}`}
                  onClick={() => setResponses({...responses, helpProvideMaterial: false})}
                >No</button>
              </div>
            </div>

            {responses.helpProvideMaterial === true && (
              <div className={styles.questionContainer}>
                <p className={styles.questionText}>5. Select your branch</p>
                <select 
                  className={styles.inputField} 
                  value={responses.branch || ""}
                  onChange={(e) => setResponses({...responses, branch: e.target.value})}
                >
                  <option value="" disabled>Select Branch</option>
                  <option value="CE">CE (Computer Engineering)</option>
                  <option value="IT">IT</option>
                  <option value="EC">EC</option>
                  <option value="Civil">Civil</option>
                  <option value="Mechanical">Mechanical</option>
                </select>

                {responses.branch && responses.branch !== 'CE' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div className={styles.subText} style={{ color: '#fbbf24', borderLeftColor: '#fbbf24' }}>
                      Currently my network is only for Computer.
                    </div>
                    <p className={styles.questionText} style={{ fontSize: '1rem' }}>Can you provide material of your branch daily?</p>
                    <div className={styles.buttonGroup}>
                      <button 
                        className={`${styles.btn} ${responses.provideBranchMaterial === true ? styles.btnActive : ''}`}
                        onClick={() => setResponses({...responses, provideBranchMaterial: true})}
                      >Yes</button>
                      <button 
                        className={`${styles.btn} ${responses.provideBranchMaterial === false ? styles.btnActive : ''}`}
                        onClick={() => setResponses({...responses, provideBranchMaterial: false})}
                      >No</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button 
              className={styles.nextBtn} 
              disabled={
                responses.device === null || 
                responses.helpProvideMaterial === null || 
                (responses.helpProvideMaterial === true && responses.branch === null) ||
                (responses.helpProvideMaterial === true && responses.branch !== 'CE' && responses.provideBranchMaterial === null)
              }
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
             <div className={styles.questionContainer}>
              <p className={styles.questionText}>Email Id</p>
              <div className={styles.subText}>
                Must be <strong>College Email Id</strong>
              </div>
              <input 
                type="email" 
                className={styles.inputField} 
                placeholder="24ce253.jay.joshi@vvpedulink.ac.in"
                value={responses.email}
                onChange={(e) => {
                  setResponses({...responses, email: e.target.value});
                  setError("");
                }}
              />
              {error && <span className={styles.errorText}>{error}</span>}
            </div>

            <button 
              className={styles.nextBtn} 
              disabled={loading || !responses.email}
              onClick={handleNext}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
