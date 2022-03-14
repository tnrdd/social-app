import React, { useState, useEfect } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/form";

function Message() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: "",
  });
  const resource = "post";
  const redirect = "/";
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
          placeholder="What's on your mind?"
          maxLength="160"
          value={formData.username}
          onChange={handleChange}
        ></textarea>
        <div>        <button>Post</button></div>
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
