import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (password !== confirm) {
      setErrorMsg("Password tidak sama.");
      return;
    }
    setLoading(true);
    try {
      // Lakukan proses register di sini (API, Context, dsb)
      // await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setErrorMsg("Gagal register, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-100">
      <div className="card p-0 shadow-4 border-round-xl w-full max-w-lg bg-white">
        <div className="flex flex-column align-items-center py-5 px-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            alt="Register"
            style={{ width: 72, marginBottom: 12 }}
          />
          <h2 className="font-bold text-3xl mb-2 text-primary">
            Buat Akun Admin
          </h2>
          <form
            className="w-full flex flex-column gap-3 mt-2"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-column gap-1">
              <label htmlFor="name" className="font-semibold text-sm">
                Nama Lengkap
              </label>
              <InputText
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                placeholder="Masukkan nama"
                autoComplete="name"
                required
              />
            </div>
            <div className="flex flex-column gap-1">
              <label htmlFor="email" className="font-semibold text-sm">
                Email
              </label>
              <InputText
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                type="email"
                placeholder="Masukkan email"
                autoComplete="email"
                required
              />
            </div>
            <div className="flex flex-column gap-1">
              <label htmlFor="password" className="font-semibold text-sm">
                Password
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="Masukkan password"
                toggleMask
                feedback={false}
                required
              />
            </div>
            <div className="flex flex-column gap-1">
              <label htmlFor="confirm" className="font-semibold text-sm">
                Konfirmasi Password
              </label>
              <Password
                id="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full"
                placeholder="Ulangi password"
                toggleMask
                feedback={false}
                required
              />
            </div>
            {errorMsg && <small className="text-red-500">{errorMsg}</small>}

            <Button
              label={loading ? "Registering..." : "Register"}
              icon="pi pi-user-plus"
              className="w-full bg-primary border-0 text-white font-semibold border-round-lg shadow-2 mt-2"
              type="submit"
              loading={loading}
            />
            <small className="mt-1 text-center text-600">
              Sudah punya akun?{" "}
              <span
                className="cursor-pointer text-primary"
                onClick={() => navigate("/login")}
              >
                Login di sini
              </span>
            </small>
          </form>
        </div>
      </div>
      <style>{`
        .bg-gradient-to-tr {
          background: linear-gradient(135deg, #e3f0ff 10%, #f3e8ff 60%, #e0e7ff 100%);
        }
        .text-primary {
          color: #6c63ff;
        }
        .text-red-500 {
          color: #f44336;
        }
      `}</style>
    </div>
  );
}
