import React from "react";
import CommentIcon from "../assets/comment.svg";

function Comment(props) {
  const {message} = props;

  return (
    <div className="comments"
        onClick={() =>
          message.comments.length > 0
            ? navigate(`/comment/${message._id}`)
            : null
      }>
        <CommentIcon />
        {message.comments.length > 0 ? message.comments.length : null}
    </div>
  );
}

export default Comment;
