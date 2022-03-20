import React from "react";
import { useParams } from "react-router-dom";
import useFeed from "../hooks/feed";
import Message from "./message";
import Messages from "./messages";
import Back from "./back";

function Comments(props) {
  const isComment = true;
  const { id } = useParams();
  const resource = `comment?id=${id}`;
  const [messages, setNewMessage, toggleLike, handleLike] = useFeed({
    isLoggedIn,
    resource,
    isComment
  });
  const { isLoggedIn } = props;

  return (
    <div className="messages">
      <Back />
      {isLoggedIn ? (
        <Message isComment={isComment} id={id} setNewMessage={setNewMessage} />
      ) : null}
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
