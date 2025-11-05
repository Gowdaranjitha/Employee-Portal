import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    // If token exists but user missing, try to fetch /users/me
    if (token && !user) {
      API.get("/users/me")
        .then(res => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          // token invalid -> clear
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    // backend should return { token, user }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    // redirect done by components (window.location)
  };

  const setUserState = (u) => {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser: setUserState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);