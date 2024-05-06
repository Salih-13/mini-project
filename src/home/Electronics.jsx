import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../Firebase";
import Sidebar from "../Sidebar";
import "./books.css";

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
  const [books, setBooks] = useState([]);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const unsubscribeBooks = onSnapshot(collection(db, "Electronics"), (querySnapshot) => {
      const fetchedBooks = [];
      querySnapshot.forEach((doc) => {
        const bookData = doc.data();
        fetchedBooks.push({ id: doc.id, ...bookData });
      });
      setBooks(fetchedBooks);
    });

    const fetchFiles = async () => {
      try {
        const storageRef = ref(storage, 'electronics'); // Use 'electronics' folder
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
      unsubscribeBooks();
    };
  }, []);

  const handleUpload = async () => {
    if (selectedFile) {
      const storageRef = ref(storage, `electronics/${selectedFile.name}`); // Upload to 'electronics' folder
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
            const collectionRef = collection(db, "Electronics"); // Use 'Electronics' collection
            await addDoc(collectionRef, {
              user,
              description,
              link: downloadURL,
            });
            console.log("File uploaded and electronics item added successfully.");
          } catch (error) {
            console.error("Error adding electronics item:", error);
          }
        }
      );
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div className="book">
      <Sidebar />
      <h1>Electronics</h1>
      <div className="upload">
        <h1>Add More </h1>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" onClick={handleUpload}>
          <FontAwesomeIcon icon={faPlus} /> Upload
        </button>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Assuming 'user' state holds the username */}
        {/* This input can be replaced with your user authentication mechanism */}
        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <h1></h1>
      <div className="book-list">
        <ul>
          {books.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      </div>
      <div className="file-list">
        <div className="image-list">
          {files.map((file, index) => (
            <div key={index} className="image-item">
              <img src={file.downloadURL} alt={file.name} />
              <p>Uploaded by: {file.username}</p>
              <p>Description: {file.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Electronics;
