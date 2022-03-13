import React, { useState, useEffect } from "react";

import Interactions from "./interactions";
import Username from "./username";
import Avatar from "./avatar";

function Messages(props) {
  const { isLoggedIn, messages, toggleLike, handleLike } = props;

  return (
    <div className="messages">
      {messages.map((message) => {
        return (
          <div className="message-container" key={messages.indexOf(message)}>
            <Avatar message={message} />
            <div className="message">
              <Username message={message} />
              <div className="text">{message.text}</div>
              <Interactions
                message={message}
                toggleLike={isLoggedIn ? toggleLike : null}
                handleLike={isLoggedIn ? handleLike : null}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
