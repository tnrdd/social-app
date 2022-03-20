import React, { useState } from "react";
import useForm from "../hooks/form";
import "../styles/messages.css";

function Message(props) {
  const { isComment, id, setNewMessage } = props;
  const [formData, setFormData] = useState({
    text: "",
    id: isComment ? id : "",
  });
  const resource = isComment ? "comment" : "post";
  const [errors, handleChange, handleSubmit] = useForm({
    formData,
    setFormData,
    resource,
    setNewMessage,
  });

  return (
    <div className="messages">
      <form className="message-form" onSubmit={handleSubmit}>
        <textarea
          name="text"
          placeholder={isComment ? "Reply" : "What's on your mind?"}
          maxLength="160"
          value={formData.text}
          onChange={handleChange}
        ></textarea>
        <div>
          <button>Post</button>
        </div>
      </form>
      {errors.length > 0 && (
        <div id="validation-errors">
          {errors.map((error) => {
            return <p key={errors.indexOf(error)}>{error.msg}</p>;
          })}
        </div>
      )}
    </div>
  );
}

export default Message;
