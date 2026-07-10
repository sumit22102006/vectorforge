import React, { useState } from 'react';
import { mockPersonas } from './mockData';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import StyleDashboard from './components/StyleDashboard';

export default function App() {
  const [personas, setPersonas] = useState(mockPersonas);
  const [activePersonaId, setActivePersonaId] = useState('alex');
  const [showDashboard, setShowDashboard] = useState(true);

  const activePersona = personas.find(p => p.id === activePersonaId);

  const handleSelectPersona = (id) => {
    setActivePersonaId(id);
    setPersonas(prev =>
      prev.map(p => (p.id === id ? { ...p, unreadCount: 0 } : p))
    );
  };

  const handleSendMessage = (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage = { id: Date.now(), sender: 'me', text, timestamp, status: 'read' };
    const updatedHistory = [...activePersona.chatHistory, userMessage];

    setPersonas(prev =>
      prev.map(p => p.id === activePersonaId ? { ...p, chatHistory: updatedHistory } : p)
    );
    setPersonas(prev =>
      prev.map(p => p.id === activePersonaId ? { ...p, status: 'typing' } : p)
    );

    fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedHistory, styleProfile: activePersona.styleProfile, personaId: activePersonaId })
    })
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
      .then(data => {
        const aiMessage = { id: Date.now() + 1, sender: 'them', text: data.text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' };
        setPersonas(prev =>
          prev.map(p => p.id === activePersonaId ? { ...p, status: 'online', chatHistory: [...p.chatHistory, aiMessage] } : p)
        );
      })
      .catch(() => {
        setTimeout(() => {
          let aiText = 'Offline clone response.';
          const lower = text.toLowerCase();
          if (activePersonaId === 'clone') {
            aiText = lower.includes('hi') || lower.includes('hey') ? 'hey! what is up? 🚀' : 'solid point. let\'s go 🔥';
          } else if (activePersonaId === 'sarah') {
            aiText = 'The designs are finalized. Please review. 🙏';
          } else if (activePersonaId === 'mom') {
            aiText = 'Okay dear!! Take care!! ❤️😘🌸';
          } else if (activePersonaId === 'alex') {
            aiText = 'lgtm, rebase done. test compile ok 👍';
          }
          const aiMessage = { id: Date.now() + 1, sender: 'them', text: aiText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' };
          setPersonas(prev =>
            prev.map(p => p.id === activePersonaId ? { ...p, status: 'online', chatHistory: [...p.chatHistory, aiMessage] } : p)
          );
        }, 1000);
      });
  };

  const handleImportChat = (fileName, parsedStyleProfile) => {
    setPersonas(prev =>
      prev.map(p => {
        if (p.id === 'clone') {
          return {
            ...p,
            name: 'My Digital Clone (Retrained)',
            styleProfile: parsedStyleProfile || p.styleProfile,
            chatHistory: [...p.chatHistory, { id: Date.now(), sender: 'them', text: `🤖 Clone re-trained using "${fileName}". Ready!`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' }]
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar
        personas={personas}
        activePersonaId={activePersonaId}
        onSelectPersona={handleSelectPersona}
      />

      {/* Chat Window */}
      <ChatWindow
        persona={activePersona}
        onSendMessage={handleSendMessage}
        showDashboard={showDashboard}
        onToggleDashboard={() => setShowDashboard(prev => !prev)}
      />

      {/* Right Panel */}
      {showDashboard && (
        <StyleDashboard
          persona={activePersona}
          onImportChat={handleImportChat}
          onCloseDashboard={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
}
