import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password); // navigasi akan di-handle oleh AuthContext
    } catch (err) {
      alert(err?.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-100"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="card p-0 shadow-4 border-round-xl w-full max-w-md bg-white">
        <div className="flex flex-column align-items-center gap-4 py-6 px-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Login"
            style={{ width: 70, marginBottom: 10 }}
          />
          <h2 className="font-bold text-3xl mb-3 text-primary">
            Welcome Back!
          </h2>
          <form className="w-full flex flex-column gap-3" onSubmit={submit}>
            <div className="flex flex-column gap-1">
              <label htmlFor="email" className="font-semibold text-sm">
                Email
              </label>
              <InputText
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="w-full"
                placeholder="Enter your email"
                autoComplete="username"
                required
              />
            </div>
            <div className="flex flex-column gap-1">
              <label htmlFor="password" className="font-semibold text-sm">
                Password
              </label>
              <InputText
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button
              label={loading ? "Logging in..." : "Login"}
              icon="pi pi-sign-in"
              className="w-full bg-primary border-0 text-white font-semibold border-round-lg shadow-2"
              type="submit"
              loading={loading}
              style={{ transition: "background 0.2s" }}
            />
          </form>
          <small className="mt-2 text-center text-600">
            Kembali Ke Catalog?{" "}
            <span
              className="cursor-pointer text-primary"
              onClick={() => navigate("/")}
              style={{ textDecoration: "underline" }}
            >
              Klik di sini!
            </span>
          </small>
        </div>
      </div>
      <style>{`
        .bg-gradient-to-tr {
          background: linear-gradient(135deg, #e3f0ff 10%, #f3e8ff 60%, #e0e7ff 100%);
        }
        .text-primary {
          color: #6c63ff;
        }
      `}</style>
    </div>
  );
}
