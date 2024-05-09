import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { storage } from './Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Explore = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const imageList = [];
      const imagesRef = ref(storage, 'images');
      const imageListResult = await storage.listAll(imagesRef);

      await Promise.all(
        imageListResult.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef);
          imageList.push(url);
        })
      );

      setImageURLs(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle upload progress if needed
          },
          (error) => {
            console.error('Error uploading file:', error);
          },
          async () => {
            // Upload completed, fetch new list of images
            await fetchImages();
          }
        );
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div className="explore">
      <h1>Image Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>
        <FontAwesomeIcon icon={faPlus} /> Upload
      </button>

      <h2>Images</h2>
      <div className="image-list">
        {imageURLs.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Image ${index}`}
            style={{ width: '300px', height: 'auto', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;
