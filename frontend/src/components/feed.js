import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import useFeed from "../hooks/feed";

import Like from "../assets/heart.svg";
import Message from "../assets/message.svg";

import Comments from "./comments";

function Feed(props) {

  const url = "feed";
  const [{ messages, toggleLike }, handleLike] = useFeed(url);

  const navigate = useNavigate();

  return (
    <div className="posts">
      {messages.map((message) => {
        return (
          <div className="post-container" key={messages.indexOf(message)}>
            <div className="avatar">
              <img
                src={`http://127.0.0.1:3000/avatars/${message.user[0].avatar}`}
                alt="avatar"
              />
              <div className="timestamp">{message.createdAt.slice(0, 10)}</div>
            </div>
            <div className="post">
              <Link to={`/${message.user[0].username}`}>
                {message.user[0].username}
              </Link>
              <div className="text">{message.text}</div>
              <div className="interactions">
                <div className="likes">
                  <div onClick={() => handleLike(message._id)}>
                    <Like fill={message.isLiked ? "red" : "none"} />
                  </div>
                  {message.likes.length > 0 ? message.likes.length : null}
                </div>
                <div
                  className="comments"
                  onClick={() => navigate(`/comment/${message._id}`)}
                >
                  <Message />
                  {message.comments.length > 0 ? message.comments.length : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Feed;
