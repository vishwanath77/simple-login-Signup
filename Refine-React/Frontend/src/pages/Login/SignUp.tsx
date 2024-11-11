

import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react";
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowPConfirmpassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/signup', {
        username,
        email,
        password,
      });

      if (res.data.signup) {
        navigate('/login');
        alert(res.data.message);
      }
      
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Error creating account. Please try again.");
      }
    }
  };

  
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
  };

  const itemVariant = {
    hidden: { x: -50, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.15, duration: 0.8 },
    }),
  };

  const errorVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, x: [0, -10, 10, 0], transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="login-container"
      initial="hidden"
      animate="visible"
      variants={containerVariant}
    >
      <motion.div className="login-card" initial="hidden" animate="visible">
        <div className="login-header">
          <UserPlus className="w-16 h-16 mx-auto text-white" />
          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">Sign up for a new account</p>
        </div>
        <form onSubmit={handleSignup}>
          {["Username", "Email", "Password", "Confirm Password"].map((label, index) => (
            <motion.div
              className="input-group"
              key={label}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariant}
            >
              {label === "Email" ? <Mail className="input-icon" /> : <Lock className="input-icon" />}
              <input
                type={label.toLowerCase().includes("password") ? (label === "Password" ? showPassword ? "text" : "password" : showConfirmPassword ? "text" : "password") : "text"}
                className="input-field"
                placeholder={label}
                value={label === "Username" ? username : label === "Email" ? email : label === "Password" ? password : confirmPassword}
                onChange={(e) => {
                  label === "Username"
                    ? setUsername(e.target.value)
                    : label === "Email"
                    ? setEmail(e.target.value)
                    : label === "Password"
                    ? setPassword(e.target.value)
                    : setConfirmPassword(e.target.value);
                }}
                required
              />
              {label.toLowerCase().includes("password") && (
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    label === "Password"
                      ? setShowPassword(!showPassword)
                      : setShowPConfirmpassword(!showConfirmPassword)
                  }
                  tabIndex={-1}
                  aria-label={
                    label === "Password" ? (showPassword ? "Hide password" : "Show password") : showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {label === "Password" ? (showPassword ? <EyeOff /> : <Eye />) : showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              )}
            </motion.div>
          ))}
          {error && (
            <motion.p className="error-message" initial="hidden" animate="visible" variants={errorVariant}>
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn />
            Sign up
          </motion.button>
          <p style={{ color: "white", textDecoration: "none", fontWeight: "lighter", fontSize: "13px" }}>
            Already have an account? <a style={{ fontSize: "14px", fontWeight: "bold", color: "DodgerBlue", textDecoration: "underline DodgerBlue" }} href="/login">Click here</a> to log in
          </p>
        </form>
        <div className="divider">
          <span className="divider-text">Or continue with</span>
        </div>
        <motion.div className="social-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }}>
          <button className="social-button">Google Account</button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
