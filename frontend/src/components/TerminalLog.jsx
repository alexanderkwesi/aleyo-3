import React, { useEffect, useRef } from 'react';

export default function TerminalLog({ logs, active }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs]);

  if (!active) return null;

  return (
    <div className="terminal-panel active" style={{ marginTop: '20px' }}>
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
        </div>
        <span>ALEYO_CORE_ENGINE.LOG</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {logs.map((log, idx) => (
          <div key={idx} className={`terminal-line ${log.type}`}>
            <span>&gt;</span> <span>{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
