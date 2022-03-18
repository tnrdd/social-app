import React, { useState, useEffect } from "react";
import useLike from "./like";

function useFeed(props) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [toggleLike, handleLike] = useLike();
  const { isLoggedIn, resource } = props;

  useEffect(() => {
    let isMounted = true;
    fetch(`${process.env.BASE_URL}/api/${resource}`, {
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
  }, [isLoggedIn, toggleLike, newMessage]);

  return [messages, setNewMessage, toggleLike, handleLike];
}

export default useFeed;
