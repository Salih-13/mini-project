import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Signupform.css';
import app from './Firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { uploadBytes } from 'firebase/storage'; // Import storage from Firebase
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';



const Signupform = () => {
  const storage = getStorage(); // Get storage instance
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const auth = getAuth(app); // Get authentication service instance
 

const onSubmit = async (data) => {
  try {
    const { fullName, username, email, password, birthdate, gender, profilePicture } = data;

    // Create user with email and password
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    // Update user profile with additional fields
    await updateProfile(user, {
      displayName: username,
      // Additional fields
      fullName: fullName,
      birthdate: birthdate,
      gender: gender,
    });


    // Create a reference to the profile picture location in Firebase Storage
    const storageRef = ref(storage, `profilePictures/${user.uid}/${profilePicture[0].name}`);

    // Upload profile picture to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, profilePicture[0]);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        // Handle errors
        console.error('Error uploading profile picture:', error);
        setErrorMessage('Error uploading profile picture');
      }, 
      async () => {
        // Upload successful, get download URL and update user profile
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // Update user profile with display name and photo URL
        updateProfile(user, {
          displayName: username,
          photoURL: downloadURL, // Set the photo URL to the download URL of the uploaded picture
        }).then(() => {
          console.log('User created successfully');
          setSuccessMessage('User created successfully');
        }).catch((error) => {
          console.error('Error updating user profile:', error.message);
          setErrorMessage('Error updating user profile');
        });
      }
    );
  } catch (error) {
    console.error('Error creating user:', error.message);
    setErrorMessage(error.message);
  }
};


  return (
    <body>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className='image'>
        <img  src="./signup.png"  alt="logo" />
      </div>
      <div className='heading'>
      <h1>Create Your Account</h1>
      </div>

        {/* Form fields */}
        <div className='signupcontainer'>
          <div>
          <label>Full Name</label>
          <input type="text" {...register("fullName", { required: true })} />
          {errors.fullName?.type === "required" && (
            <p className="errorMsg">Full Name is required.</p>
          )}
        </div>
        <div>
        <label>Username</label>
        <input type="text" {...register("username", { required: true })} />
        {errors.username?.type === "required" && (
          <p className="errorMsg">Username is required.</p>
        )}
      </div>
      <div>
        <label>Email</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email?.type === "required" && (
          <p className="errorMsg">Email is required.</p>
        )}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password", { required: true, minLength: 6 })} />
        {errors.password?.type === "required" && (
          <p className="errorMsg">Password is required.</p>
        )}
        {errors.password?.type === "minLength" && (
          <p className="errorMsg">Password must be at least 6 characters long.</p>
        )}
      </div>
      <div>
        <label>Date of Birth</label>
        <input type="date" {...register("birthdate", { required: true })} />
        {errors.birthdate?.type === "required" && (
          <p className="errorMsgdob">Date of Birth is required.</p>
        )}
      </div>
      <div>
        <label>Gender</label>
        <select {...register("gender", { required: true })}>
          <option value=""></option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender?.type === "required" && (
          <p className="errorMsg">Gender is required.</p>
        )}
      </div>
        <div>
          {/* Profile Picture input */}
          <label>Profile Picture</label>
          <input type="file" {...register("profilePicture")} />
        </div>
        {/* Submit button */}
        <div>
          <input type="submit" value="Create Account" />
        </div>
        </div>
        {/* Success and error messages */}
        {successMessage && (
          <div className="successMessage">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="errorMessage">
            {errorMessage}
          </div>
          
        )}
      </form>
    </body>
  );
}

export default Signupform;
