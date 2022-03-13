import React from "react";
import { useNavigate } from "react-router-dom";
import CommentIcon from "../assets/comment.svg";
import LikeIcon from "./like";

function Interactions(props) {
  const navigate = useNavigate();
  const { message, handleLike } = props;

  return (
    <div className="interactions">
      <LikeIcon message={message} handleLike={handleLike}/>
      <div
        className="comments"
        onClick={() => navigate(`/comment/${message._id}`)}
      >
        <CommentIcon />
        {message.comments.length > 0 ? message.comments.length : null}
      </div>
    </div>
  );
}

export default Interactions;
