import React from "react";
import { Link, useParams } from "react-router-dom";
import useFeed from "../hooks/feed";
import Messages from "./messages";
import Message from "./message";
import Back from "./back";

function Comments(props) {
  const { id } = useParams();
  const url = `comment?id=${id}`;
  const [messages, toggleLike, handleLike] = useFeed({ isLoggedIn, url });
  const { isLoggedIn } = props;

  return (
    <div className="messages">
      <Back />
      {isLoggedIn ? <Message isComment={true} id={id}/> : null}
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
