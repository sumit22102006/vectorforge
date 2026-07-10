import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Clock, Sparkles, X } from 'lucide-react';

export default function StyleDashboard({ persona, onImportChat, onCloseDashboard }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const processFile = async (file) => {
    if (!file || !file.name.endsWith('.txt')) {
      alert('Please upload a valid .txt chat export file.');
      return;
    }
    setUploadState('loading');
    setProgress(15);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
      setProgress(60);
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Upload failed'); }
      const data = await response.json();
      setProgress(100);
      setUploadState('success');
      setTimeout(() => { onImportChat(file.name, data.styleProfile); setUploadState('idle'); setProgress(0); }, 1500);
    } catch (err) {
      alert(`Failed: ${err.message}`);
      setUploadState('idle');
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); };

  if (!persona) return null;

  const profile = persona.styleProfile;
  const R = 38;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (CIRC * profile.matchScore) / 100;

  return (
    <div className="right-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="panel-title">
          <Sparkles size={14} style={{ color: '#f59e0b' }} />
          Clone Style Profile
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-badge">Live</span>
          <button className="icon-btn" onClick={onCloseDashboard} title="Close"><X size={14} /></button>
        </div>
      </div>

      {/* Score Ring */}
      <div className="score-section">
        <div className="score-ring-wrap">
          <svg viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={R} fill="none" stroke="#f1f5f9" strokeWidth="7" />
            <circle
              cx="44" cy="44" r={R}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
          <div className="score-inner">
            <span className="score-value">{profile.matchScore}%</span>
            <span className="score-label">Match Score</span>
          </div>
        </div>
        <div className="persona-name-display">{persona.name}</div>
        <div className="persona-subtitle">Persona profile generated from training chat data.</div>
      </div>

      {/* Body */}
      <div className="panel-body">
        {/* Upload */}
        <div>
          <div className="panel-section-title">Train / Update Persona</div>
          <div
            className={`dropzone${dragActive ? ' drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileInput} accept=".txt" style={{ display: 'none' }} />

            {uploadState === 'idle' && (
              <>
                <div className="dropzone-icon"><Upload size={16} /></div>
                <div className="dropzone-title">Upload WhatsApp Chat (.txt)</div>
                <div className="dropzone-sub">Drag &amp; drop file here</div>
              </>
            )}

            {uploadState === 'loading' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2.5px solid #ede9fe', borderTopColor: '#7c3aed', animation: 'spin .8s linear infinite' }} />
                <div className="dropzone-title">Analyzing Chat Log...</div>
                <div className="progress-bar-wrap" style={{ width: '100%' }}>
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="dropzone-sub">
                  {progress < 40 ? 'Sanitizing logs...' : progress < 75 ? 'Mapping speech patterns...' : 'Building prompt profile...'}
                </div>
              </div>
            )}

            {uploadState === 'success' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#16a34a' }}>
                <CheckCircle2 size={28} />
                <div className="dropzone-title" style={{ color: '#16a34a' }}>Clone Profile Configured!</div>
                <div className="dropzone-sub" style={{ color: '#4ade80' }}>Ready to chat</div>
              </div>
            )}
          </div>
        </div>

        {/* Tone */}
        <div>
          <div className="panel-section-title">Tone &amp; Personality</div>
          <div className="panel-card">{profile.tone}</div>
        </div>

        {/* Style */}
        <div>
          <div className="panel-section-title">Style &amp; Syntax</div>
          <div className="panel-card">{profile.punctuation}</div>
        </div>

        {/* Signature words */}
        <div>
          <div className="panel-section-title">Signature Words</div>
          <div className="chip-list">
            {profile.vocabulary.map((word, idx) => (
              <span key={idx} className="chip">{word}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">
              <Clock size={9} />
              Response Speed
            </div>
            <div className="stat-value">{profile.avgResponseTime}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">
              <FileText size={9} />
              Avg Msg Length
            </div>
            <div className="stat-value">{profile.messageLength}</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
