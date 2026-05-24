"use client";
import { motion } from 'framer-motion';
import styles from './Timeline.module.css';

interface TimelineProps {
  activeUnit: number;
  setActiveUnit: (unit: number) => void;
  units: number[];
}

export default function Timeline({ activeUnit, setActiveUnit, units }: TimelineProps) {

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.nodesWrapper}>
        {units.map((node, index) => {
          const isActive = activeUnit === node;
          const isLast = index === units.length - 1;
          
          // Alternating wave path for the connector
          const wavePath = index % 2 === 0 
            ? "M0,20 C30,0 70,0 100,20" 
            : "M0,20 C30,40 70,40 100,20";
          
          return (
            <div key={node} className={styles.nodeWrapper}>
              <div 
                className={`${styles.nodeContainer} ${isActive ? styles.active : ''}`}
                onClick={() => setActiveUnit(node)}
              >
                <div className={styles.hexagon}>
                  <svg viewBox="0 0 48 54" className={styles.hexSvg}>
                    <polygon 
                      points="24,2 46,14.5 46,39.5 24,52 2,39.5 2,14.5" 
                      fill={isActive ? "rgba(30, 58, 138, 0.4)" : "rgba(30, 41, 59, 0.8)"}
                      stroke={isActive ? "var(--glow-blue-intense)" : "rgba(100, 116, 139, 0.5)"}
                      strokeWidth="2"
                    />
                  </svg>
                  <span 
                    className={`${styles.nodeText} ${isActive ? styles.textActive : ''}`}
                    style={{ fontSize: String(node).length > 2 ? '0.95rem' : '1.25rem' }}
                  >
                    {node}
                  </span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className={styles.glow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              
              {!isLast && (
                <div className={styles.connectorContainer}>
                   <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={styles.connectorSvg}>
                     <path 
                       d={wavePath} 
                       fill="none" 
                       stroke="rgba(100, 116, 139, 0.5)" 
                       strokeWidth="2" 
                     />
                   </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
