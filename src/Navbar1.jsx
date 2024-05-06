import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from './Firebase'
import { AuthContext } from './AuthContext'

const Navbar1 = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <div>Loading...</div>; // or handle the loading state appropriately
  }

  return (
    <div className='navbar'>
      <span className="logo">Lama Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};


export default Navbar1