"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContentPanel.module.css';

interface TopicDetail {
  concept: string;
  benefits: string;
  types: string;
  syntax: string;
  keywords: string;
}

interface Topic {
  topicId: string;
  title: string;
  details: TopicDetail;
}

interface UnitData {
  unitId: number;
  unitTitle: string;
  topics: Topic[];
}

interface ContentPanelProps {
  unitData?: UnitData;
  activeTopicId: string;
  setActiveTopicId: (id: string) => void;
}

export default function ContentPanel({ unitData, activeTopicId, setActiveTopicId }: ContentPanelProps) {
  useEffect(() => {
    // If unit changes and current activeTopicId is not in new unit, set to first
    if (unitData && unitData.topics.length > 0) {
      const topicExists = unitData.topics.some(t => t.topicId === activeTopicId);
      if (!topicExists) {
        setActiveTopicId(unitData.topics[0].topicId);
      }
    }
  }, [unitData, activeTopicId, setActiveTopicId]);

  if (!unitData) {
    return (
      <div className={styles.panelWrapper}>
         <div className={styles.emptyPanel}>No data available for this unit yet.</div>
      </div>
    );
  }

  const activeTopic = unitData.topics.find(t => t.topicId === activeTopicId) || unitData.topics[0];

  return (
    <div className={styles.panelWrapper}>
      <div className={styles.panelContainer}>
        {/* Left Pane - Topics List */}
        <div className={styles.leftPane}>
          <h2 className={styles.unitTitle}>{unitData.unitTitle}</h2>
          <div className={styles.topicList}>
            {unitData.topics.map((topic) => (
              <button
                key={topic.topicId}
                className={`${styles.topicButton} ${activeTopicId === topic.topicId ? styles.topicActive : ''}`}
                onClick={() => setActiveTopicId(topic.topicId)}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane - Topic Details */}
        <div className={styles.rightPane}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopicId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={styles.detailsContainer}
            >
              <h3 className={styles.detailHeader}>
                <span className={styles.detailTitle}>{activeTopic.title.toUpperCase()}</span>: Details
              </h3>
              <div className={styles.divider}></div>
              
              <div className={styles.detailContent}>
                <p className={styles.conceptText}>
                  <span className={styles.label}>Concept:</span> {activeTopic.details.concept}
                </p>
                <ul className={styles.detailList}>
                  <li>
                    <span className={styles.bullet}>*</span> 
                    <div><strong>Benefits:</strong> {activeTopic.details.benefits}</div>
                  </li>
                  <li>
                    <span className={styles.bullet}>*</span> 
                    <div><strong>Types:</strong> {activeTopic.details.types}</div>
                  </li>
                  <li>
                    <span className={styles.bullet}>*</span> 
                    <div><strong>Syntax:</strong> <code className={styles.codeBlock}>{activeTopic.details.syntax}</code></div>
                  </li>
                  <li>
                    <span className={styles.bullet}>*</span> 
                    <div><strong>Key Keywords:</strong> <code className={styles.codeBlock}>{activeTopic.details.keywords}</code></div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
