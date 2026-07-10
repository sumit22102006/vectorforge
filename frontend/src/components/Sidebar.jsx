import React, { useState } from 'react';
import { Search, MessageSquare, MoreVertical, CircleDashed, Filter } from 'lucide-react';

export default function Sidebar({ personas, activePersonaId, onSelectPersona, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPersonas = personas.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-80 md:w-96 flex flex-col border-r h-full ${
      darkMode 
        ? 'bg-whatsapp-dark-sidebar border-whatsapp-dark-border text-whatsapp-dark-text-primary' 
        : 'bg-white border-whatsapp-light-border text-whatsapp-light-text-primary'
    }`}>
      {/* Sidebar Header */}
      <div className={`p-3 flex items-center justify-between ${
        darkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            SK
          </div>
          <span className="font-semibold text-sm">Sumit Kumar</span>
        </div>
        <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400">
          <button title="Status" className="hover:text-emerald-500 transition-colors cursor-pointer">
            <CircleDashed size={20} />
          </button>
          <button title="New Chat" className="hover:text-emerald-500 transition-colors cursor-pointer">
            <MessageSquare size={20} />
          </button>
          <button title="Menu" className="hover:text-emerald-500 transition-colors cursor-pointer">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Broadcast Info / Local Server status */}
      <div className={`px-4 py-2 text-xs flex items-center gap-2 ${
        darkMode ? 'bg-[#182229] text-emerald-400' : 'bg-emerald-50 text-emerald-700'
      }`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Ollama Llama 3.2: Connected on http://localhost:11434
      </div>

      {/* Search and Filter */}
      <div className="p-2.5 flex items-center gap-2">
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg flex-grow ${
          darkMode ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'
        }`}>
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search or start a new clone chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm w-full outline-none border-none placeholder-gray-500"
          />
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#202c33] rounded-lg transition-colors cursor-pointer text-gray-500">
          <Filter size={18} />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredPersonas.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No contacts or clones found
          </div>
        ) : (
          filteredPersonas.map((persona) => {
            const isActive = persona.id === activePersonaId;
            const lastMsg = persona.chatHistory[persona.chatHistory.length - 1];
            
            return (
              <div
                key={persona.id}
                onClick={() => onSelectPersona(persona.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b select-none ${
                  darkMode 
                    ? `border-whatsapp-dark-border hover:bg-[#202c33]/50 ${isActive ? 'bg-[#2a3942]' : ''}`
                    : `border-whatsapp-light-border hover:bg-[#f5f6f6] ${isActive ? 'bg-[#eaebeb]' : ''}`
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl shadow-inner relative flex-shrink-0">
                  {persona.avatar}
                  {persona.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-whatsapp-dark-sidebar rounded-full"></span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate">{persona.name}</h3>
                    <span className="text-xs text-gray-400">
                      {lastMsg ? lastMsg.timestamp : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${
                      persona.unreadCount > 0 
                        ? 'font-semibold text-emerald-500 dark:text-emerald-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {lastMsg ? lastMsg.text : 'No messages yet'}
                    </p>
                    
                    {/* Badge */}
                    {persona.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center min-w-[20px]">
                        {persona.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
