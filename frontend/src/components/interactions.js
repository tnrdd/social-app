import React from "react";
import Comment from "./comment";
import LikeIcon from "./like";

function Interactions(props) {
  const { message, handleLike } = props;

  return (
    <div className="interactions">
      <LikeIcon message={message} handleLike={handleLike} />
      <Comment message={message}/>
    </div>
  );
}

export default Interactions;
