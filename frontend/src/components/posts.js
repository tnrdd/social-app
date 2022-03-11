import React, { useState } from "react";

function Posts(props) {
  const [posts, setPosts] = useState([]);

  React.useEffect(() => {
    fetch("http://127.0.0.1:3000/api/post", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setPosts(json);
      });
  }, []);

  return (
    <div id="posts">
      {posts.map((post) => {
        return (
          <div className="post" key={posts.indexOf(post)}>
            <div className="username">{post.user.username}</div>
            <div className="text">{post.text}</div>
            <div className="interactions">
              <div className="likes">
                {!post.likes
                  ? null
                  : post.likes.length > 0
                  ? post.likes.length
                  : null}
              </div>
              <div className="comments">
                {!post.comments
                  ? null
                  : post.comments.length > 0
                  ? post.comments.length
                  : null}
              </div>
            </div>
            <div className="timestamp">{post.createdAt.slice(0, 10)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Posts;
