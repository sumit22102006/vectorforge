import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="view-container">
      <div className="view-header">
        <Settings size={24} style={{ color: '#8b5cf6' }} />
        <h2>Application Settings</h2>
      </div>
      <div className="view-content">
        <div className="panel-card" style={{ maxWidth: 600 }}>
          <h3>Preferences</h3>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
            Ollama endpoint configurations, theme settings, and data exports.
            (Coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}
