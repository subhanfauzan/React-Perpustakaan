import React from "react";
import { Button } from "primereact/button";

export default function LandingPage() {
  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-100">
      <div className="card shadow-4 border-round-xl p-5 flex flex-column align-items-center w-full max-w-lg bg-white">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2965/2965358.png"
          alt="Library Illustration"
          style={{ width: 120, marginBottom: 24 }}
        />
        <h1 className="font-bold text-4xl mb-2 text-primary">
          Perpustakaan Digital
        </h1>
        <p className="mb-4 text-600 text-center" style={{ fontSize: "1.1rem" }}>
          Selamat datang di sistem admin perpustakaan.
          <br />
          Kelola koleksi buku, anggota, dan peminjaman dengan mudah!
        </p>
        <div className="flex gap-3">
          <Button
            label="Login Admin"
            icon="pi pi-sign-in"
            className="bg-primary border-0 text-white font-semibold border-round-lg shadow-2"
            onClick={() => (window.location.href = "/login")}
          />
          <Button
            label="Dashboard"
            icon="pi pi-home"
            severity="info"
            className="border-round-lg"
            onClick={() => (window.location.href = "/dashboard")}
          />
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
