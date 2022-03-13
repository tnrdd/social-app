import React, { useState, useEffect } from "react";
import useFeed from "../hooks/feed";

import Interactions from "./interactions";
import Username from "./username";
import Avatar from "./avatar";

function Posts(props) {
  const {isLoggedIn} = props;
  const url = `${isLoggedIn ? "feed" : "post"}`;
  const [{ messages, toggleLike }, handleLike] = useFeed(url);

  return (
    <div className="posts">
      {messages.map((message) => {
        return (
          <div className="post-container" key={messages.indexOf(message)}>
            <Avatar message={message}/>
            <div className="post">
              <Username message={message}/>
              <div className="text">{message.text}</div>
              <Interactions message={message} toggleLike={isLoggedIn ? toggleLike : null} handleLike={isLoggedIn ? handleLike : null}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
