import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
import Logo from "./assets/logo.svg";
import "./styles/general.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.BASE_URL}/api`, { credentials: "include" }).then(
      (res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        }
      }
    );
  }, []);

  const handleLogOut = () => {
    fetch(`${process.env.BASE_URL}/api/logout`, { credentials: "include" }).then(
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
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>
        {isLoggedIn ? (
          <Link to="/">
            <button onClick={handleLogOut}>Log out</button>
          </Link>
        ) : (
          <nav>
            <Link id="signup-btn" to="signup">
              <button>Sign up</button>
            </Link>
            <Link to="login">
              <button>Log in</button>
            </Link>
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
