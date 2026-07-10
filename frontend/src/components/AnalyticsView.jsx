import React from 'react';
import { BarChart2, Clock, FileText } from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div className="view-container">
      <div className="view-header">
        <BarChart2 size={24} style={{ color: '#8b5cf6' }} />
        <h2>Global Analytics</h2>
      </div>
      <div className="view-content">
        <div className="stats-grid" style={{ maxWidth: 600 }}>
          <div className="stat-card">
            <div className="stat-label">
              <Clock size={12} /> Total Chat Hours
            </div>
            <div className="stat-value">12.4h</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">
              <FileText size={12} /> Total Messages
            </div>
            <div className="stat-value">4,521</div>
          </div>
        </div>
      </div>
    </div>
  );
}
