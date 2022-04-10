import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "./avatar";
import Username from "./username";
import Back from "./back";
import useScrollHandler from "../hooks/scroll";
import "../styles/messages.css";

function Following() {
  const [user, setUser] = useState({});
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();
  const { username } = useParams();
  const [batch, setBatch, isLoading, setIsLoading, setAllLoaded] =
    useScrollHandler();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch(
      `${process.env.BASE_URL}/api/following?username=${username}&batch=${batch}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        } else {
          return res.json();
        }
      })
      .then((json) => {
        if (isMounted) {
          if (json.length === 0) {
            setAllLoaded(true);
          }
          setUser({ username: json.username, avatar: json.avatar });
          setFollowing(following.concat(json.following));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.message === "404") {
          navigate("*");
        }
      });
    return () => (isMounted = false);
  }, [batch]);

  return (
    <div className="follow-list">
      <Back />
      <div className="user">
        <Avatar avatar={user.avatar || "default.jpeg"} />
        <Username username={user.username} />
        <span>is following</span>
      </div>
      {following.map((follow) => {
        return (
          <div className="follow-container" key={follow._id}>
            <Avatar avatar={follow.avatar} />
            <Username username={follow.username} />
          </div>
        );
      })}
      {isLoading && <div className="loader"></div>}
    </div>
  );
}

export default Following;
