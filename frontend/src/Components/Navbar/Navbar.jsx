import React from 'react';
import { Link } from 'react-router-dom';
import { LuPartyPopper } from "react-icons/lu";
import { IoChatboxEllipsesOutline, IoCreateOutline } from "react-icons/io5";

const Navbar = () => {
  const navItems = [
    { title: 'My Events', icon: <LuPartyPopper />, path: '/my-events' },
    { title: 'Chats', icon: <IoChatboxEllipsesOutline />, path: '/chats' },
    { title: 'Create Event', icon: <IoCreateOutline />, path: '/create-event' },
    { title: 'All Events', icon: <IoCreateOutline />, path: '/all-events' },
    { title: 'Edit Profile', icon: <IoCreateOutline />, path: '/edit-profile' },
    { title: 'Ana Menü', icon: <IoCreateOutline />, path: '/mainmenu' },
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
