import React, { useState, useEffect } from 'react';

function MessageApp({ recipientId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        document.title = 'Chats';
      }, []);

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
    

    // HER SANİYE MESAJLARI YENİLEME
    
    useEffect(() => {
        if (!recipientId) return;

        const interval = setInterval(() => {
            fetch(`/get_messages?alici_id=${recipientId}`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Gelen Mesajlar:', data);
                    setMessages(data);
                })
                .catch(error => console.error('Error fetching messages:', error));
        }, 500);

        return () => clearInterval(interval);
    }, [recipientId]);

    
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
        <div className="chat-app">
            <h1>Message App</h1>
            <div className="chat-container">
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
