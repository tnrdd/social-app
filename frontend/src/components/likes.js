import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Avatar from "./avatar";
import Username from "./username";
import Back from "./back";
import debounce from "../utils/debounce"

function Likes(props) {
  const [likes, setLikes] = useState([]);
  const [batch, setBatch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
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

  window.onscroll = debounce(() => {
    if (isLoading || allLoaded) {
      return;
    }

    if (
      window.innerHeight + window.pageYOffset ===
      document.body.scrollHeight
    ) {
      setBatch(batch + 1);
    }
  }, 100);

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
