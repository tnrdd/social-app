import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "./avatar";
import Username from "./username";
import Back from "./back";

function Followers(props) {
  const [user, setUser] = useState({});
  const [followers, setFollowing] = useState([]);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/followers?username=${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        } else {
          return res.json();
        }
      })
      .then((json) => {
        setUser({ username: json.username, avatar: json.avatar });
        setFollowing(json.followers);
      })
      .catch((err) => {
        if (err.message === "404") {
          navigate("*");
        }
      });
  }, []);

  return (
    <div className="follow-list">
      <Back />
      <div className="user">
        <Avatar avatar={user.avatar || "default.jpeg"} />
        <Username username={user.username} />
        <span>is followed by</span>
      </div>
      {followers.map((follower) => {
        return (
          <div className="follow-container" key={followers.indexOf(follower)}>
            <Avatar avatar={follower.avatar} />
            <Username username={follower.username} />
          </div>
        );
      })}
    </div>
  );
}

export default Followers;
