import React, { useState, useEffect } from "react";
import useLike from "./like"

function useFeed(props) {
  const [messages, setMessages] = useState([]);
  const [toggleLike, handleLike] = useLike();
  const {isLoggedIn, url} = props;

  useEffect(() => {
    let isMounted = true;
    fetch(`http://127.0.0.1:3000/api/${url}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json, status) => {
        if (isMounted && json) {
          setMessages(json);
        }
      });
    return () => (isMounted = false);
  }, [isLoggedIn, toggleLike]);

  return [ messages, toggleLike , handleLike];
}

export default useFeed;
