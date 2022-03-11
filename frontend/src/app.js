import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavLink } from "react-router-dom";

import Signup from "./components/signup";
import Login from "./components/login";
import Posts from "./components/posts";

import "./styles/style.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <NavLink to="logout">
              <p onClick={handleLogOut}>Log out</p>
            </NavLink>
          </nav>
        ) : (
          <nav>
            <NavLink to="signup">
              <p>Sign up</p>
            </NavLink>
            <NavLink to="login">
              <p>Log in</p>
            </NavLink>
          </nav>
        )}
      </header>
      <Routes>
        <Route path="/" element={isLoggedIn ? null : <Posts />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </div>
  );
}

export default App;
