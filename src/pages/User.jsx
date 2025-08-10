import React, { useContext, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import api from "../api/axios";
import Swal from "sweetalert2";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";

const roleList = [
  { label: "Admin", value: "admin" },
  { label: "Anggota", value: "anggota" },
  { label: "Admin Super", value: "admin super" },
];

export default function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuItems = [
    { icon: "pi pi-home", label: "Dashboard", path: "/dashboard" },
    { icon: "pi pi-book", label: "Buku", path: "/buku" },
    { icon: "pi pi-calendar", label: "Peminjaman", path: "/peminjaman" },
    { icon: "pi pi-user", label: "Akun", path: "/user" },
  ];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (rowData) => {
    // Konfirmasi hapus (SweetAlert2)
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: `Yakin ingin menghapus user "${rowData.nama}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      Swal.showLoading();
      try {
        await api.delete(`/users/${rowData.id}`);
        await getDataUsers();
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus data.",
          icon: "error",
        });
      }
    }
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-sm p-button-text p-button-info"
        aria-label="Edit"
        onClick={() => handleEdit(rowData)}
        tooltip="Edit"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-sm p-button-text p-button-danger"
        aria-label="Delete"
        onClick={() => handleDelete(rowData)}
        tooltip="Hapus"
      />
    </div>
  );

  const [visible, setVisible] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "",
  });

  // State error
  const [errors, setErrors] = useState({});

  // Handler input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleRole = (e) => {
    setForm({ ...form, role: e.value });
    setErrors({ ...errors, role: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "add") {
        await api.post("/users", form);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "User berhasil ditambahkan.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (mode === "edit") {
        // Untuk edit, jangan kirim password jika kosong
        const updateData = { ...form };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/users/${form.id}`, updateData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "User berhasil diperbarui.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setVisible(false);
      setForm({ nama: "", email: "", password: "", role: "" });
      setErrors({}); // Reset errors
      getDataUsers();
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else Swal.fire({ icon: "error", title: "Gagal!", text: "Proses gagal." });
    } finally {
      setLoading(false);
    }
  };

  const [usersList, setUsersList] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const getDataUsers = async () => {
    const res = await api.get("/users");
    setUsersList(res.data);
  };
  useEffect(() => {
    getDataUsers();
  }, []);

  const handleEdit = (rowData) => {
    setMode("edit");
    setForm({
      id: rowData.id,
      nama: rowData.nama,
      email: rowData.email,
      password: "", // Kosongkan password untuk edit
      role: rowData.role, // Langsung ambil dari rowData
    });
    setErrors({}); // Reset errors
    setVisible(true);
  };

  const [mode, setMode] = useState("add");

  // Template untuk menampilkan role dengan badge
  const roleBodyTemplate = (rowData) => {
    const getRoleClass = (role) => {
      switch (role) {
        case "admin":
          return "bg-red-100 text-red-800";
        case "petugas":
          return "bg-blue-100 text-blue-800";
        case "user":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleClass(
          rowData.role
        )}`}
      >
        {rowData.role}
      </span>
    );
  };

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
            className="flex-1 flex flex-column gap-1 mt-1 overflow-auto"
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

      <div className="p-4">
        {/* Tombol tambah data */}
        <div className="flex justify-content-end mb-3">
          <Button
            label="Tambah User"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => {
              setMode("add");
              setForm({
                nama: "",
                email: "",
                password: "",
                role: "",
              });
              setErrors({}); // Reset errors
              setVisible(true);
            }}
          />
        </div>

        {/* Card & DataTable */}
        <Card title="Daftar Users" className="shadow-2 border-round-xl">
          <DataTable
            value={usersList}
            stripedRows
            paginator
            rows={5}
            tableStyle={{ minWidth: "50rem" }}
            className="p-datatable-sm"
          >
            <Column
              header="ID"
              body={(rowData, options) => options.rowIndex + 1}
              style={{ width: "60px" }}
            />
            <Column field="nama" header="Nama" sortable />
            <Column field="email" header="Email" sortable />
            <Column
              field="role"
              header="Role"
              body={roleBodyTemplate}
              sortable
            />
            <Column
              header="Aksi"
              body={actionBodyTemplate}
              style={{ minWidth: "120px", textAlign: "center" }}
            />
          </DataTable>
        </Card>

        <div className="card flex justify-content-center">
          <Dialog
            header={
              <span className="font-bold text-xl text-primary">
                {mode === "add" ? "Tambah User" : "Edit User"}
              </span>
            }
            visible={visible}
            style={{ width: "100%", maxWidth: 560, boxShadow: "none" }}
            onHide={() => setVisible(false)}
            breakpoints={{ "960px": "95vw", "640px": "98vw" }}
            className="p-4"
          >
            <form className="flex flex-column gap-2" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nama" className="font-semibold mb-2 block">
                  Nama
                </label>
                <InputText
                  id="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  autoFocus
                  className={`w-full ${errors.nama ? "p-invalid" : ""}`}
                  placeholder="Masukkan Nama"
                />
                {errors.nama && (
                  <small className="p-error mt-1 block">{errors.nama}</small>
                )}
              </div>
              <div>
                <label htmlFor="email" className="font-semibold mb-2 block">
                  Email
                </label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  className={`w-full ${errors.email ? "p-invalid" : ""}`}
                  placeholder="Masukkan Email"
                />
                {errors.email && (
                  <small className="p-error mt-1 block">{errors.email}</small>
                )}
              </div>
              <div>
                <label htmlFor="password" className="font-semibold mb-2 block">
                  Password{" "}
                  {mode === "edit" && (
                    <small className="text-400">
                      (kosongkan jika tidak diubah)
                    </small>
                  )}
                </label>
                <Password
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={mode === "add"}
                  className={`w-full ${errors.password ? "p-invalid" : ""}`}
                  placeholder="Masukkan Password"
                  toggleMask
                  feedback={false}
                />
                {errors.password && (
                  <small className="p-error mt-1 block">
                    {errors.password}
                  </small>
                )}
              </div>
              <div>
                <label htmlFor="role" className="font-semibold mb-2 block">
                  Role
                </label>
                <Dropdown
                  id="role"
                  name="role"
                  value={form.role}
                  options={roleList}
                  onChange={handleRole}
                  placeholder="Pilih role..."
                  className={`w-full ${errors.role ? "p-invalid" : ""}`}
                  required
                  showClear
                />
                {errors.role && (
                  <small className="p-error mt-1 block">{errors.role}</small>
                )}
              </div>
              <div className="flex justify-content-end gap-2 mt-2">
                <Button
                  label="Batal"
                  icon="pi pi-times"
                  type="button"
                  className="p-button-outlined p-button-secondary"
                  onClick={() => {
                    setVisible(false);
                    setErrors({}); // Reset errors saat cancel
                  }}
                  disabled={loading}
                />
                <Button
                  label="Simpan"
                  icon="pi pi-check"
                  type="submit"
                  className="p-button-primary"
                  loading={loading}
                />
              </div>
            </form>
          </Dialog>
        </div>

        {/* Style tambahan untuk rapi */}
        <style>{`
        .shadow-2 { box-shadow: 0 2px 12px 0 rgba(44,62,80,.12); }
        .border-round-xl { border-radius: 1.2rem; }
        .p-datatable-sm .p-datatable-tbody > tr > td { padding: 0.75rem 1rem; }
        .p-datatable .p-datatable-header { background: #fff; }
        .p-card { background: #fff; }
        .p-card .p-card-title { font-size: 1.25rem; font-weight: bold; color: #6c63ff; }
        .bg-red-100 { background-color: #fee2e2; }
        .text-red-800 { color: #991b1b; }
        .bg-blue-100 { background-color: #dbeafe; }
        .text-blue-800 { color: #1e40af; }
        .bg-green-100 { background-color: #dcfce7; }
        .text-green-800 { color: #166534; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .text-gray-800 { color: #1f2937; }
        .text-400 { color: #9ca3af; }
      `}</style>
      </div>
    </div>
  );
}
