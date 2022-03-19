import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function useForm(props) {
  const [errors, setErrors] = useState([]);
  const {
    setIsLoggedIn,
    formData,
    setFormData,
    resource,
    redirect,
    setNewMessage,
  } = props;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.BASE_URL}/api/${resource}`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.ok) {
        if (resource === "login") {
          setIsLoggedIn(true);
        }

        const cleared = Object.keys(formData).reduce((accumulator, key) => {
          return { ...accumulator, [key]: "" };
        }, {});
        setFormData(cleared);

        redirect ? navigate(redirect) : null;
        setNewMessage ? setNewMessage({}) : null;
      } else {
        Promise.resolve(res.json()).then((result) => {
          setErrors(result.errors);
        });
      }
    });
  };

  return [errors, handleChange, handleSubmit];
}

export default useForm;
