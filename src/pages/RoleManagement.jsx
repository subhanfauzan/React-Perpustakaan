import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users"); // backend punya API users
      setUsers(res.data);
    } catch (err) {
      alert("Gagal memuat users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      await loadUsers();
    } catch (err) {
      alert("Gagal mengubah role");
    }
  };

  return (
    <div>
      <h2>Role Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
                  <button onClick={() => changeRole(u.id, "admin")}>
                    Set Admin
                  </button>
                  <button onClick={() => changeRole(u.id, "anggota")}>
                    Set Anggota
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p>
        Catatan: halaman ini hanya melakukan perubahan role lewat endpoint `PUT
        /api/users/:id`.
      </p>
    </div>
  );
}
