import React, { useContext, useState } from "react";
import { authStyles as style } from "../assets/dummystyle";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Input } from "./Inputs";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. please try again"
      );
    }
  };
  return (
    <div className={style.container}>
      <div className={style.headerWrapper}>
        <h3 className={style.title}>Welcome Back</h3>
        <p className={style.subtitle}>
          Sign in to continue building amazing resumes
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleLogin} className={style.form}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label={"Email"}
          placeholder={"email@example.com"}
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label={"Password"}
          placeholder={"Min 8 characters"}
          type="password"
        />

        {error && <div className={style.errorMessage}>{error}</div>}
        <button type="submit" className={style.submitButton}>
          Sign In
        </button>

        {/* FOOTER */}
        <p className={style.switchText}>
          Don't have an account?{" "}
          <button
            type="button"
            className={style.switchButton}
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
