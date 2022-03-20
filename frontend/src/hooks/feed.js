import React, { useState, useEffect } from "react";
import useLike from "./like";
import debounce from "../utils/debounce";

function useFeed(props) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [batch, setBatch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [toggleLike, handleLike] = useLike();
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

  return [messages, setNewMessage, toggleLike, handleLike];
}

export default useFeed;
