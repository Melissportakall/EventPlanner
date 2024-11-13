import React, { useState, useEffect } from 'react';

function MessageApp({ recipientId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    //mesajları burdan alıyoz
    const fetchMessages = () => {
        if (!recipientId) return; //alıcı id yoksa veri çekme

        fetch(`/get_messages?alici_id=${recipientId}`, {
            method: 'GET',
            credentials: 'include'  //cookieyi al
        })
            .then(response => response.json())
            .then(data => {
                console.log('Gelen Mesajlar:', data);
                setMessages(data);
            })
            .catch(error => console.error('Error fetching messages:', error));
    };

    // Mesaj gönderme fonksiyonu
    const sendMessage = () => {
        if (!newMessage.trim()) return; //mesaj kutusu boşsa gönerme

        const messageData = {
            alici_id: recipientId,
            mesaj_metni: newMessage
        };

        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
            credentials: 'include'  //cookieyi gönder
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Mesaj gönderildi') {
                setNewMessage('');  //gönderdikten sonra inputu temizle
                fetchMessages(); //mesaj gönderince chati yenile
            }
        })
        .catch(error => console.error('Error sending message:', error));
    };

    useEffect(() => {
        if (recipientId) {
            fetchMessages(); //kişi seçtiğinde chati getir
        }
    }, [recipientId]);

    return (
        <div>
            <h1>Message App</h1>
            <div>
                {/* Mesajları buraya yazıyon */}
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Mesajınızı yazın"
                />
                <button onClick={sendMessage}>Gönder</button>
            </div>
            <div>
                <h2>Mesajlar</h2>
                <div className="messages-container">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-bubble ${message.gonderici_ad === 'Ben' ? 'sent' : 'received'}`}
                        >
                            <strong>{message.gonderici_ad}:</strong> {message.mesaj_metni} <br />
                            <small>{message.tarih}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MessageApp;
