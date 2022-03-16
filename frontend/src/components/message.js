import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/form";
import "../styles/messages.css";

function Message(props) {
  const navigate = useNavigate();
  const { isComment, id } = props;
  const [formData, setFormData] = useState({
    text: "",
    id: isComment ? id : "",
  });
  const resource = isComment ? "comment" : "post";
  const redirect = isComment ? -1 : "/";
  const [errors, handleChange, handleSubmit] = useForm({
    formData,
    setFormData,
    resource,
    redirect,
  });

  return (
    <div className="new-message">
      <form className="message-form" onSubmit={handleSubmit}>
        <textarea
          name="text"
          placeholder={isComment ? "Reply" : "What's on your mind?"}
          maxLength="160"
          value={formData.username}
          onChange={handleChange}
        ></textarea>
        <div>
          <button>Post</button>
        </div>
      </form>
      {errors.length > 0 ? (
        <div id="validation-errors">
          {errors.map((error) => {
            return <p key={errors.indexOf(error)}>{error.msg}</p>;
          })}
        </div>
      ) : null}
    </div>
  );
}

export default Message;
