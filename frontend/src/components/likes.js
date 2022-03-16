import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "./avatar";
import Username from "./username";
import Back from "./back";

function Likes(props) {
  const [likes, setLikes] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    fetch(`${process.env.BASE_URL}/api/like?id=${id}`)
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
