"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MermaidDiagram from './MermaidDiagram';
import styles from './ContentPanel.module.css';

interface TopicDetail {
  concept?: string;
  benefits?: string;
  types?: string | Record<string, string>;
  syntax?: string;
  keywords?: string;
  "Important Thing"?: string;
  "Important Thing Detail"?: Record<string, string | { c: string; i: string }>;
  [key: string]: any;
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

  const renderDetailField = (label: string, value: any, isCode = false) => {
    if (!value || value === "N/A" || value === "") return null;

    let content;
    
    // Special format for "vs" titles to render a comparison table
    if (label.toLowerCase().includes("vs") && typeof value === 'object' && value !== null) {
      const headers = label.split(/vs/i).map(s => s.trim());
      const leftHeader = headers[0] || "Item 1";
      const rightHeader = headers[1] || "Item 2";
      
      content = (
        <div className={styles.tableContainer}>
          <table className={styles.vsTable}>
            <thead>
              <tr>
                <th>{leftHeader}</th>
                <th>{rightHeader}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(value).map(([k, v]) => {
                if (typeof v === 'object' && v !== null) {
                  const leftValue = (v as any).c;
                  const rightValue = (v as any).i;
                  return (
                    <tr key={k}>
                      <td>{leftValue}</td>
                      <td>{rightValue}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      );
    } else if (typeof value === 'string') {
      content = isCode ? <code className={styles.codeBlock}>{value}</code> : <span>{value}</span>;
    } else if (typeof value === 'object' && value !== null) {
      content = (
        <ul className={styles.nestedList}>
          {Object.entries(value).map(([k, v]) => {
            if (typeof v === 'object' && v !== null) {
              if ('c' in v && 'i' in v) {
                const c = (v as any).c;
                const i = (v as any).i;
                return (
                  <li key={k}>
                    {isNaN(Number(k)) ? <strong>{k}:</strong> : <strong>{k}.</strong>} {c} <span className={styles.dim}>|</span> {i}
                  </li>
                );
              } else {
                return (
                  <li key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span>{isNaN(Number(k)) ? <strong>{k}:</strong> : <strong>{k}.</strong>}</span>
                    <ul className={styles.nestedList} style={{ marginTop: '0.25rem', borderLeft: 'none', paddingLeft: '0.5rem' }}>
                      {Object.entries(v).map(([subK, subV]) => (
                        <li key={subK}><strong>{subK}:</strong> {subV as string}</li>
                      ))}
                    </ul>
                  </li>
                );
              }
            }
            return (
              <li key={k}>
                {isNaN(Number(k)) ? <strong>{k}:</strong> : <strong>{k}.</strong>} {v as string}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <li>
        <span className={styles.bullet}>*</span> 
        <div className={styles.detailItemContent}>
          <strong>{label}:</strong> {content}
        </div>
      </li>
    );
  };

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
                {activeTopic.details.concept && activeTopic.details.concept !== "N/A" && (
                  <p className={styles.conceptText}>
                    <span className={styles.label}>Concept:</span> {activeTopic.details.concept}
                  </p>
                )}
                
                <ul className={styles.detailList}>
                  {renderDetailField("Benefits", activeTopic.details.benefits)}
                  {renderDetailField("Types", activeTopic.details.types)}
                  {renderDetailField("Syntax", activeTopic.details.syntax, true)}
                  {renderDetailField("Key Keywords - Use this terms to get marks", activeTopic.details.keywords, true)}
                  {activeTopic.details["Important Thing"] && activeTopic.details["Important Thing"] !== "N/A" && renderDetailField(
                    activeTopic.details["Important Thing"], 
                    activeTopic.details["Important Thing Detail"] || activeTopic.details["Important Thing"]
                  )}
                </ul>

                {activeTopic.details.diagram && (
                  <MermaidDiagram chart={activeTopic.details.diagram} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
