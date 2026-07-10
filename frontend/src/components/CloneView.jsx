import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export default function CloneView() {
  return (
    <div className="view-container">
      <div className="view-header">
        <Cpu size={24} style={{ color: '#8b5cf6' }} />
        <h2>AI Clone Identity</h2>
      </div>
      <div className="view-content">
        <div className="panel-card" style={{ maxWidth: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={16} style={{ color: '#f59e0b' }} />
            <h3 style={{ margin: 0, fontSize: 16 }}>Manage Clone Core</h3>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
            Global clone rules, behavior overrides, and advanced prompt configurations.
            (Coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}
