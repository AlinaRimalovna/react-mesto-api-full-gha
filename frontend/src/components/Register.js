import Auth from "./Auth";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as UserAuth from "../utils/UserAuth.js"

function Register({ onRegister }) {
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(" ");
  const navigate = useNavigate();
  const { email, password } = formValue;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password);
  }
  return (
    <Auth 
      name="register"
      title="Регистрация"
      button="Зарегистрироваться"
      onSubmit={handleSubmit}
      onChange={handleChange}
      email={formValue.email}
      password={formValue.password}
      error={error}
    >
      <div className="auth__signin">
        <p>Уже зарегистрированы? </p>
        <Link to="/sign-in" className="auth__link">Войти</Link>
      </div>
    </Auth>
  );
}

export default Register;