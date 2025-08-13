import React, { useContext, useState } from "react";
import { authStyles as style } from "../assets/dummystyle";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Input } from "./Inputs";
import axios from "axios";

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter fullname");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: fullName,
          email,
          password,
        },
        { withCredentials: true }
      );

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error.response.data.message);
      setError(
        error.response?.data?.message ||
          "Something went wrong. please try again"
      );
    }
  };
  return (
    <div className={style.signupContainer}>
      <div className={style.headerWrapper}>
        <h3 className={style.signupTitle}>Create Account</h3>
        <p className={style.signupSubtitle}>
          Join thousands of professionals today
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSignUp} className={style.signupForm}>
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label={"Full Name"}
          placeholder={"John-Doe"}
          type="text"
        />
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
        <button type="submit" className={style.signupSubmit}>
          Create Account
        </button>

        {/* FOOTER */}
        <p className={style.switchText}>
          Already have an account?{" "}
          <button
            type="button"
            className={style.signupSwitchButton}
            onClick={() => setCurrentPage("login")}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
