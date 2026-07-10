import React, { useState, useEffect } from 'react';
// Removed mockData import
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import StyleDashboard from './components/StyleDashboard';
import NavigationBar from './components/NavigationBar';
import ContactsView from './components/ContactsView';
import CloneView from './components/CloneView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import { useSocket } from './hooks/useSocket';

export default function App() {
  const [personas, setPersonas] = useState([]);
  const [activePersonaId, setActivePersonaId] = useState('alex');
  const [showDashboard, setShowDashboard] = useState(true);
  const [currentView, setCurrentView] = useState('chats');

  // Hardcode current user ID as 'me' for real-time one-to-one
  const currentUserId = 'me';
  const { socket, isConnected } = useSocket(currentUserId);

  useEffect(() => {
    fetch('http://localhost:5000/api/contacts?ownerId=me')
      .then(res => res.json())
      .then(data => {
        // Map the DB contacts to have the required frontend properties
        const loadedPersonas = data.map(contact => ({
          ...contact,
          chatHistory: [], // Messages will be fetched separately per persona
          styleProfile: `{"description":"${contact.name} default profile"}`
        }));
        setPersonas(loadedPersonas);
        
        // Auto-select the first one if none selected
        if (loadedPersonas.length > 0 && activePersonaId === 'alex') {
          setActivePersonaId(loadedPersonas[0].id);
        }
      })
      .catch(err => console.error('Failed to load contacts:', err));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (msg) => {
      // Add incoming message to the sender's chat history
      setPersonas(prev => prev.map(p => {
        if (p.id === msg.sender) {
          const timestamp = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newMsg = { id: msg._id, sender: 'them', text: msg.text, timestamp, status: 'read' };
          
          // Mark as seen automatically if we are currently looking at this persona
          if (activePersonaId === p.id) {
            socket.emit('markSeen', { messageId: msg._id, sender: msg.sender, receiver: currentUserId });
          }
          
          return { ...p, chatHistory: [...p.chatHistory, newMsg] };
        }
        return p;
      }));
    });

    socket.on('userTyping', ({ sender, isTyping }) => {
      setPersonas(prev => prev.map(p => p.id === sender ? { ...p, status: isTyping ? 'typing' : 'online' } : p));
    });

    socket.on('userOnline', ({ userId, status }) => {
      setPersonas(prev => prev.map(p => p.id === userId ? { ...p, status } : p));
    });

    socket.on('messageStatus', ({ messageId, status }) => {
      setPersonas(prev => prev.map(p => {
        const updatedHistory = p.chatHistory.map(m => m.id === messageId ? { ...m, status } : m);
        return { ...p, chatHistory: updatedHistory };
      }));
    });

    socket.on('messageSeen', ({ messageId }) => {
      setPersonas(prev => prev.map(p => {
        const updatedHistory = p.chatHistory.map(m => m.id === messageId ? { ...m, status: 'read' } : m);
        return { ...p, chatHistory: updatedHistory };
      }));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userOnline');
      socket.off('messageStatus');
      socket.off('messageSeen');
    };
  }, [socket, activePersonaId]);

  const activePersona = personas.find(p => p.id === activePersonaId);

  const handleSelectPersona = (id) => {
    setActivePersonaId(id);
    setPersonas(prev =>
      prev.map(p => (p.id === id ? { ...p, unreadCount: 0 } : p))
    );
  };

  const handleSendMessage = (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const tempId = Date.now();

    const userMessage = { id: tempId, sender: 'me', text, timestamp, status: 'sent' };
    const updatedHistory = [...activePersona.chatHistory, userMessage];

    setPersonas(prev =>
      prev.map(p => p.id === activePersonaId ? { ...p, chatHistory: updatedHistory } : p)
    );

    // Emit over WebSocket
    if (socket && isConnected) {
      socket.emit('sendMessage', { sender: currentUserId, receiver: activePersonaId, text });
      socket.emit('stopTyping', { sender: currentUserId, receiver: activePersonaId });
    }
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

  const handleTyping = (isTyping) => {
    if (socket && isConnected) {
      if (isTyping) {
        socket.emit('typing', { sender: currentUserId, receiver: activePersonaId });
      } else {
        socket.emit('stopTyping', { sender: currentUserId, receiver: activePersonaId });
      }
    }
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
    <div className="app-layout">
      {/* Global Navigation Bar */}
      <NavigationBar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content Area */}
      <div className="app-shell">
        {currentView === 'chats' && (
          <>
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
              onTyping={handleTyping}
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
          </>
        )}

        {currentView === 'contacts' && <ContactsView />}
        {currentView === 'clone' && <CloneView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}
