import React from "react";
import { Link, useParams } from "react-router-dom";
import useFeed from "../hooks/feed";
import Messages from "./messages";
import Back from "./back";

function Comments(props) {
  const { postid } = useParams();
  const url = `comment?id=${postid}`;
  const [messages, toggleLike, handleLike] = useFeed({ isLoggedIn, url });
  const { isLoggedIn } = props;

  return (
    <div className="messages">
      <Back />
      <Messages
        isLoggedIn={isLoggedIn}
        toggleLike={toggleLike}
        handleLike={handleLike}
        messages={messages}
      />
    </div>
  );
}

export default Comments;
