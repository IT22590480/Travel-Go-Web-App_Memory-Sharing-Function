import React from 'react';
import '../../styles/navbar.css';

import memoryIcon from '../../assets/photoIcon.svg'

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={memoryIcon} alt="App Logo" />
        <span id='title'>Travel Go</span>
      </div>
      {/* <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div> */}
      <div className="menu">
        <ul>
        <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </div>
  );
}
