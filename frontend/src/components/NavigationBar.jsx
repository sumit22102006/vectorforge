import React from 'react';
import { MessageSquare, Users, Cpu, BarChart2, Settings } from 'lucide-react';

export default function NavigationBar({ currentView, onViewChange }) {
  const tabs = [
    { id: 'chats', icon: MessageSquare, label: 'Chats' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'clone', icon: Cpu, label: 'AI Clone' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' }
  ];

  return (
    <div className="nav-bar">
      {/* Top Tabs */}
      <div className="nav-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <div
              key={tab.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onViewChange(tab.id)}
              title={tab.label}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="nav-label">{tab.label}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom Tabs (Settings) */}
      <div className="nav-bottom">
        <div
          className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => onViewChange('settings')}
          title="Settings"
        >
          <Settings size={22} strokeWidth={currentView === 'settings' ? 2.5 : 2} />
          <span className="nav-label">Settings</span>
        </div>
      </div>
    </div>
  );
}
