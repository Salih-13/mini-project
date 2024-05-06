import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Import necessary storage functions
import './Profile.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState('');

  // Define storage object
  const storage = getStorage();

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      // Fetch user details from Firebase Authentication
      const { displayName, email, dateOfBirth, gender } = auth.currentUser;
      setUserDetails({ displayName, email, dateOfBirth, gender });
      // Fetch profile picture URL from Firebase Storage
      fetchProfilePictureURL(auth.currentUser.uid);
    }
    setLoading(false);
  }, []);

  // Function to fetch profile picture URL from Firebase Storage
  const fetchProfilePictureURL = (userId) => {
    const storageRef = ref(storage, `profilePictures/${userId}`);
    getDownloadURL(storageRef)
      .then((url) => {
        setProfilePictureURL(url);
      })
      .catch((error) => {
        console.error('Error fetching profile picture URL:', error);
      });
  };

  // Function to handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePicture(file);
  };

  // Function to handle edit button click
  const handleEditClick = () => {
    setEditing(true);
    // Populate the username field with current user's username
    setNewUsername(userDetails.displayName);
  };

  // Function to handle save button click
  const handleSaveClick = () => {
    // Update user profile with new username
    updateProfile(getAuth().currentUser, {
      displayName: newUsername,
    })
      .then(() => {
        console.log('User profile updated successfully');
        // Update user details state
        setUserDetails({
          ...userDetails,
          displayName: newUsername,
        });
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error updating user profile:', error.message);
      });
  };

  return (
    <div className='profile'>
      <Sidebar />
      <div className='profile-details'>
        <h2>User Profile</h2>
        {loading ? (
          <p>Loading...</p>
        ) : userDetails ? (
          <>
            {/* Profile Picture */}
            <div className='profile-picture'>
              <img src={profilePictureURL} alt='Profile' />
              {editing && <input type='file' onChange={handleProfilePictureChange} />}
            </div>
            {/* Username */}
            <p>
              <strong>Username:</strong> {editing ? (
                <input
                  type='text'
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              ) : (
                userDetails.displayName
              )}
            </p>
            {/* Email */}
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            {/* Date of Birth */}
            <p>
              <strong>Date of Birth:</strong> {userDetails.dateOfBirth}
            </p>
            {/* Gender */}
            <p>
              <strong>Gender:</strong> {userDetails.gender}
            </p>
            {/* Edit/Save Button */}
            {editing ? (
              <button onClick={handleSaveClick}>Save</button>
            ) : (
              <button onClick={handleEditClick}>Edit</button>
            )}
          </>
        ) : (
          <p>No user details available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
