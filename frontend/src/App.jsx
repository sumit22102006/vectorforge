import React, { useState } from 'react';
import { mockPersonas } from './mockData';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import StyleDashboard from './components/StyleDashboard';
import { Sun, Moon, Sparkles, MessageSquareCode } from 'lucide-react';

export default function App() {
  const [personas, setPersonas] = useState(mockPersonas);
  const [activePersonaId, setActivePersonaId] = useState('clone');
  const [darkMode, setDarkMode] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  const activePersona = personas.find((p) => p.id === activePersonaId);

  const handleSelectPersona = (id) => {
    setActivePersonaId(id);
    
    // Clear unread count when clicking a chat
    setPersonas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, unreadCount: 0 } : p))
    );
  };

  const handleSendMessage = (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Add user's message
    const userMessage = {
      id: Date.now(),
      sender: 'me',
      text,
      timestamp,
      status: 'read'
    };

    setPersonas((prev) =>
      prev.map((p) => {
        if (p.id === activePersonaId) {
          return {
            ...p,
            chatHistory: [...p.chatHistory, userMessage]
          };
        }
        return p;
      })
    );

    // 2. Trigger typing status
    setPersonas((prev) =>
      prev.map((p) => (p.id === activePersonaId ? { ...p, status: 'typing' } : p))
    );

    // 3. Simulate Llama 3.2 local model inference after 1.5s
    setTimeout(() => {
      let aiText = '';
      const lowerText = text.toLowerCase();

      // Simple keyword matching for high-fidelity responses matching persona style profiles
      if (activePersonaId === 'clone') {
        if (lowerText.includes('hello') || lowerText.includes('hey') || lowerText.includes('hi')) {
          aiText = 'hey! literally just looking over some code, what is up? 🚀';
        } else if (lowerText.includes('how') || lowerText.includes('work')) {
          aiText = 'it makes total sense, we just load the parser service, compile style markers, and prompt llama 3.2 directly. let\'s go 😂';
        } else {
          aiText = 'solid point. awesome. let\'s try compiling the chat files next or check the logs 🔥';
        }
      } else if (activePersonaId === 'sarah') {
        if (lowerText.includes('figma') || lowerText.includes('design') || lowerText.includes('mock')) {
          aiText = 'The designs are finalized. I made sure to double-check the spacing and color alignments for accessibility guidelines. 🙏';
        } else {
          aiText = 'I received your message. I am currently reviewing the mobile user testing prototypes and will follow up with feedback.';
        }
      } else if (activePersonaId === 'mom') {
        aiText = 'Okay dear!! Take care and drive slowly!! ❤️ Call me when you are home! 😘🌸';
      } else if (activePersonaId === 'alex') {
        aiText = 'lgtm, rebase done. test compile ok 👍';
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'them',
        text: aiText || 'received! Llama 3.2 clone model loaded successfully.',
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
    }, 1500);
  };

  const handleImportChat = (fileName) => {
    // Modify existing clone or add a high accuracy version
    setPersonas((prev) =>
      prev.map((p) => {
        if (p.id === 'clone') {
          return {
            ...p,
            name: "My Digital Clone (Retrained)",
            styleProfile: {
              ...p.styleProfile,
              matchScore: 99,
              tone: "Perfect mimicry of Sumit Kumar, fast typing speed, ultra casual",
              vocabulary: [...p.styleProfile.vocabulary, "rebase", "config", "ditto", "parse"]
            },
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
    <div className={`h-screen flex flex-col overflow-hidden transition-colors ${darkMode ? 'dark bg-[#0b141a]' : 'bg-[#e7e9eb]'}`}>
      {/* Top Application Bar */}
      <header className={`px-4 py-2.5 flex items-center justify-between border-b shadow-sm ${
        darkMode ? 'bg-[#111b21] border-[#222e35] text-white' : 'bg-[#f0f2f5] border-[#e9edef] text-gray-800'
      }`}>
        <div className="flex items-center gap-2">
          <MessageSquareCode className="text-emerald-500 animate-pulse" size={24} />
          <h1 className="text-lg font-bold tracking-tight m-0 select-none">
            Digital Clone AI <span className="text-xs font-normal text-gray-400">v1.0.0</span>
          </h1>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              darkMode ? 'hover:bg-[#202c33] text-amber-400' : 'hover:bg-[#eaebeb] text-sky-600'
            }`}
            title={darkMode ? "Switch to WhatsApp Light Mode" : "Switch to WhatsApp Dark Mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat thread list */}
        <Sidebar
          personas={personas}
          activePersonaId={activePersonaId}
          onSelectPersona={handleSelectPersona}
          darkMode={darkMode}
        />

        {/* Center: Live Chat conversation pane */}
        <ChatWindow
          persona={activePersona}
          onSendMessage={handleSendMessage}
          darkMode={darkMode}
          showDashboard={showDashboard}
          onToggleDashboard={() => setShowDashboard(!showDashboard)}
        />

        {/* Right: Style dashboard / parser dropzone */}
        {showDashboard && (
          <StyleDashboard
            persona={activePersona}
            onImportChat={handleImportChat}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}
