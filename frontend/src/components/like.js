import React, { useState, useEffect } from "react";
import useFeed from "../hooks/feed";
import { FiHeart } from "react-icons/fi";

function Like(props) {
  const { message, handleLike } = props;

  return (
    <div
      onClick={() => (handleLike ? handleLike(message._id) : null)}
      className="likes"
    >
      <span className="like-icon">
        {" "}
        <FiHeart size={17} fill={message.isLiked ? "#ff5a5f" : "none"}color={message.isLiked ? "#ff5a5f" : null} />
      </span>
      <span className="likes-count">
        {message.likes.length > 0 ? message.likes.length : null}
      </span>
    </div>
  );
}

export default Like;
