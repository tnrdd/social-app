import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";

function Comment(props) {
  const { message } = props;
  const navigate = useNavigate();

  return (
    <div
      className="comments"
      onClick={() => navigate(`/comment/${message._id}`)}
    >
      <span className="comment-icon">
        <FaRegComment />
      </span>
      <span className="comments-count">
        {message.comments.length > 0 ? message.comments.length : null}
      </span>
    </div>
  );
}

export default Comment;
