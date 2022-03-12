import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Comments(props) {
  const  navigate  = useNavigate();
  const { postid } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:3000/api/${
        props.isFeed ? "feed/comment" : "comment"
      }?id=${postid}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setComments(json);
        console.log(json);
      });
  }, []);

  return (
    <div className="comments">
      <div className="back">
        <p onClick={() => navigate(-1)}>Back</p>
      </div>
      {comments.map((comment) => {
        return (
          <div className="comment-container" key={comments.indexOf(comment)}>
            <div className="avatar">
              <img
                src={`http://127.0.0.1:3000/avatars/${comment.user.avatar}`}
                alt="avatar"
              />
            </div>
            <div className="comment">
              <div className="username">{comment.user.username}</div>
              <div className="text">{comment.text}</div>
              <div className="interactions">
                <div className="likes">
                  {comment.likes.length > 0 ? comment.likes.length : null}
                </div>
              </div>
              <div className="timestamp">{comment.createdAt.slice(0, 10)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Comments;
