// GroupList.js
import React from 'react';

const GroupList = ({ groups, onGroupSelect }) => {
  return (
    <div className="group-list">
      <h3>Gruplar</h3>
      <ul>
        {groups.map(group => (
          <li key={group.id} onClick={() => onGroupSelect(group.id)}>
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
