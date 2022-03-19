import React from "react";

import Interactions from "./interactions";
import Username from "./username";
import Avatar from "./avatar";

function Messages(props) {
  const { isLoggedIn, messages, toggleLike, handleLike, username, avatar } = props;

  return (
    <div className="messages">
      {messages.map((message) => {
        return (
          <div className="message-container" key={messages.indexOf(message)}>
            <Avatar avatar={message.user.avatar || avatar} />
            <div className="message">
              <Username username={message.user.username || username} />
              <span className="timestamp">
                {message.createdAt.slice(0, 10)}
              </span>
              <div className="text">{message.text}</div>
              <Interactions
                isLoggedIn={isLoggedIn}
                message={message}
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
