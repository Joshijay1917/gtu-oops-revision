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
  onNavigate?: (unitId: number | string, topicId: string) => void;
}

export default function ContentPanel({ unitData, activeTopicId, setActiveTopicId, onNavigate }: ContentPanelProps) {
  useEffect(() => {
    // If unit changes and current activeTopicId is not empty and not in new unit, set to first
    if (unitData && unitData.topics.length > 0) {
      if (activeTopicId !== "") {
        const topicExists = unitData.topics.some(t => t.topicId === activeTopicId);
        if (!topicExists) {
          setActiveTopicId(unitData.topics[0].topicId);
        }
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

  const renderDetailField = (label: string, value: any, isCode = false) => {
    if (!value || value === "N/A" || value === "") return null;

    const renderStringWithLink = (str: string) => {
      const match = str.match(/(.*)\s*\[link:(.+?),(.+?)\]$/);
      if (match) {
        const text = match[1];
        const linkUnit = match[2];
        const linkTopic = match[3];
        return (
          <span>
            {text}{" "}
            <button 
              className={styles.inlineLinkBtn}
              onClick={() => onNavigate && onNavigate(isNaN(Number(linkUnit)) ? linkUnit : Number(linkUnit), linkTopic)}
              title="Jump to Answer"
            >
              Read Answer &rarr;
            </button>
          </span>
        );
      }
      return <span>{str}</span>;
    };

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
      content = isCode ? <code className={styles.codeBlock}>{value}</code> : renderStringWithLink(value);
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
                {isNaN(Number(k)) ? <strong>{k}:</strong> : <strong>{k}.</strong>} {renderStringWithLink(v as string)}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <li key={label}>
        <span className={styles.bullet}>*</span> 
        <div className={styles.detailItemContent}>
          <strong>{label}:</strong> {content}
        </div>
      </li>
    );
  };

  return (
    <div className={styles.panelWrapper}>
      <h2 className={styles.unitTitle}>{unitData.unitTitle}</h2>
      <div className={styles.accordionContainer}>
        {unitData.topics.map((topic) => {
          const isActive = activeTopicId === topic.topicId;
          return (
            <div key={topic.topicId} className={styles.accordionItem}>
              <button 
                className={`${styles.accordionHeader} ${isActive ? styles.accordionHeaderActive : ''}`}
                onClick={() => setActiveTopicId(isActive ? '' : topic.topicId)}
              >
                {topic.title}
                <svg 
                  className={`${styles.accordionIcon} ${isActive ? styles.accordionIconOpen : ''}`} 
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {isActive && (
                <div className={styles.accordionContentWrapper}>
                  <div className={styles.accordionContent}>
                    <div className={styles.detailsContainer}>
                      <h3 className={styles.detailHeader}>
                        <span className={styles.detailTitle}>{topic.title.toUpperCase()}</span>: Details
                      </h3>
                        <div className={styles.divider}></div>
                        
                        <div className={styles.detailContent}>
                          {topic.details.concept && topic.details.concept !== "N/A" && (
                            <p className={styles.conceptText}>
                              <span className={styles.label}>Concept:</span> {topic.details.concept}
                            </p>
                          )}
                          
                          <ul className={styles.detailList}>
                            {renderDetailField("Benefits", topic.details.benefits)}
                            {renderDetailField("Types", topic.details.types)}
                            {renderDetailField("Syntax", topic.details.syntax, true)}
                            {renderDetailField("Key Keywords - Use this terms to get marks", topic.details.keywords, true)}
                            {topic.details["Important Thing"] && topic.details["Important Thing"] !== "N/A" && renderDetailField(
                              topic.details["Important Thing"], 
                              topic.details["Important Thing Detail"] || topic.details["Important Thing"]
                            )}
                            {Object.keys(topic.details)
                              .filter(k => !["concept", "benefits", "types", "syntax", "keywords", "Important Thing", "Important Thing Detail", "diagram", "image"].includes(k))
                              .map(k => renderDetailField(k, topic.details[k]))}
                          </ul>

                          {topic.details.diagram && (
                            <MermaidDiagram chart={topic.details.diagram} />
                          )}
                          {topic.details.image && (
                            <div className={styles.imageContainer}>
                              <img src={topic.details.image} alt={topic.title} className={styles.topicImage} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
