import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "./avatar";
import Username from "./username";
import Back from "./back";
import useScrollHandler from "../hooks/scroll";

function Likes(props) {
  const [likes, setLikes] = useState([]);
  const [batch, setBatch, isLoading, setIsLoading, setAllLoaded] = useScrollHandler();
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch(`${process.env.BASE_URL}/api/like?id=${id}&batch=${batch}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          if (json.length === 0) {
            setAllLoaded(true);
          }
          setLikes(likes.concat(json));
          setIsLoading(false);
        }
      });
    return () => (isMounted = false);
  }, [batch]);

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
      {isLoading && <div className="loader"></div>}
    </div>
  );
}

export default Likes;
