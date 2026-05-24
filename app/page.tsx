"use client";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Timeline from "./components/Timeline";
import ContentPanel from "./components/ContentPanel";
import SurveyModal from "./components/SurveyModal";
import oopData from "../data/OOP.json";
import oopImpData from "../data/OOPIMP.json";
import styles from "./page.module.css";

// Combine the IMP data with the rest of the units
const allData = [oopImpData, ...oopData];

export default function Home() {
  const [activeUnit, setActiveUnit] = useState<number | string>(allData[0]?.unitId || "imp");
  const [activeTopicId, setActiveTopicId] = useState<string>(allData[0]?.topics[0]?.topicId || "t1");
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswered, setSurveyAnswered] = useState(true); // default true to prevent flash

  // Check localstorage on mount
  useEffect(() => {
    const answered = localStorage.getItem('surveyAnswered');
    setSurveyAnswered(!!answered);
  }, []);

  const currentUnitData = allData.find((u) => String(u.unitId) === String(activeUnit));
  const unitIds = allData.map((u) => u.unitId);

  return (
    <div className={styles.container}>
      <Navbar 
        onSelectTopic={(unitId, topicId) => {
          setActiveUnit(unitId);
          setActiveTopicId(topicId);
        }} 
      />
      <main className={styles.main}>
        <div className={styles.header}>
          {!surveyAnswered && (
            <button 
              className={`${styles.surveyBtn} ${styles.pulse}`}
              onClick={() => setShowSurvey(true)}
            >
              Quick Question - Please Answer!
            </button>
          )}
          <h1 className={styles.title}>OBJECT-ORIENTED PROGRAMMING (BE04000231)</h1>
          <p className={styles.subtitle}>Revision Guide &bull; All Units</p>
        </div>

        <Timeline 
          activeUnit={activeUnit} 
          setActiveUnit={setActiveUnit} 
          units={unitIds} 
        />

        <div className={styles.contentSection}>
          <p className={styles.hintText}>
            <svg className={styles.hintIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
            </svg>
            First try to remember subtopics for every unit. than remember only concept of it.
          </p>
          <ContentPanel 
            unitData={currentUnitData as any} 
            activeTopicId={activeTopicId} 
            setActiveTopicId={setActiveTopicId}
            onNavigate={(u, t) => {
              setActiveUnit(u);
              setActiveTopicId(t);
            }} 
          />
        </div>
      </main>

      {showSurvey && (
        <SurveyModal 
          onClose={() => setShowSurvey(false)} 
          onComplete={() => {
            setShowSurvey(false);
            setSurveyAnswered(true);
            localStorage.setItem('surveyAnswered', 'true');
          }}
        />
      )}
    </div>
  );
}
