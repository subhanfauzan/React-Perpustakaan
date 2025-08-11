import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  }, []);

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });

    // backend kamu kirim 'access_token' (fallback ke 'token' jika beda)
    const token = res.data.access_token || res.data.token;
    const u = res.data.user;

    if (!token) throw new Error("Token tidak ditemukan di response /login");

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(u);

    if (u.role === "admin super") navigate("/user");
    else if (u.role === "admin") navigate("/buku");
    else navigate("/dashboard");

    return u;
  };

  const logout = () => {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
