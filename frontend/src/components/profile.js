import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useLike from "../hooks/like";
import Messages from "./messages"
import Username from "./username";
import Avatar from "./avatar";
import Interactions from "./interactions";
import Back from "./back";
import { FiSettings } from "react-icons/fi";
import "../styles/profile.css";
import "../styles/messages.css";

function Profile(props) {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [toggleLike, handleLike] = useLike([]);
  const { isLoggedIn } = props;

  useEffect(() => {
    let isMounted = true;
    fetch(`${process.env.BASE_URL}/api/profile?username=${username}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setProfile({
            id: json._id,
            following: json.following,
            followers: json.followers,
            avatar: json.avatar,
            isFollowed: json.isFollowed,
            isUser: json.isUser,
          });
          setPosts(json.posts);
        }
      })
      .catch((err) => {
        if (err.message === "404") {
          navigate("*");
        }
      });

    return () => (isMounted = false);
  }, [isLoggedIn, toggleLike]);

  const handleFollow = () => {
    const userId = { id: profile.id };
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetch(`${process.env.BASE_URL}/api/follow`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(userId),
      }).then((res) => {
        if (res.ok) {
          setProfile({ ...profile, isFollowed: !profile.isFollowed });
        }
      });
    }
  };

  return (
    <div>
      <div className="profile">
        <Back />
        <div className="follow">
          <Avatar avatar={profile.avatar} />
          {profile.isUser ? null : (
            <button onClick={handleFollow}>
              {profile.isFollowed ? "Unfollow" : "Follow"}
            </button>
          )}
          {profile.isUser ? (
            <span className="settings-icon">
              <Link to={`/${username}/settings`}>
                <FiSettings size={30} />
              </Link>
            </span>
          ) : null}
        </div>
        <span className="username">{username}</span>
        <div className="profile-stats">
          <div className="follow-count">
            <Link to={`/${username}/following`}>
              {Array(profile.following).length}
              <span>Following</span>
            </Link>
          </div>
          <div className="follow-count">
            <Link to={`/${username}/followers`}>
              {Array(profile.followers).length}
              <span>Followers</span>
            </Link>
          </div>
        </div>
      </div>
      <Messages
        isLoggedIn={isLoggedIn}
        messages={posts}
        toggleLike={toggleLike}
        handleLike={handleLike}
        username={username}
      />
    </div>
  );
}

export default Profile;
