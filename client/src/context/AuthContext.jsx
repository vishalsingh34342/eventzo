import React, { useState, useEffect } from "react";
export const AuthContext = React.createContext();
import api from "../utils/axios";


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


    // Register
// Register
const register = async (name, email, password) => {
  try {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return data;
  } catch (err) {
    console.error("Register failed", err);
    throw err;
  }
};

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("./auth/login", { email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      console.error("login fail", err);
      throw err;
    }
  };

 
 // Verify OTP
const verifyOtp = async (email, otp) => {
  try {
    const { data } = await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    return data;
  } catch (err) {
    console.error("OTP verification failed", err);
    throw err;
  }
};

  const logout = ()=> {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        verifyOtp,
        loading,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
