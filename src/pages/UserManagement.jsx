import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "anggota",
  });

  const load = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      alert("Gagal load users");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      setForm({ nama: "", email: "", password: "", role: "anggota" });
      load();
    } catch (err) {
      alert("Gagal buat user");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Hapus user?")) return;
    try {
      await api.delete(`/users/${id}`);
      load();
    } catch (err) {
      alert("Gagal hapus");
    }
  };

  return (
    <div>
      <h2>User Management (Admin)</h2>

      <form onSubmit={createUser}>
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="anggota">Anggota</option>
          <option value="admin">Administrator</option>
        </select>
        <button type="submit">Buat User</button>
      </form>

      <hr />
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nama}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => deleteUser(u.id)}>Hapus</button>
                {/* Jika mau tambah Edit, bisa tambahkan modal/form edit yang memanggil PUT /users/:id */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
