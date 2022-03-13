import React, { useState, useEffect } from "react";

function useFeed(props) {
  const [messages, setMessages] = useState([]);
  const [toggleLike, setToggleLike] = useState(0);
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

  const handleLike = (id) => {
    const targetId = { id: id };
    fetch("http://127.0.0.1:3000/api/like", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(targetId),
    }).then((res) => {
      if (res.ok) {
        setToggleLike(!toggleLike);
      }
    });
  };

  return [{ messages, toggleLike }, handleLike];
}

export default useFeed;
