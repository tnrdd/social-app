import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavLink } from "react-router-dom";

import Signup from "./components/signup";

import "./styles/style.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookie = document.cookie.split(";");
    if (cookie.includes("accessToken")) {
      setIsLoggedIn(true);
    }
  });

  const handleLogOut = () => {
    fetch("http//:127.0.0.1:3000/api/logout").then((res) => {
      if (res.ok) {
        setIsLoggedIn(false);
      }
    });
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
        <Route path="/" element={<p>Home</p>} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<p>Login</p>} />
        <Route path="logout" element={<p>Logout</p>} />
      </Routes>
    </div>
  );
}

export default App;
