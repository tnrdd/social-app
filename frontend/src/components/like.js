import React, { useState, useEffect } from "react";
import useFeed from "../hooks/feed";
import Heart from "../assets/heart.svg";

function Like(props) {
  const {message, handleLike} = props;

  return (
    <div className="likes">
      <div onClick={() => handleLike ? handleLike(message._id) : null}>
        <Heart fill={message.isLiked ? "red" : "none"} />
      </div>
      {message.likes.length > 0 ? message.likes.length : null}
    </div>
  );
}

export default Like;
