import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/form";
import { FiAlertCircle } from "react-icons/fi";
import "../styles/auth.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmation: "",
  });
  const resource = "signup";
  const redirect = "/login";
  const [errors, handleChange, handleSubmit] = useForm({
    formData,
    setFormData,
    resource,
    redirect,
  });

  return (
    <div id="signup">
      {errors.length > 0 ? (
        <div className="validation-errors">
          {errors.map((error) => {
            return (
              <div className="error-message" key={errors.indexOf(error)}>
                <span>
                  <FiAlertCircle />
                </span>
                <span>{error.msg}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      <form id="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmation"
          placeholder="Password confirmation"
          value={formData.confirmation}
          onChange={handleChange}
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
