import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useLike from "../hooks/like";
import Username from "./username";
import Avatar from "./avatar";
import Interactions from "./interactions";
import Back from "./back";

function Profile(props) {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [toggleLike, handleLike] = useLike([]);
  const { isLoggedIn } = props;

  useEffect(() => {
    let isMounted = true;
    fetch(`http://127.0.0.1:3000/api/profile?username=${username}`, {
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
      fetch("http://127.0.0.1:3000/api/follow", {
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
          <Avatar avatar={profile.avatar || "default.jpeg"} />
          <button
            style={profile.isUser ? { display: "none" } : { display: "block" }}
            onClick={handleFollow}
          >
            {profile.isFollowed ? "Unfollow" : "Follow"}
          </button>
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
      <div className="messages">
        {posts.map((post) => {
          return (
            <div className="message-container" key={posts.indexOf(post)}>
              <Avatar avatar={profile.avatar} />
              <div className="message">
                <Username username={username} />
                <span className="timestamp">{post.createdAt.slice(0, 10)}</span>
                <div className="text">{post.text}</div>
                <Interactions
                  message={post}
                  toggleLike={isLoggedIn ? toggleLike : null}
                  handleLike={isLoggedIn ? handleLike : null}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
