"use client";
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLight = document.documentElement.classList.contains('light');
      setCurrentTheme(isLight ? 'default' : 'dark');

      const handleThemeChange = () => {
        setCurrentTheme(document.documentElement.classList.contains('light') ? 'default' : 'dark');
      };
      
      window.addEventListener('themeChanged', handleThemeChange);
      return () => window.removeEventListener('themeChanged', handleThemeChange);
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      setError(false);
      
      mermaid.initialize({
        startOnLoad: false,
        theme: currentTheme,
        securityLevel: 'loose',
      });
      
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        mermaid.render(id, chart).then((result) => {
          if (ref.current) {
            ref.current.innerHTML = result.svg;
          }
        }).catch(err => {
          console.error("Mermaid render error:", err);
          setError(true);
        });
      } catch (err) {
        console.error("Mermaid sync error:", err);
        setError(true);
      }
    }
  }, [chart, currentTheme]);

  if (error) {
    return <div style={{ color: 'red', margin: '1rem 0' }}>Failed to render diagram</div>;
  }

  return (
    <div 
      ref={ref} 
      className="mermaid-container" 
      style={{ 
        margin: '1.5rem 0', 
        display: 'flex', 
        justifyContent: 'center',
        background: 'var(--diagram-bg)',
        padding: '1rem',
        borderRadius: '0.5rem',
      }} 
    />
  );
}
