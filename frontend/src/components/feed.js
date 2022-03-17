import React, { useState } from "react";
import useFeed from "../hooks/feed";
import Message from "./message";
import Messages from "./messages";

function Posts(props) {
  const { isLoggedIn } = props;
  const resource = `${isLoggedIn ? "feed" : "post"}`;
  const [messages, toggleLike, handleLike] = useFeed({ isLoggedIn, resource });

  return (
    <div>
      {isLoggedIn ? <Message /> : null}
      <Messages
        isLoggedIn={isLoggedIn}
        toggleLike={toggleLike}
        handleLike={handleLike}
        messages={messages}
      />
    </div>
  );
}

export default Posts;
