import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/form";
import { FiAlertCircle } from "react-icons/fi";
import "../styles/auth.css";

function Login(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const resource = "login";
  const redirect = "/";
  const { setIsLoggedIn } = props;
  const [errors, handleChange, handleSubmit] = useForm({
    setIsLoggedIn,
    formData,
    setFormData,
    resource,
    redirect,
  });

  return (
    <div id="login">
      {errors.length > 0 && (
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
      )}
      <form id="login-form" onSubmit={handleSubmit}>
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
        <button>Log in</button>
      </form>
    </div>
  );
}

export default Login;
