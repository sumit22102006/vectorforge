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

    // 2. Trigger typing status
    setPersonas((prev) =>
      prev.map((p) => (p.id === activePersonaId ? { ...p, status: 'typing' } : p))
    );

    // 3. Request LLM response from the backend
    fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: updatedHistory,
        styleProfile: activePersona.styleProfile,
        personaId: activePersonaId
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to generate clone response');
        return res.json();
      })
      .then(data => {
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'them',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };

        setPersonas((prev) =>
          prev.map((p) => {
            if (p.id === activePersonaId) {
              return {
                ...p,
                status: 'online',
                chatHistory: [...p.chatHistory, aiMessage]
              };
            }
            return p;
          })
        );
      })
      .catch(err => {
        console.warn('API call failed, falling back to local simulation:', err.message);
        setTimeout(() => {
          let aiText = 'Offline clone response loaded.';
          const lowerText = text.toLowerCase();
          if (activePersonaId === 'clone') {
            if (lowerText.includes('hello') || lowerText.includes('hey') || lowerText.includes('hi')) {
              aiText = 'hey! literally just looking over some code, what is up? 🚀';
            } else if (lowerText.includes('how') || lowerText.includes('work')) {
              aiText = 'it makes total sense, we just load the parser service, compile style markers, and prompt llama 3.2 directly. let\'s go 😂';
            } else {
              aiText = 'solid point. awesome. let\'s try compiling the chat files next or check the logs 🔥';
            }
          } else if (activePersonaId === 'sarah') {
            aiText = 'The designs are finalized. I made sure to double-check the spacing and color alignments for accessibility guidelines. 🙏';
          } else if (activePersonaId === 'mom') {
            aiText = 'Okay dear!! Take care and drive slowly!! ❤️ Call me when you are home! 😘🌸';
          } else if (activePersonaId === 'alex') {
            aiText = 'lgtm, rebase done. test compile ok 👍';
          }

          const aiMessage = {
            id: Date.now() + 1,
            sender: 'them',
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          };

          setPersonas((prev) =>
            prev.map((p) => {
              if (p.id === activePersonaId) {
                return {
                  ...p,
                  status: 'online',
                  chatHistory: [...p.chatHistory, aiMessage]
                };
              }
              return p;
            })
          );
        }, 1000);
      });
  };

  const handleImportChat = (fileName, parsedStyleProfile) => {
    setPersonas((prev) =>
      prev.map((p) => {
        if (p.id === 'clone') {
          return {
            ...p,
            name: "My Digital Clone (Retrained)",
            styleProfile: parsedStyleProfile || p.styleProfile,
            chatHistory: [
              ...p.chatHistory,
              {
                id: Date.now(),
                sender: 'them',
                text: `🤖 Clone re-trained successfully using "${fileName}" export. Accuracy match score upgraded to 99%! Ready to test.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'read'
              }
            ]
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
