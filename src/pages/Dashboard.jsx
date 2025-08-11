import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { icon: "pi pi-home", label: "Dashboard", path: "/dashboard" },
    { icon: "pi pi-book", label: "Buku", path: "/buku" },
    { icon: "pi pi-calendar", label: "Peminjaman", path: "/peminjaman" },
    ...(user?.role === "admin super"
      ? [{ icon: "pi pi-user", label: "Akun", path: "/user" }]
      : []),
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-100"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex align-items-center justify-content-between px-4 py-3 bg-white shadow-2"
        style={{ position: "sticky", top: 0, zIndex: 10 }}
      >
        <div className="flex align-items-center gap-3">
          <Button
            icon="pi pi-bars"
            className="p-button-text p-button-rounded"
            onClick={() => setSidebarVisible(true)}
            aria-label="Open Sidebar"
          />
          <span className="font-bold text-xl text-primary">Perpustakaan</span>
        </div>
        <div className="flex align-items-center gap-4">
          <Button
            icon="pi pi-bell"
            className="p-button-text p-button-rounded"
            aria-label="Notifications"
          />
          <Avatar
            image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
            shape="circle"
            size="large"
          />
        </div>
      </header>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="p-sidebar"
      >
        <div className="flex flex-column h-full" style={{ height: "100%" }}>
          <nav
            className="flex-1 flex flex-column gap-1 mt-4 overflow-auto"
            aria-label="Sidebar Menu"
          >
            {menuItems.map((item, idx) => (
              <Button
                key={idx}
                label={item.label}
                icon={item.icon}
                className="p-button-text p-button text-left font-semibold text-700"
                style={{ width: "100%" }}
                aria-label={item.label}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                    setSidebarVisible(false);
                  }
                }}
              />
            ))}
          </nav>
          <Button
            label="Log Out"
            icon="pi pi-sign-out"
            className="p-button-danger p-button mt-auto"
            style={{ width: "100%" }}
            aria-label="Log Out"
            onClick={logout}
          />
        </div>
      </Sidebar>

      {/* Main Content */}
      <main className="p-4">
        {/* Stat Cards */}
        <section className="grid grid-nogutter gap-4 mb-4">
          {[
            {
              title: "Total Buku",
              value: "2,350",
              info: "+35 buku baru",
              infoClass: "text-green-500",
            },
            {
              title: "Anggota",
              value: "1,200",
              info: "+10 pendaftar",
              infoClass: "text-green-500",
            },
            {
              title: "Peminjaman Aktif",
              value: "87",
              info: "3 overdue",
              infoClass: "text-orange-500",
            },
            {
              title: "Kunjungan Hari Ini",
              value: "54",
              info: "Ramai!",
              infoClass: "text-green-500",
            },
          ].map((card, idx) => (
            <div className="col-12 md:col-3" key={idx}>
              <div className="bg-white shadow-2 border-round-xl p-4 flex flex-column align-items-start h-full">
                <span className="font-medium text-700 mb-2">{card.title}</span>
                <span className="font-bold text-3xl text-primary">
                  {card.value}
                </span>
                <span className={`${card.infoClass} mt-1 text-sm`}>
                  {card.info}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Grafik dan Tabel */}
        <section className="grid grid-nogutter gap-4">
          <div className="col-12 md:col-7 bg-white shadow-2 border-round-xl p-4">
            <h3 className="font-bold text-xl mb-4 text-primary">
              Statistik Kunjungan & Peminjaman
            </h3>
            {/* Tambahkan Chart di sini jika diperlukan */}
          </div>
          <div className="col-12 md:col-5 bg-white shadow-2 border-round-xl p-4">
            <h3 className="font-bold text-xl mb-4 text-primary">
              Peminjaman Terbaru
            </h3>
            <table className="w-full">
              <thead>
                <tr className="text-left border-bottom-1 border-gray-200">
                  <th>Buku</th>
                  <th>Anggota</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Buku Pemrograman</td>
                  <td>Amy Elsner</td>
                  <td>09/08/2025</td>
                  <td>
                    <span className="text-green-500 font-medium">Aktif</span>
                  </td>
                </tr>
                <tr>
                  <td>Matematika Dasar</td>
                  <td>John Doe</td>
                  <td>09/08/2025</td>
                  <td>
                    <span className="text-orange-500 font-medium">Overdue</span>
                  </td>
                </tr>
                <tr>
                  <td>Sains Modern</td>
                  <td>Jane Smith</td>
                  <td>08/08/2025</td>
                  <td>
                    <span className="text-green-500 font-medium">Aktif</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Notifikasi */}
        <section className="bg-white shadow-2 border-round-xl p-4 mt-4">
          <h3 className="font-bold text-xl mb-2 text-primary">Notifikasi</h3>
          <ul className="list-none p-0 m-0">
            <li className="mb-2">
              Buku <strong>Matematika Dasar</strong> sudah lewat masa
              peminjaman!
            </li>
            <li className="mb-2">
              10 Anggota baru telah terdaftar minggu ini.
            </li>
          </ul>
        </section>
      </main>

      {/* Style */}
      <style>{`
        .text-primary { color: #6c63ff }
        .shadow-2 { box-shadow: 0 2px 12px 0 rgba(44,62,80,.12); }
        .border-round-xl { border-radius: 1.2rem; }
        .bg-gradient-to-tr {
          background: linear-gradient(135deg, #e3f0ff 10%, #f3e8ff 60%, #e0e7ff 100%);
        }
        .grid { display: flex; flex-wrap: wrap; gap: 1rem; }
        .col-12 { width: 100%; }
        @media (min-width: 768px) {
          .md\\:col-3 { width: 24%; }
          .md\\:col-5 { width: 41%; }
          .md\\:col-7 { width: 57%; }
        }
      `}</style>
    </div>
  );
}
