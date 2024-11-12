// Chats.js (Ana bileşen)
import React, { useState, useEffect } from 'react';
import GroupList from './GroupList';  // Grup listesi bileşeni
import ChatPage from './Chatpage';    // Sohbet sayfası bileşeni
import './Chats.css';  // CSS dosyası

const Chats = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Kullanıcının gruplarını al
    fetch('/get_user_groups')  // API'den grupları al
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error(err));
  }, []);

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);  // Seçilen grubu güncelle
  };

  return (
    <div className="chats">
      <div className="sidebar">
        <GroupList groups={groups} onGroupSelect={handleGroupSelect} />
      </div>
      <div className="chat">
        {selectedGroup ? (
          <ChatPage groupId={selectedGroup} />  // Seçilen grup için sohbeti göster
        ) : (
          <h2>Bir grup seçin</h2>  // Hiçbir grup seçilmemişse bu mesajı göster
        )}
      </div>
    </div>
  );
};

export default Chats;
