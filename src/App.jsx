import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import MyPosts from "./pages/MyPosts/MyPosts";
import UserProfile from "./pages/UserProfile/UserProfile";

import { useSocialMedia } from "./Context/SocialMediaContext";
import Welcome from "./pages/Welcome/Welcome";
import FollowList from "./components/FollowList/FollowList";

function App() {
  const { address, isDisconnected } = useSocialMedia();

  useEffect(() => {
    if (isDisconnected) {
      localStorage.removeItem("isRegistered");
    }
  }, [isDisconnected]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/search" element={<FollowList />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default App;
