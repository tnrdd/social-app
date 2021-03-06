import React from "react";
import Comment from "./comment";
import Like from "./like";

function Interactions(props) {
  const { isLoggedIn, message, handleLike } = props;

  return (
    <div className="interactions">
      <Like message={message} handleLike={handleLike} />
      <Comment isLoggedIn={isLoggedIn} message={message} />
    </div>
  );
}

export default Interactions;
