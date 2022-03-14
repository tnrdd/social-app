import React, { useState, useEffect } from "react";
import useFeed from "../hooks/feed";
import Message from "./message";
import Messages from "./messages";

function Posts(props) {
  const { isLoggedIn } = props;
  const url = `${isLoggedIn ? "feed" : "post"}`;
  const [ messages, toggleLike , handleLike] = useFeed({isLoggedIn, url});

  return (
    <div className="messages">
      <Message/>
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
