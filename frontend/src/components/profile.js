import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Comments from "./comments";

function Profile(props) {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetch(`http://127.0.0.1:3000/api/profile?username=${username}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          setProfile({
            following: json.following,
            followers: json.followers,
            avatar: json.avatar,
          });
          setPosts(json.posts);
        }
      });
    return () => (isMounted = false);
  }, []);

  return (
    <div className="posts">
      <div className="profile">
        <div className="avatar">
          <img
            src={`http://127.0.0.1:3000/avatars/${profile.avatar || "default.jpeg"}`}
            alt="avatar"
          />
        </div>
        {username}
        {Array(profile.following).length}
        {Array(profile.followers).length}
      </div>
      {posts.map((post) => {
        return (
          <div className="post-container" key={posts.indexOf(post)}>
            <div className="avatar">
              <img
                src={`http://127.0.0.1:3000/avatars/${profile.avatar|| "default.jpeg"}`}
                alt="avatar"
              />
            </div>
            <div className="post">
              <Link to={`/${username}`}> {username}</Link>
              <div className="text">{post.text}</div>
              <div className="interactions">
                <div className="likes">
                  {post.likes.length > 0 ? post.likes.length : null}
                </div>
                <div
                  className="comments"
                  onClick={() => navigate(`/comment/${post._id}`)}
                >
                  {post.comments.length > 0 ? post.comments.length : null}
                </div>
              </div>
              <div className="timestamp">{post.createdAt.slice(0, 10)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Profile;
