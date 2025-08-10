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

const kategoriList = [
  { label: "Novel", value: "Novel" },
  { label: "Komik", value: "Komik" },
  { label: "Ensiklopedia", value: "Ensiklopedia" },
  { label: "Biografi", value: "Biografi" },
  { label: "Lainnya", value: "Lainnya" },
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
  const [buku, setBuku] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    api
      .get("/buku")
      .then((res) => setBuku(res.data)) // sesuaikan jika respons API kamu berbeda
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const handleDelete = async (rowData) => {
    // Konfirmasi hapus (SweetAlert2)
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: `Yakin ingin menghapus "${rowData.judul}"?`,
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
        await api.delete(`/buku/${rowData.id}`);
        await getDataBuku();
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
    judul: "",
    penulis: "",
    tahun: "",
    kategori: "",
    stok: "",
  });
  // State error
  const [errors, setErrors] = useState({});

  // Handler input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleKategori = (e) => {
    setForm({ ...form, kategori: e.value });
    setErrors({ ...errors, kategori: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "add") {
        await api.post("/buku", {
          ...form,
          tahun: Number(form.tahun),
          stok: Number(form.stok),
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil ditambahkan.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (mode === "edit") {
        await api.put(`/buku/${form.id}`, {
          ...form,
          tahun: Number(form.tahun),
          stok: Number(form.stok),
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil diperbarui.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setVisible(false);
      setForm({ judul: "", penulis: "", tahun: "", kategori: "", stok: "" });
      getDataBuku();
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else Swal.fire({ icon: "error", title: "Gagal!", text: "Proses gagal." });
    } finally {
      setLoading(false);
    }
  };

  const [bukuList, setBukuList] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const getDataBuku = async () => {
    const res = await api.get("/buku");
    setBukuList(res.data); // pastikan data response sesuai
  };
  useEffect(() => {
    getDataBuku();
  }, []);

  const handleEdit = (rowData) => {
    setMode("edit");
    setForm({
      id: rowData.id,
      judul: rowData.judul,
      penulis: rowData.penulis,
      tahun: rowData.tahun,
      kategori:
        kategoriList.find((k) => k.value === rowData.kategori)?.value || "",
      stok: rowData.stok,
    });
    setVisible(true);
  };

  const [mode, setMode] = useState("add");

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
            label="Tambah Data"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => {
              setMode("add");
              setForm({
                judul: "",
                penulis: "",
                tahun: "",
                kategori: "",
                stok: "",
              });
              setVisible(true);
            }}
          />
        </div>

        {/* Card & DataTable */}
        <Card title="Daftar Buku" className="shadow-2 border-round-xl">
          <DataTable
            value={bukuList}
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
            <Column field="judul" header="Judul" sortable />
            <Column field="penulis" header="Penulis" sortable />
            <Column field="tahun" header="Tahun" sortable />
            <Column field="kategori" header="Kategori" sortable />
            <Column field="stok" header="Stok" sortable />
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
                Tambah Buku
              </span>
            }
            visible={visible}
            style={{ width: "100%", maxWidth: 560, boxShadow: "none" }}
            onHide={() => setVisible(false)}
            breakpoints={{ "960px": "95vw", "640px": "98vw" }}
            className="p-4"
            onInsert={getDataBuku}
          >
            <form className="flex flex-column gap-2" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="judul" className="font-semibold mb-2 block">
                  Judul
                </label>
                <InputText
                  id="judul"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  autoFocus
                  className={`w-full ${errors.judul ? "p-invalid" : ""}`}
                  placeholder="Masukkan Judul"
                />
                {errors.judul && (
                  <small className="p-error mt-1 block">{errors.judul}</small>
                )}
              </div>
              <div>
                <label htmlFor="penulis" className="font-semibold mb-2 block">
                  Penulis
                </label>
                <InputText
                  id="penulis"
                  name="penulis"
                  value={form.penulis}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  className={`w-full ${errors.penulis ? "p-invalid" : ""}`}
                  placeholder="Masukkan Penulis"
                />
                {errors.penulis && (
                  <small className="p-error mt-1 block">{errors.penulis}</small>
                )}
              </div>
              <div>
                <label htmlFor="tahun" className="font-semibold mb-2 block">
                  Tahun
                </label>
                <InputText
                  id="tahun"
                  name="tahun"
                  value={form.tahun}
                  onChange={handleChange}
                  keyfilter="int"
                  maxLength={4}
                  required
                  className={`w-full ${errors.tahun ? "p-invalid" : ""}`}
                  placeholder="Masukkan Tahun"
                />
                {errors.tahun && (
                  <small className="p-error mt-1 block">{errors.tahun}</small>
                )}
              </div>
              <div>
                <label htmlFor="kategori" className="font-semibold mb-2 block">
                  Kategori
                </label>
                <Dropdown
                  id="kategori"
                  name="kategori"
                  value={form.kategori}
                  options={kategoriList}
                  onChange={handleKategori}
                  placeholder="Pilih kategori..."
                  className={`w-full ${errors.kategori ? "p-invalid" : ""}`}
                  required
                  showClear
                />
                {errors.kategori && (
                  <small className="p-error mt-1 block">
                    {errors.kategori}
                  </small>
                )}
              </div>
              <div>
                <label htmlFor="stok" className="font-semibold mb-2 block">
                  Stok
                </label>
                <InputText
                  id="stok"
                  name="stok"
                  value={form.stok}
                  onChange={handleChange}
                  keyfilter="int"
                  required
                  className={`w-full ${errors.stok ? "p-invalid" : ""}`}
                  placeholder="Masukkan Stok"
                />
                {errors.stok && (
                  <small className="p-error mt-1 block">{errors.stok}</small>
                )}
              </div>
              <div className="flex justify-content-end gap-2 mt-2">
                <Button
                  label="Batal"
                  icon="pi pi-times"
                  type="button"
                  className="p-button-outlined p-button-secondary"
                  onClick={() => setVisible(false)}
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

        <div className="card flex justify-content-center">
          <Dialog
            header={
              <span className="font-bold text-xl text-primary">
                {mode === "add" ? "Tambah Buku" : "Edit Buku"}
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
                <label htmlFor="judul" className="font-semibold mb-2 block">
                  Judul
                </label>
                <InputText
                  id="judul"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  maxLength={150}
                  required
                  autoFocus
                  className={`w-full ${errors.judul ? "p-invalid" : ""}`}
                  placeholder="Masukkan Judul"
                />
                {errors.judul && (
                  <small className="p-error mt-1 block">{errors.judul}</small>
                )}
              </div>
              <div>
                <label htmlFor="penulis" className="font-semibold mb-2 block">
                  Penulis
                </label>
                <InputText
                  id="penulis"
                  name="penulis"
                  value={form.penulis}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  className={`w-full ${errors.penulis ? "p-invalid" : ""}`}
                  placeholder="Masukkan Penulis"
                />
                {errors.penulis && (
                  <small className="p-error mt-1 block">{errors.penulis}</small>
                )}
              </div>
              <div>
                <label htmlFor="tahun" className="font-semibold mb-2 block">
                  Tahun
                </label>
                <InputText
                  id="tahun"
                  name="tahun"
                  value={form.tahun}
                  onChange={handleChange}
                  keyfilter="int"
                  maxLength={4}
                  required
                  className={`w-full ${errors.tahun ? "p-invalid" : ""}`}
                  placeholder="Masukkan Tahun"
                />
                {errors.tahun && (
                  <small className="p-error mt-1 block">{errors.tahun}</small>
                )}
              </div>
              <div>
                <label htmlFor="kategori" className="font-semibold mb-2 block">
                  Kategori
                </label>
                <Dropdown
                  id="kategori"
                  name="kategori"
                  value={form.kategori}
                  options={kategoriList}
                  onChange={handleKategori}
                  placeholder="Pilih kategori..."
                  className={`w-full ${errors.kategori ? "p-invalid" : ""}`}
                  required
                  showClear
                />
                {errors.kategori && (
                  <small className="p-error mt-1 block">
                    {errors.kategori}
                  </small>
                )}
              </div>
              <div>
                <label htmlFor="stok" className="font-semibold mb-2 block">
                  Stok
                </label>
                <InputText
                  id="stok"
                  name="stok"
                  value={form.stok}
                  onChange={handleChange}
                  keyfilter="int"
                  required
                  className={`w-full ${errors.stok ? "p-invalid" : ""}`}
                  placeholder="Masukkan Stok"
                />
                {errors.stok && (
                  <small className="p-error mt-1 block">{errors.stok}</small>
                )}
              </div>
              <div className="flex justify-content-end gap-2 mt-2">
                <Button
                  label="Batal"
                  icon="pi pi-times"
                  type="button"
                  className="p-button-outlined p-button-secondary"
                  onClick={() => setVisible(false)}
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
      `}</style>
      </div>
    </div>
  );
}
