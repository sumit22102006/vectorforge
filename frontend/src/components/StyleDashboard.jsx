import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, BarChart3, Clock, Sparkles } from 'lucide-react';

export default function StyleDashboard({ persona, onImportChat, darkMode }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle | loading | success
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.name.endsWith('.txt')) {
      alert("Please upload a valid .txt chat export file.");
      return;
    }

    setUploadState('loading');
    setProgress(10);
    
    // Simulate WhatsApp chat log parsing steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');
          
          // Add a minor timeout before callback to show success state
          setTimeout(() => {
            onImportChat(file.name);
            setUploadState('idle');
            setProgress(0);
          }, 1500);

          return 100;
        }
        // Progression steps
        return prev + 15;
      });
    }, 250);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  if (!persona) return null;

  const profile = persona.styleProfile;

  return (
    <div className={`w-80 md:w-96 flex flex-col h-full overflow-y-auto select-none ${
      darkMode 
        ? 'bg-whatsapp-dark-sidebar border-l border-whatsapp-dark-border text-whatsapp-dark-text-primary' 
        : 'bg-white border-l border-whatsapp-light-border text-whatsapp-light-text-primary'
    }`}>
      {/* Title Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        darkMode ? 'border-whatsapp-dark-border bg-[#202c33]' : 'border-whatsapp-light-border bg-[#f0f2f5]'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-500" size={18} />
          <h2 className="font-semibold text-sm">Clone Style Profile</h2>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-500 font-semibold px-2 py-0.5 rounded-full">
          Llama 3.2 Active
        </span>
      </div>

      {/* Style Score Header */}
      <div className="p-5 flex flex-col items-center border-b dark:border-whatsapp-dark-border">
        <div className="relative w-24 h-24 flex items-center justify-center mb-3">
          {/* Circular Progress Path */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={darkMode ? '#222e35' : '#e9edef'}
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#10b981"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * profile.matchScore) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">{profile.matchScore}%</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Match Score</span>
          </div>
        </div>
        <h3 className="font-semibold text-center text-sm">{persona.name}</h3>
        <p className="text-xs text-center text-gray-400 mt-1">Persona profile generated from training chat data.</p>
      </div>

      {/* File Upload Dropzone */}
      <div className="p-4 border-b dark:border-whatsapp-dark-border">
        <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3">
          Train / Update Persona
        </h4>
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-500/10' 
              : darkMode 
                ? 'border-whatsapp-dark-border hover:border-emerald-500/50 hover:bg-[#202c33]/30' 
                : 'border-whatsapp-light-border hover:border-emerald-500/50 hover:bg-[#f0f2f5]/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".txt"
            className="hidden"
          />

          {uploadState === 'idle' && (
            <div className="flex flex-col items-center">
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-xs font-medium">Upload WhatsApp Chat (.txt)</span>
              <span className="text-[10px] text-gray-400 mt-1">Drag and drop file here</span>
            </div>
          )}

          {uploadState === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-2"></div>
              <span className="text-xs font-medium">Analyzing Chat Log...</span>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">
                {progress < 40 ? 'Sanitizing logs...' : progress < 75 ? 'Mapping speech pattern...' : 'Building prompt profile...'}
              </span>
            </div>
          )}

          {uploadState === 'success' && (
            <div className="flex flex-col items-center text-emerald-500">
              <CheckCircle2 className="mb-2 animate-bounce" size={28} />
              <span className="text-xs font-semibold">Clone Profile Configured!</span>
              <span className="text-[10px] text-emerald-600/80 mt-1">Ready to chat</span>
            </div>
          )}
        </div>
      </div>

      {/* Style Profile Details */}
      <div className="p-5 flex-1 space-y-4">
        {/* Tone Section */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={16} className="text-emerald-500" />
            <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tone & Personality</h4>
          </div>
          <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#182229] p-2.5 rounded-md border dark:border-whatsapp-dark-border">
            {profile.tone}
          </p>
        </div>

        {/* Punctuation & Formatting Traits */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BarChart3 size={16} className="text-emerald-500" />
            <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Style & Syntax</h4>
          </div>
          <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#182229] p-2.5 rounded-md border dark:border-whatsapp-dark-border">
            {profile.punctuation}
          </p>
        </div>

        {/* Top Vocabulary Words */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-emerald-500" />
            <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Signature Words</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.vocabulary.map((word, idx) => (
              <span 
                key={idx} 
                className="text-[10px] font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                "{word}"
              </span>
            ))}
          </div>
        </div>

        {/* Numeric stats grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-gray-50 dark:bg-[#182229] border dark:border-whatsapp-dark-border rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Clock size={13} />
              <span className="text-[10px] font-medium uppercase">Response Speed</span>
            </div>
            <span className="text-xs font-bold">{profile.avgResponseTime}</span>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-[#182229] border dark:border-whatsapp-dark-border rounded-lg">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <FileText size={13} />
              <span className="text-[10px] font-medium uppercase">Avg Msg Length</span>
            </div>
            <span className="text-xs font-bold">{profile.messageLength}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
