"use client";
import { useState } from 'react';
import styles from './Navbar.module.css';
import oopData from '../../data/OOP.json';

interface NavbarProps {
  onSelectTopic?: (unitId: number, topicId: string) => void;
}

export default function Navbar({ onSelectTopic }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Flatten topics for search
  const allTopics = oopData.flatMap(unit => 
    unit.topics.map(topic => ({
      unitId: unit.unitId,
      unitTitle: unit.unitTitle,
      ...topic
    }))
  );

  const filteredTopics = searchQuery.trim() === "" 
    ? [] 
    : allTopics.filter(t => {
        const titleMatch = t.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const conceptMatch = t.details?.concept?.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || conceptMatch;
      });

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.oop}>OOP</span> REVISE HUB
      </div>
      <div className={styles.links}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search topics..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
          </div>
          {showDropdown && searchQuery.trim() !== "" && (
            <div className={styles.searchDropdown}>
              {filteredTopics.length > 0 ? (
                filteredTopics.map(topic => (
                  <div 
                    key={`${topic.unitId}-${topic.topicId}`} 
                    className={styles.searchResult}
                    onClick={() => {
                      if (onSelectTopic) {
                        onSelectTopic(topic.unitId, topic.topicId);
                      }
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                  >
                    <div className={styles.resultTitle}>{topic.title}</div>
                    <div className={styles.resultUnit}>{topic.unitTitle}</div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>No topics found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
