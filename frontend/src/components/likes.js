import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "./avatar";
import Username from "./username";
import Back from "./back";

function Likes(props) {
  const [likes, setLikes] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/like?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        setLikes(json);
      });
  }, []);

  return (
    <div className="like-list">
      <Back />
      {likes.map((like) => {
        return (
          <div className="like-container" key={likes.indexOf(like)}>
            <Avatar avatar={like.user.avatar} />
            <Username username={like.user.username} />
          </div>
        );
      })}
    </div>
  );
}

export default Likes;
