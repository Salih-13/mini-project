import React, { useState, useEffect } from 'react';
import { FaTh, FaBars, FaHome, FaSearchengin, FaCommentAlt, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import './Sidebar.css';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null); // State to store profile picture URL

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDisplayName = user.displayName;
        setUsername(userDisplayName); // Update the username state
        const profilePicUrl = user.photoURL; // Get profile picture URL from Firebase Auth
        console.log("Profile picture URL:", profilePicUrl); // Debugging: Log the profile picture URL
        setProfilePictureUrl(profilePicUrl); // Update the profile picture URL state
      } else {
        setUsername(null);
        setProfilePictureUrl(null);
      }
    });
    return () => unsubscribe();
  }, []);
  
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Redirect to the home page after logout
      window.location.href = '/'; 
    }).catch((error) => {
      console.error('Error signing out:', error.message);
    });
  };

  const menuItems = [
    { path: "/home", name: "Home", icon: <FaHome size={30} /> },
   { path: "/explore", name: "Explore", icon: <FaSearchengin size={30} /> },
    { path: "/chathome", name: "Chat", icon: <FaCommentAlt size={30} /> },
    { path: "/profile", name: "Profile", icon: <FaShoppingBag size={30} /> },
    { path: "/signout", name: "Signout", icon: <FaSignOutAlt size={30} />, onClick: handleLogout }
  ];

  return (
    
    <div className="dashboard">
       
      <div className="container">
        <div
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          style={{ width: isOpen ? "400px" : "80px" }}
          className="sidebar"
        >
          <div className="top_section">
            <div style={{ marginLeft: isOpen ? "130px" : "0px" }} className="bars">
              {isOpen ? <FaBars /> : null}
            </div>
          </div>
          <div className="user_info">
            {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" className="profile_picture" />}
            {username && <p className="username">Welcome, {username}</p>}
          </div>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="link"
              onClick={item.onClick} // Attach onClick event handler
              activeClassName="active"
            >
              <div className="icon">{item.icon}</div>
              <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
            </NavLink>
          ))}
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
