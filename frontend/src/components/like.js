import React, { useState, useEffect } from "react";
import useFeed from "../hooks/feed";
import { FiHeart } from "react-icons/fi";

function Like(props) {
  const { message, handleLike } = props;

  return (
    <div onClick={() => (handleLike ? handleLike(message._id) : null)} className="likes">
        <FiHeart size={17} fill={message.isLiked ? "red" : "none"} />
      <span className="likes-count" >{message.likes.length > 0 ? message.likes.length : null}</span>
    </div>
  );
}

export default Like;
