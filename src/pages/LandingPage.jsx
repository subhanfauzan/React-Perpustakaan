import React, { useMemo, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import api from "../api/axios";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/buku");
        if (!mounted) return;
        const mapped = (res.data?.data || res.data || []).map((b) => ({
          id: b.id,
          title: b.judul,
          author: b.penulis,
          year: b.tahun,
          category: b.kategori,
          stock: b.stok,
          description: b.deskripsi,
          available: (b.stok ?? 0) > 0,
        }));
        setBooks(mapped);
        setError("");
      } catch (e) {
        console.error(e);
        setError("Gagal memuat katalog buku. Coba refresh halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query) return books;
    const q = query.toLowerCase();
    return books.filter((b) =>
      [b.title, b.author, b.category, String(b.year), b.description]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [books, query]);

  return (
    <div className="min-h-screen flex flex-column bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-100">
      {/* Top Bar */}
      <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur border-bottom-1 surface-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"></div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari judul/penulis/kategori..."
                className="p-inputtext p-component px-3 py-2 border-round-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button
              label="Login"
              icon="pi pi-user"
              className="bg-primary border-0 text-white font-medium border-round-lg shadow-2"
              onClick={() => (window.location.href = "/login")}
            />
          </div>
        </div>
      </header>

      {/* Catalog Section */}
      <section className="px-4 pb-6 pt-4 w-full flex justify-content-center">
        <div className="w-full max-w-6xl">
          <div className="flex align-items-center justify-content-between mb-3">
            <h2 className="text-2xl font-semibold text-900">Katalog Buku</h2>
            <div className="md:hidden">
              <input
                type="text"
                placeholder="Cari buku..."
                className="p-inputtext p-component px-3 py-2 border-round-lg w-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-700">Memuat katalog...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-700">
              Tidak ada buku yang cocok dengan pencarian.
            </div>
          ) : (
            <div className="grid grid-nogutter -mx-2">
              {filtered.map((b) => (
                <div key={b.id} className="col-12 sm:col-6 lg:col-4 px-2 mb-4">
                  <article className="bg-white border-round-xl shadow-2 overflow-hidden h-full flex flex-column p-3 relative">
                    <div className="absolute top-2 left-2">
                      <Tag
                        value={b.category}
                        className="border-round-xl text-xs py-1 px-2"
                      />
                    </div>
                    <h3 className="m-0 text-xl font-semibold text-900 line-height-3 mt-4">
                      {b.title}
                    </h3>
                    <p className="m-0 mt-1 text-600">
                      {b.author} • {b.year}
                    </p>
                    {b.description && (
                      <p className="m-0 mt-2 text-700 line-height-3">
                        {b.description}
                      </p>
                    )}
                    <div className="mt-auto flex align-items-center justify-content-between pt-3">
                      <Button
                        label="Detail"
                        icon="pi pi-search"
                        className="p-button-outlined border-round-lg"
                        onClick={() => alert(`Detail buku: ${b.title}`)}
                      />
                      <Button
                        label={
                          b.available ? `Stok (${b.stock})` : "Tidak Tersedia"
                        }
                        icon="pi pi-book"
                        disabled={!b.available}
                        className="border-round-lg"
                        severity={b.available ? "success" : "secondary"}
                      />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .bg-gradient-to-tr { background: linear-gradient(135deg, #e3f0ff 10%, #f3e8ff 60%, #e0e7ff 100%); }
        .text-primary { color: #6c63ff; }
      `}</style>
    </div>
  );
}
