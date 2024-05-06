import React from "react";
import Navbar from "./Navbar1"
import Search from "./Search"
import Chats from "./Chats"

const Sidebar1 = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search/>
      <Chats/>
    </div>
  );
};

export default Sidebar1;