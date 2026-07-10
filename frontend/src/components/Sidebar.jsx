import React, { useState } from 'react';

export default function Sidebar({ personas, activePersonaId, onSelectPersona }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPersonas = personas.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar">
      {/* ── Brand ── */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo">✦</div>
          <div>
            <span className="brand-title">Digital Clone AI</span>
            <span className="brand-version">v1.0.0</span>
          </div>
        </div>

        {/* User row */}
        <div className="sidebar-user">
          <div className="user-avatar">SK</div>
          <div className="user-name">Sumit Kumar</div>
        </div>
      </div>

      {/* ── Server Status ── */}
      <div className="server-status">
        <span className="ping-dot" />
        <span>Ollama Llama 3.2 · localhost:11434</span>
      </div>

      {/* ── Search ── */}
      <div className="sidebar-search">
        <div className="searchBox">
          <input
            type="text"
            className="searchInput"
            placeholder="Search or start new chat..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button type="button" className="searchButton" title="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Contact List ── */}
      <div className="contact-list">
        {filteredPersonas.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,.4)', fontSize: 11 }}>
            No contacts found
          </div>
        ) : (
          filteredPersonas.map(persona => {
            const isActive = persona.id === activePersonaId;
            const lastMsg = persona.chatHistory[persona.chatHistory.length - 1];

            return (
              <div
                key={persona.id}
                onClick={() => onSelectPersona(persona.id)}
                className={`contact-item${isActive ? ' active' : ''}`}
              >
                <div className="contact-avatar">
                  {persona.avatar}
                  {persona.status === 'online' && <span className="contact-online-dot" />}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{persona.name}</div>
                  <div className="contact-preview">
                    {lastMsg ? lastMsg.text : 'No messages yet'}
                  </div>
                </div>
                <div className="contact-meta">
                  <span className="contact-time">{lastMsg ? lastMsg.timestamp : ''}</span>
                  {persona.unreadCount > 0 && (
                    <span className="unread-badge">{persona.unreadCount}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
