import React, { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = (children) => {
  const [authUser, setAuthUser] = useState({
    email: null,
    userName: null,
    walletAddress: null,
    balance: null,
  });

  useEffect(() => {
    const authUserData = JSON.parse(localStorage.getItem("authUser"));
    if (authUserData) {
      setAuthUser(authUserData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
  }, [authUser]);

  const changeValue = (property, value) => {
    setAuthUser((prev) => {
      return {
        ...prev,
        [property]: value,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{ authUser, setAuthUser, changeValue }}
      {...children}
    />
  );
};

export { AuthProvider, useAuth };
