import React, { useState, useEffect } from 'react';
import './Chats.css';
import './Chatpage.css';
import './Chats.jsx';
import './UserList.jsx';

function MessageApp({ recipientId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        document.title = 'Chats';
    }, []);

    const fetchMessages = () => {
        if (!selectedEventId) return;

        fetch(`/get_messages_by_event?etkinlik_id=${selectedEventId}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setMessages(data.messages);
            } else {
                console.error('Error fetching messages:', data.message);
            }
        })
        .catch(error => console.error('Error fetching messages:', error));
    };
    useEffect(() => {
        if (!recipientId) return;

        const interval = setInterval(() => {
            fetch(`/get_messages_by_event?etkinlik_id=${selectedEvent}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then(response => response.json())
            .then(data => {
                console.log('Gelen Mesajlar:', data);
                if (data.success && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                } else {
                    console.error('Mesajlar alınamadı:', data.message);
                }
            })
            .catch(error => console.error('Error fetching messages:', error));
        }, 1000);

        return () => clearInterval(interval);
    }, [recipientId]);

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedEventId) return;

        const messageData = {
            etkinlik_id: selectedEventId,
            mesaj_metni: newMessage,
        };

        console.log('Gönderilen Mesaj:', newMessage);
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setNewMessage('');
                fetchMessages();
            } else {
                console.error('Mesaj gönderilemedi:', data.message);
            }
        })
        .catch(error => console.error('Mesaj gönderilirken hata oluştu:', error));
    };

    useEffect(() => {
        if (recipientId) {
            fetchMessages();
        }
    }, [recipientId]);

    return (
        <div className="chat-app">
            <h1>Message App</h1>
            <div className="chat-container">
                <h2>Mesajlar</h2>
                <div className="messages-container">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-bubble ${message.gonderici_ad === 'Ben' ? 'sent' : 'received'}`}
                            >
                                <strong>{message.gonderici_ad}:</strong> {message.mesaj_metni} <br />
                                <small>{message.tarih}</small>
                            </div>
                        ))
                    ) : (
                        <p>Henüz mesaj yok.</p>
                    )}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın"
                        onKeyDown={e => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                    />
                    <button onClick={sendMessage}>Gönder</button>
                </div>
            </div>
        </div>
    );
}

export default MessageApp;
