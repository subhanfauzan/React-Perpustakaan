// src/components/AuditTrailBuku.jsx
import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import api from "../api/axios";

export default function AuditTrailBuku({ bookId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageState, setPageState] = useState({
    page: 1,
    rows: 20,
    total: 0,
  });

  const fetchData = async (page = 1) => {
    if (!bookId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/buku/${bookId}/audits`, {
        params: { page },
      });
      // Laravel paginator format:
      setItems(data.data || []);
      setPageState((s) => ({
        ...s,
        page: data.current_page,
        rows: data.per_page,
        total: data.total,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageState((s) => ({ ...s, page: 1 })); // reset ke page 1 jika bookId berubah
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const onPage = (e) => {
    const nextPage = e.first / e.rows + 1;
    fetchData(nextPage);
  };

  const eventTemplate = (row) => {
    const map = {
      created: "success",
      updated: "warning",
      deleted: "danger",
    };
    const severity = map[row.event] || "info";
    return <Tag value={row.event} severity={severity} rounded />;
  };

  const userTemplate = (row) => {
    if (!row.user) return <span className="text-500 italic">system</span>;
    return (
      <div className="flex flex-column">
        <span className="font-medium">{row.user.nama}</span>
        <span className="text-500 text-sm">{row.user.email}</span>
      </div>
    );
  };

  const dateTemplate = (row) => {
    // tampilkan created_at dari audit log
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
        {row.ip && <span className="text-500 text-xs">IP: {row.ip}</span>}
      </div>
    );
  };

  const diffTemplate = (row) => {
    // render perubahan field-field old→new
    const oldVals = row.old_values || {};
    const newVals = row.new_values || {};
    const keys = useMemo(() => {
      const set = new Set([...Object.keys(oldVals), ...Object.keys(newVals)]);
      return Array.from(set);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row.id]); // row.id berubah setiap baris

    if (row.event === "created") {
      return (
        <div className="text-sm">
          <span className="text-500">Nilai awal dibuat.</span>
        </div>
      );
    }
    if (row.event === "deleted") {
      return (
        <div className="text-sm">
          <span className="text-500">Data dihapus.</span>
        </div>
      );
    }

    return (
      <div className="flex flex-column gap-2">
        {keys.map((k) => {
          if (k === "updated_at" || k === "created_at" || k === "id")
            return null;
          const before = oldVals?.[k];
          const after = newVals?.[k];
          if (before === undefined && after === undefined) return null;
          if (JSON.stringify(before) === JSON.stringify(after)) return null;
          return (
            <div key={k} className="text-sm">
              <span className="text-700 font-medium">{k}</span>
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

  const formatVal = (v) => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  return (
    <div className="card">
      <div className="flex justify-between align-items-center mb-3">
        <div>
          <h3 className="m-0 text-xl font-semibold">Riwayat Perubahan Buku</h3>
          <p className="m-0 text-500 text-sm">
            Semua perubahan pada data buku #{bookId}
          </p>
        </div>
        <Button
          icon="pi pi-refresh"
          label="Refresh"
          onClick={() => fetchData(pageState.page)}
          loading={loading}
        />
      </div>

      <DataTable
        value={items}
        loading={loading}
        paginator
        rows={pageState.rows}
        totalRecords={pageState.total}
        onPage={onPage}
        first={(pageState.page - 1) * pageState.rows}
        responsiveLayout="scroll"
        emptyMessage="Belum ada audit untuk buku ini."
        className="text-sm"
      >
        <Column header="Waktu" body={dateTemplate} style={{ width: "16rem" }} />
        <Column header="User" body={userTemplate} style={{ width: "16rem" }} />
        <Column header="Event" body={eventTemplate} style={{ width: "8rem" }} />
        <Column header="Perubahan" body={diffTemplate} />
      </DataTable>
    </div>
  );
}
