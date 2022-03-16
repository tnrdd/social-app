import React from "react";
import Comment from "./comment";
import LikeIcon from "./like";

function Interactions(props) {
  const { isLoggedIn, message, handleLike } = props;

  return (
    <div className="interactions">
      <LikeIcon message={message} handleLike={handleLike} />
      <Comment isLoggedIn={isLoggedIn} message={message} />
    </div>
  );
}

export default Interactions;
