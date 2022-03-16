import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Settings(props) {
  const navigate = useNavigate();
  const { username } = useParams();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", file);

    fetch(`${process.env.BASE_URL}/api/avatar`, {
      credentials: "include",
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) {
        navigate(-1);
      } else if (res.status === 401) {
        navigate("/login");
      }
    });
  };

  return (
    <div className="settings">
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Change profile picture</label>
        {preview ? (
          <div className="avatar">
            <img style={{ marginLeft: "20px" }} src={preview}></img>
          </div>
        ) : null}
        <input
          id="file"
          className="file"
          type="file"
          name="file"
          onChange={(e) => {
            setPreview(URL.createObjectURL(e.target.files[0]));
            setFile(e.target.files[0]);
          }}
        />
        <button>Save</button>
      </form>
    </div>
  );
}

export default Settings;
