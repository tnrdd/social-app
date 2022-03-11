import React, { useState, useEffect } from "react";

function Comments(props) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:3000/api/${
        props.isFeed ? "feed/comment" : "comment"
      }?id=${props.postId}`,
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
    <div id="comments">
      {comments.map((comment) => {
        return (
          <div className="comment" key={comments.indexOf(comment)}>
            <p onClick={() => props.setCommentsToggle(false)}>Close</p>
            <div className="avatar">
              <img
                src={`http://127.0.0.1:3000/avatars/${comment.user.avatar}`}
                alt="avatar"
              />
            </div>
            <div className="username">{comment.user.username}</div>
            <div className="text">{comment.text}</div>
            <div className="interactions">
              <div className="likes">
                {comment.likes.length > 0 ? comment.likes.length : null}
              </div>
            </div>
            <div className="timestamp">{comment.createdAt.slice(0, 10)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Comments;
