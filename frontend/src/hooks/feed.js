import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useLike from "./like";
import useScrollHandler from "./scroll";

function useFeed(props) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({});
  const [toggleLike, handleLike] = useLike();
  const [batch, setBatch, isLoading, setIsLoading, setAllLoaded] =
    useScrollHandler();
  const isInitialMount = useRef(true);
  const navigate = useNavigate();
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
  }, [isLoggedIn, batch]);

  useEffect(() => {
    setMessages(
      messages.map((message) => {
        if (message._id === toggleLike.id) {
          if (message.isLiked) {
            message.isLiked = false;
            message.likes.pop();
          } else {
            message.isLiked = true;
            message.likes.push({});
          }
        }
        return message;
      })
    );
  }, [toggleLike]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      let isMounted = true;
      setIsLoading(true);
      setBatch(0);
      fetch(
        `${process.env.BASE_URL}/api/${resource}${
          isComment ? "&" : "?"
        }batch=0`,
        { credentials: "include" }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((json) => {
          if (isMounted) {
            setMessages(json);
            setIsLoading(false);
          }
        });
      return () => (isMounted = false);
    }
  }, [newMessage]);

  return [messages, setNewMessage, isLoading, toggleLike, handleLike];
}

export default useFeed;
