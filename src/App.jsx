import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Buku from "./pages/Buku";
import User from "./pages/User";
import RoleManagement from "./pages/RoleManagement";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import "./app.css";
import { PrimeReactProvider } from "primereact/api";

// NOTE:
// - Saya proteksi /buku (butuh login).
// - /user & /users khusus admin super (ubah sesuai kebijakanmu).
// - Hapus import yang tidak dipakai (Navbar, PrimeReactContext) biar bersih.

export default function App() {
  return (
    <PrimeReactProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private (login role apa pun) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buku"
          element={
            <ProtectedRoute>
              <Buku />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <RoleManagement />
            </ProtectedRoute>
          }
        />

        {/* Admin Super only — ganti sesuai kebijakanmu */}
        <Route
          path="/user"
          element={
            <ProtectedRoute roles={["admin super"]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["admin super"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* (Opsional) 404
        <Route path="*" element={<div className="p-4">Halaman tidak ditemukan</div>} />
        */}
      </Routes>
    </PrimeReactProvider>
  );
}
