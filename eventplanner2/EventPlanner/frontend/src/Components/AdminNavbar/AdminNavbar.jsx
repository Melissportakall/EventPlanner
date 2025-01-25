import React from 'react';
import { Link } from 'react-router-dom';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";
import './AdminNavbar.css'
const AdminNavbar = () => {
  const navItems = [
    { title: 'Home Page', icon: <IoCreateOutline />, path: '/admin-mainmenu' },
    { title: 'All Users', icon: <IoChatboxEllipsesOutline />, path: '/admin-all-users' },
    { title: 'Verify Events', icon: <IoCreateOutline />, path: '/admin-verify-events' },
    { title: 'Log Out', icon: <IoCreateOutline />, path: '/logout' },
    
  ];

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link to={item.path} className="nav-link">
              {item.icon} <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
