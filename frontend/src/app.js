import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import Signup from "./components/signup";
import Login from "./components/login";
import Feed from "./components/feed";
import Comments from "./components/comments";
import Likes from "./components/likes";
import Following from "./components/following";
import Followers from "./components/followers";
import Profile from "./components/profile";
import Settings from "./components/settings";
import NotFound from "./components/404";
import "./styles/style.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/", { credentials: "include" }).then(
      (res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        }
      }
    );
  }, []);

  const handleLogOut = () => {
    fetch("http://127.0.0.1:3000/api/logout", { credentials: "include" }).then(
      (res) => {
        if (res.ok) {
          setIsLoggedIn(false);
          navigate("/");
        }
      }
    );
  };

  return (
    <div>
      <header>
        <NavLink to="/">Home</NavLink>
        {isLoggedIn ? (
          <nav>
            <NavLink to="/">
              <button id="logout-btn" onClick={handleLogOut}>
                Log out
              </button>
            </NavLink>
          </nav>
        ) : (
          <nav>
            <NavLink id="signup-btn" to="signup">
              <button onClick={handleLogOut}>Sign up</button>
            </NavLink>
            <NavLink id="login-btn" to="login">
              <button onClick={handleLogOut}>Log in</button>
            </NavLink>
          </nav>
        )}
      </header>
      <Routes>
        <Route path="/" element={<Feed isLoggedIn={isLoggedIn} />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/:username"
          element={<Profile isLoggedIn={isLoggedIn} />}
        />
        <Route path="/:username/following" element={<Following />} />
        <Route path="/:username/followers" element={<Followers />} />
        <Route path="/:username/settings" element={<Settings />} />
        <Route
          path="/comment/:id"
          element={<Comments isLoggedIn={isLoggedIn} />}
        />
        <Route path="/likes/:id" element={<Likes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
