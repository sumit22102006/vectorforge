import React from 'react';
import { Users } from 'lucide-react';

export default function ContactsView() {
  return (
    <div className="view-container">
      <div className="view-header">
        <Users size={24} style={{ color: '#8b5cf6' }} />
        <h2>Contacts</h2>
      </div>
      <div className="view-content">
        <div className="panel-card" style={{ maxWidth: 600 }}>
          <h3>Address Book</h3>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
            Manage your synchronized contacts and their profiles here. (Coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}
