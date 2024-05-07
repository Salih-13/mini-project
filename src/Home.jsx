import React, { useState } from 'react';
import './Home.css';
import Sidebar from './Sidebar';
import firebase from './Firebase'; // Import Firebase core module
import 'firebase/storage'; // Import Firebase storage module
import { Link } from 'react-router-dom';


const Home = () => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

 
  
  return (
    <div className='home'>
      <Sidebar />
      <div>
        <div className='image1'>
          <img src='./books.png' alt='books' />
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <div className="search">
              <button type="submit">Search</button>
            </div>
          </div>
        </div>
        <div className='categories'>
          <p>Categories</p>
        </div>
        <div className='category-list'>
          <div className='image-container1'>
           {/* Use Link component to wrap the books category image */}
           <Link to="/books">
              <img src='./book1.jpg' alt='books' />
            </Link>
            <div className="overlay-text1">Books </div>
          </div>
          <div className='image-container2'>
            <Link to="/electronics">
            <img src='./electronics.jpg' alt='electronics' />
            </Link>
            <div className="overlay-text2">Electronics</div>
          </div>
          <div className='image-container3'>
            <img src='./sports3.jpg' alt='sports' />
            <div className="overlay-text3">Sports</div>
          </div>
          <div className='image-container4'>
            <img src='./clothing.jpg' alt='clothing' />
            <div className="overlay-text4">Clothing</div>
          </div>
          <div className='image-container5'>
            <img src='./instruments.jpg' alt='instruments' />
            <div className="overlay-text5">Instruments</div>
          </div>
         
        </div>
       
        
      </div>
    </div>
  );
};

export default Home;
