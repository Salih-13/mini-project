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

const Books = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");
  const [books, setBooks] = useState([]);
  const [files, setFiles] = useState([]);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const unsubscribeBooks = onSnapshot(collection(db, "Books"), (querySnapshot) => {
      const fetchedBooks = [];
      querySnapshot.forEach((doc) => {
        const bookData = doc.data();
        fetchedBooks.push({ id: doc.id, ...bookData });
      });
      setBooks(fetchedBooks);
    });

    const fetchFiles = async () => {
      try {
        const storageRef = ref(storage, 'books');
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
      const storageRef = ref(storage, `books/${selectedFile.name}`);
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
            const collectionRef = collection(db, "Books");
            await addDoc(collectionRef, {
              user,
              description,
              link: downloadURL,
            });
            console.log("File uploaded and book added successfully.");
          } catch (error) {
            console.error("Error adding book:", error);
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
      
      <h1>Books</h1>
      <div className="upload">
        <h1>Add More </h1>
        <input type="file" onChange={handleFileChange} />
         <button type="submit" onClick={handleUpload}>
          <FontAwesomeIcon icon={faPlus} /> Upload
        </button>
       </div>
       
      <h1>Books</h1>
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
              <p>Uploaded by: {file.username}</p> {/* Display username */}
             
            </div>
          ))}
        </div>
      </div>
    </div>
   
  );
};

export default Books;