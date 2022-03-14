import React, { useState, useEfect } from "react";
import { useNavigate } from "react-router-dom";

function useForm(props) {
  const [errors, setErrors] = useState([]);
  const { formData, setFormData, resource, redirect } = props;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:3000/api/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.ok) {
        navigate(redirect);
      } else {
        Promise.resolve(res.json()).then((result) => {
          setErrors(result.errors);
        });
      }
    });
  };

  return [errors, handleChange, handleSubmit]
}

export default useForm;
