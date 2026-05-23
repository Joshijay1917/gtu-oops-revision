"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Timeline from "./components/Timeline";
import ContentPanel from "./components/ContentPanel";
import oopData from "../data/OOP.json";
import styles from "./page.module.css";

export default function Home() {
  const [activeUnit, setActiveUnit] = useState(1);
  const [activeTopicId, setActiveTopicId] = useState("t1");

  const currentUnitData = oopData.find((u) => u.unitId === activeUnit);

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
          <h1 className={styles.title}>OBJECT-ORIENTED PROGRAMMING (OOP)</h1>
          <p className={styles.subtitle}>Revision Guide &bull; All Units</p>
        </div>

        <Timeline 
          activeUnit={activeUnit} 
          setActiveUnit={setActiveUnit} 
          unitsCount={8} 
        />

        <div className={styles.contentSection}>
          <ContentPanel 
            unitData={currentUnitData} 
            activeTopicId={activeTopicId} 
            setActiveTopicId={setActiveTopicId} 
          />
        </div>
      </main>
    </div>
  );
}
