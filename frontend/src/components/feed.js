import React, { useState } from "react";
import useFeed from "../hooks/feed";
import Message from "./message";
import Messages from "./messages";

function Posts(props) {
  const { isLoggedIn } = props;
  const resource = `${isLoggedIn ? "feed" : "post"}`;
  const [messages, setNewMessage, isLoading, toggleLike, handleLike] = useFeed({
    isLoggedIn,
    resource,
  });

  return (
    <div>
      {isLoggedIn ? <Message setNewMessage={setNewMessage} /> : null}
      <Messages
        isLoggedIn={isLoggedIn}
        toggleLike={toggleLike}
        handleLike={handleLike}
        messages={messages}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Posts;
