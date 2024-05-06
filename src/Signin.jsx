import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom'; // Import Redirect component

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication functions
import './Signin.css';

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth(); // Get authentication service instance
      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, username, password);
      // If successful, you can redirect the user to another page or perform any other actions
       // Redirect to the home screen
      console.log('User created successfully');
      setSuccessMessage('User logged in successfully'); // Update success message state
      window.location.href = '/home';
    } catch (error) {
      console.error('Error loging in user:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="sign-up-container">
      <hr className="title" />
      <form onSubmit={handleSubmit}>
        <h2>
          <b>Log In</b>
        </h2>
        <input
          type="text"
          placeholder="E-mail "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={`eye-icon ${showPassword ? 'open' : ''}`} onClick={togglePasswordVisibility}>
            <img src="/showpassword.png" alt="eye icon" width={20} height={20} />
          </div>
        </div>
        <div className="button1">
          <button type="submit">Login</button>
        </div>
      </form>
      <p>OR</p>
      <div className="button2">
        <button>
          <a href="/google-login">Log in with Google</a>
        </button>
        <button>
          <a href="/apple-login">Log in with Apple</a>
        </button>
      </div>
      <p>
        Don't have an account?{' '}
        <Link to="signup">
          SignUp
        </Link>
      </p>
      {errorMessage && (
        <div className="errorMessage">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="successMessage">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Signin;
