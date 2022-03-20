import React, { useState, useEffect } from "react";
import useLike from "./like";
import useScrollHandler from "./scroll";

function useFeed(props) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [toggleLike, handleLike] = useLike();
  const [batch, isLoading, setIsLoading, setAllLoaded] = useScrollHandler();
  const { isLoggedIn, resource, isComment } = props;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch(
      `${process.env.BASE_URL}/api/${resource}${
        isComment ? "&" : "?"
      }batch=${batch}`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((json) => {
        if (isMounted) {
          if (json.length === 0) {
            setAllLoaded(true);
          }
          setMessages(messages.concat(json));
          setIsLoading(false);
        }
      });
    return () => (isMounted = false);
  }, [isLoggedIn, toggleLike, newMessage, batch]);

  return [messages, setNewMessage, isLoading, toggleLike, handleLike];
}

export default useFeed;
