import React from 'react';
import { Link } from 'react-router-dom';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";

const Navbar = () => {
  const navItems = [
    { title: 'Home Page', icon: <IoCreateOutline />, path: '/mainmenu' },
    { title: 'My Events', icon: <LuPartyPopper />, path: '/my-events' },
    { title: 'Chats', icon: <IoChatboxEllipsesOutline />, path: '/chats' },
    { title: 'Create Event', icon: <IoCreateOutline />, path: '/create-event' },
    { title: 'All Events', icon: <IoCreateOutline />, path: '/all-events' },
    { title: 'View My Profile', icon: <IoCreateOutline />, path: '/view-profile' },
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

export default Navbar;
