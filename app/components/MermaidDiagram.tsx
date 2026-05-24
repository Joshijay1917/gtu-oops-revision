"use client";
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
});

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      setError(false);
      
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
  }, [chart]);

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
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }} 
    />
  );
}
