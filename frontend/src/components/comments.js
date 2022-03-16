import React from "react";
import { useParams } from "react-router-dom";
import useFeed from "../hooks/feed";
import Message from "./message";
import Messages from "./messages";
import Back from "./back";

function Comments(props) {
  const { id } = useParams();
  const resource = `comment?id=${id}`;
  const [messages, toggleLike, handleLike] = useFeed({ isLoggedIn, resource });
  const { isLoggedIn } = props;

  return (
    <div className="messages">
      <Back />
      {isLoggedIn ? <Message isComment={true} id={id} /> : null}
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
