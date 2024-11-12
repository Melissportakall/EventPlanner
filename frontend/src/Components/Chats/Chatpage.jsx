// ChatPage.js
import React, { useState, useEffect } from 'react';

const ChatPage = ({ groupId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Grup mesajlarını al
    fetch(`/get_group_messages?group_id=${groupId}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err));
  }, [groupId]);

  const handleSendMessage = () => {
    // Yeni mesaj gönder
    fetch('/send_message', {
      method: 'POST',
      body: JSON.stringify({ group_id: groupId, message }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        setMessages([...messages, { sender_id: 'You', message }]);
        setMessage('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="chat-page">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender_id}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mesaj yaz..."
      />
      <button onClick={handleSendMessage}>Gönder</button>
    </div>
  );
};

export default ChatPage;
