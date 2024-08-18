"use client";
import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [activationToken, setActivationToken] = useState("");
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const [isActive, setIsActive] = useState(1);

  // check token
  axios.defaults.headers.common["Authorization"] = auth?.token;

  //
  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parseData?.user,
        token: parseData?.token,
      }));
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        activationToken,
        setActivationToken,
        auth,
        setAuth,
        isActive,
        setIsActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
