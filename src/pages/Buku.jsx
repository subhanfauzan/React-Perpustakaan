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
import { InputTextarea } from "primereact/inputtextarea";

const kategoriList = [
  { label: "Novel", value: "Novel" },
  { label: "Komik", value: "Komik" },
  { label: "Ensiklopedia", value: "Ensiklopedia" },
  { label: "Biografi", value: "Biografi" },
  { label: "Lainnya", value: "Lainnya" },
];

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

  const [loading, setLoading] = useState(false);

  const refreshAuditIfOpen = async (bukuId) => {
    if (auditVisible && auditBook?.id === bukuId) {
      await fetchAudit(1, bukuId);
    }
  };

  const handleDelete = async (rowData) => {
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

        // PERBAIKAN: Tutup dialog audit jika buku yang dihapus sedang ditampilkan
        if (auditVisible && auditBook?.id === rowData.id) {
          setAuditVisible(false);
          setAuditBook(null);
          setAuditItems([]);
        }

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
      <Button
        icon="pi pi-history"
        className="p-button-sm p-button-text"
        aria-label="Riwayat"
        onClick={() => openAudit(rowData)}
        tooltip="Riwayat"
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
    deskripsi: "",
  });

  const [errors, setErrors] = useState({});

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

        // PERBAIKAN: Refresh audit data jika dialog audit sedang terbuka dan untuk buku yang sama
        if (auditVisible && auditBook?.id === form.id) {
          await fetchAudit(1, form.id); // refresh audit data
        }
      }

      setVisible(false);
      setForm({
        judul: "",
        penulis: "",
        tahun: "",
        kategori: "",
        stok: "",
        deskripsi: "",
      });
      await getDataBuku(); // Gunakan await untuk memastikan data terupdate
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else Swal.fire({ icon: "error", title: "Gagal!", text: "Proses gagal." });
    } finally {
      setLoading(false);
    }
  };

  const [bukuList, setBukuList] = useState([]);

  const getDataBuku = async () => {
    const res = await api.get("/buku");
    setBukuList(res.data);
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
      deskripsi: rowData.deskripsi || "",
    });
    setVisible(true);
  };

  const [mode, setMode] = useState("add");

  const short = (t, n = 80) => (t?.length > n ? t.slice(0, n) + "…" : t || "-");

  // + tambahkan state untuk audit
  const [auditVisible, setAuditVisible] = useState(false);
  const [auditBook, setAuditBook] = useState(null);
  const [auditItems, setAuditItems] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState({ page: 1, rows: 10, total: 0 });

  // + helper format & diff
  const formatVal = (v) =>
    v === null || v === undefined
      ? "—"
      : typeof v === "object"
      ? JSON.stringify(v)
      : String(v);

  const diffTemplate = (row) => {
    const oldVals = row.old_values || {};
    const newVals = row.new_values || {};
    if (row.event === "created")
      return <span className="text-500">Nilai awal dibuat.</span>;
    if (row.event === "deleted")
      return <span className="text-500">Data dihapus.</span>;
    const keys = Array.from(
      new Set([...Object.keys(oldVals), ...Object.keys(newVals)])
    );
    return (
      <div className="flex flex-column gap-1">
        {keys.map((k) => {
          if (["id", "created_at", "updated_at"].includes(k)) return null;
          const before = oldVals[k];
          const after = newVals[k];
          if (JSON.stringify(before) === JSON.stringify(after)) return null;
          return (
            <div key={k} className="text-sm">
              <span className="font-medium text-700">{k}</span>
              <span className="mx-2 text-500">:</span>
              <span className="line-through text-500 break-all">
                {formatVal(before)}
              </span>
              <span className="mx-2">→</span>
              <span className="font-semibold break-all">
                {formatVal(after)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const openAudit = async (row) => {
    console.log("openAudit: Starting for book:", row.id);

    // Check auth status first
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Silakan login kembali untuk melihat audit.",
      });
      return;
    }

    setAuditLoading(true);
    try {
      const { data } = await api.get(`/buku/${row.id}`);
      const bukuData = data.data || data;
      setAuditBook(bukuData);
      setAuditVisible(true);

      // Reset audit state sebelum fetch data baru
      setAuditItems([]);
      setAuditPage({ page: 1, rows: 10, total: 0 });

      await fetchAudit(1, row.id);
    } catch (error) {
      console.error("openAudit: Error fetching book details:", error);
      setAuditBook(row); // fallback
      setAuditVisible(true);
      setAuditItems([]);
      await fetchAudit(1, row.id);
    } finally {
      setAuditLoading(false);
    }
  };

  const fetchAudit = async (page = 1, id = auditBook?.id) => {
    if (!id) {
      console.log("fetchAudit: No ID provided");
      return;
    }

    console.log("fetchAudit: Starting fetch for ID:", id, "Page:", page);
    setAuditLoading(true);

    try {
      // DEBUGGING: Log request details
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("fetchAudit: Token exists:", !!token);
      console.log("fetchAudit: Request URL:", `/buku/${id}/audits`);

      const { data } = await api.get(`/buku/${id}/audits`, {
        params: {
          page,
          per_page: auditPage.rows || 10,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Eksplisit tambahkan token
        },
      });

      console.log("fetchAudit: Response received:", data);

      // Handle 2 kemungkinan bentuk response
      const payload = Array.isArray(data?.data) ? data : data?.data ?? data;

      const auditData = payload?.data ?? [];
      console.log("fetchAudit: Processed audit data:", auditData);

      setAuditItems(auditData);
      setAuditPage({
        page: payload?.current_page ?? 1,
        rows: payload?.per_page ?? 10,
        total: payload?.total ?? auditData.length,
      });

      console.log("fetchAudit: State updated successfully");
    } catch (e) {
      console.error("fetchAudit: Error details:", {
        message: e.message,
        status: e.response?.status,
        data: e.response?.data,
        headers: e.response?.headers,
      });

      if (e.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Silakan login kembali.",
          confirmButtonText: "OK",
        }).then(() => {
          // Redirect to login atau logout
          if (typeof logout === "function") {
            logout();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Gagal memuat data audit: ${
            e.response?.data?.message || e.message
          }`,
          timer: 3000,
          showConfirmButton: false,
        });
      }

      setAuditItems([]);
      setAuditPage({ page: 1, rows: 10, total: 0 });
    } finally {
      setAuditLoading(false);
    }
  };

  // ganti fungsi lama
  const checkAuthStatus = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return false;

    try {
      // token otomatis ikut via interceptor
      const res = await api.get("/user");
      console.log("Auth check OK:", res.data);
      return true;
    } catch (error) {
      console.log(
        "Auth check failed:",
        error.response?.status,
        error.response?.data
      );
      return false;
    }
  };

  const onAuditPage = (e) => {
    const next = e.first / e.rows + 1;
    fetchAudit(next);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-100"
      style={{ fontFamily: "Inter, Arial, sans-serif" }}
    >
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
                deskripsi: "",
              });
              setVisible(true);
            }}
          />
        </div>

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
            <Column header="Deskripsi" body={(row) => short(row.deskripsi)} />
            <Column
              header="Aksi"
              body={actionBodyTemplate}
              style={{ minWidth: "120px", textAlign: "center" }}
            />
          </DataTable>
        </Card>

        <Dialog
          header={
            <span className="font-bold text-xl text-primary">
              Riwayat Perubahan — {auditBook?.judul}
            </span>
          }
          visible={auditVisible}
          style={{ width: "100%", maxWidth: 800, boxShadow: "none" }} // ← tambahkan ini
          onHide={() => setAuditVisible(false)}
          breakpoints={{ "960px": "95vw", "640px": "98vw" }}
          className="p-4"
        >
          <DataTable
            value={auditItems}
            loading={auditLoading}
            paginator
            rows={auditPage.rows}
            totalRecords={auditPage.total}
            first={(auditPage.page - 1) * auditPage.rows}
            onPage={onAuditPage}
            responsiveLayout="scroll"
            emptyMessage="Belum ada audit untuk buku ini."
            className="p-datatable-sm"
          >
            <Column
              header="Waktu"
              body={(row) => {
                const d = new Date(row.created_at);
                return (
                  <div className="flex flex-column">
                    <span className="font-medium">
                      {d.toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              }}
              style={{ width: "16rem" }}
            />
            <Column
              header="User"
              body={(row) =>
                row.user ? (
                  <div className="flex flex-column">
                    <span className="font-medium">{row.user.nama}</span>
                    <span className="text-500 text-sm">{row.user.email}</span>
                  </div>
                ) : (
                  <span className="text-500 italic">system</span>
                )
              }
              style={{ width: "16rem" }}
            />
            <Column header="Event" field="event" style={{ width: "8rem" }} />
            <Column header="Perubahan" body={diffTemplate} />
          </DataTable>
        </Dialog>

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

              <div>
                <label htmlFor="deskripsi" className="font-semibold mb-2 block">
                  Deskripsi
                </label>
                <InputTextarea
                  id="deskripsi"
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  autoResize
                  rows={4}
                  className={`w-full ${errors.deskripsi ? "p-invalid" : ""}`}
                  placeholder="Ringkasan isi/ket. buku"
                  maxLength={2000}
                />
                {errors.deskripsi && (
                  <small className="p-error mt-1 block">
                    {errors.deskripsi}
                  </small>
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
