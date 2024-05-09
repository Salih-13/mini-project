import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../Firebase";
import Sidebar from "../Sidebar";
import "./electronics.css"; // Assuming specific styles for electronics

import { addDoc, collection, onSnapshot } from "firebase/firestore";
import {
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../Firebase";

const Electronics = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [electronics, setElectronics] = useState([]);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const unsubscribeElectronics = onSnapshot(collection(db, "Electronics"), (querySnapshot) => {
      const fetchedElectronics = [];
      querySnapshot.forEach((doc) => {
        const electronicsData = doc.data();
        fetchedElectronics.push({ id: doc.id, ...electronicsData });
      });
      setElectronics(fetchedElectronics);
    });

    const fetchFiles = async () => {
      try {
        const storageRef = ref(storage, 'electronics');
        const fileList = await listAll(storageRef);
        const fileURLs = await Promise.all(fileList.items.map(async (item) => {
          const downloadURL = await getDownloadURL(item);
          return { name: item.name, downloadURL };
        }));
        setFiles(fileURLs);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();

    // Clean up the listeners when the component unmounts
    return () => {
      unsubscribeElectronics();
    };
  }, []);

  const handleUpload = async () => {
    if (selectedFile) {
      const storageRef = ref(storage, `electronics/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const collectionRef = collection(db, "Electronics");
            await addDoc(collectionRef, {
              user,
              description,
              imageUrl: downloadURL, // Use imageUrl instead of link
            });
            console.log("File uploaded and electronics added successfully.");
            // Clear input fields after successful upload
            setSelectedFile(null);
            setDescription("");
            setUser(""); // Clear user information if needed
          } catch (error) {
            console.error("Error adding electronics:", error);
          }
        }
      );
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div className="electronics">
      <Sidebar />
      
      <h1>Electronics</h1>
      <div className="upload">
        <h1>Add More</h1>
        <input type="file" onChange={handleFileChange} />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Optionally add user input field */}
        {/* <input
          type="text"
          placeholder="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        /> */}
        <button type="submit" onClick={handleUpload}>
          <FontAwesomeIcon icon={faPlus} /> Upload
        </button>
      </div>
       
      <div className="electronics-list">
        <ul>
          {electronics.map((item) => (
            <li key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <p>Description: {item.description}</p>
              <p>Uploaded by: {item.user}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Electronics;