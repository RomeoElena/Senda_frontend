"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const FILTROS = ["Todas", "donar", "reciclar"];

export default function CircularPage() {
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("Todas");

  const fetchPrendas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const res = await fetch(
        filtro !== "Todas"
          ? `${process.env.NEXT_PUBLIC_API_URL}/prendas?estado=${filtro}`
          : `${process.env.NEXT_PUBLIC_API_URL}/prendas`,
      );
      if (!res.ok) throw new Error("Error al cargar las prendas");
      const data = await res.json();

      const filtradas =
        filtro === "Todas"
          ? data.filter((p) => p.estado === "donar" || p.estado === "reciclar")
          : data;

      setPrendas(filtradas);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [filtro]);

  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  const cambiarEstado = async (prenda, nuevoEstado) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prendas/${prenda._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        },
      );
      if (!res.ok) throw new Error("Error al actualizar");
      setPrendas(prendas.filter((p) => p._id !== prenda._id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="page-container">
      {/* Cabecera */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "600",
            color: "var(--color-text)",
            marginBottom: "6px",
          }}
        >
          Economía circular
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          Prendas que puedes donar o reciclar para darles una segunda vida
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <section
        aria-label="Estadísticas de economía circular"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--color-donar)",
            borderRadius: "12px",
            padding: "20px",
            border: "0.5px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "var(--color-donar-text)",
              lineHeight: 1,
            }}
          >
            {prendas.filter((p) => p.estado === "donar").length}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-donar-text)",
              marginTop: "6px",
            }}
          >
            Para donar
          </p>
        </div>
        <div
          style={{
            backgroundColor: "var(--color-reciclar)",
            borderRadius: "12px",
            padding: "20px",
            border: "0.5px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "var(--color-reciclar-text)",
              lineHeight: 1,
            }}
          >
            {prendas.filter((p) => p.estado === "reciclar").length}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-reciclar-text)",
              marginTop: "6px",
            }}
          >
            Para reciclar
          </p>
        </div>
        <div
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "12px",
            padding: "20px",
            border: "0.5px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "var(--color-primary)",
              lineHeight: 1,
            }}
          >
            {prendas.length}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
              marginTop: "6px",
            }}
          >
            Total en circulación
          </p>
        </div>
      </section>

      {/* Filtros */}
      <nav aria-label="Filtrar prendas por estado">
        <div
          role="group"
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              aria-pressed={filtro === f}
              style={{
                fontSize: "13px",
                padding: "6px 16px",
                borderRadius: "99px",
                border: filtro === f ? "none" : "1px solid var(--color-border)",
                backgroundColor:
                  filtro === f
                    ? "var(--color-primary)"
                    : "var(--color-surface)",
                color: filtro === f ? "white" : "var(--color-text-muted)",
                cursor: "pointer",
                fontWeight: filtro === f ? "500" : "400",
                transition: "all 0.2s ease",
              }}
            >
              {f === "Todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: "var(--color-reciclar)",
            color: "var(--color-reciclar-text)",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Cargando */}
      {cargando && (
        <p
          role="status"
          style={{ color: "var(--color-text-muted)", fontSize: "14px" }}
        >
          Cargando prendas...
        </p>
      )}

      {/* Vacío */}
      {!cargando && !error && prendas.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            color: "var(--color-text-muted)",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: "var(--color-text)",
            }}
          >
            No tienes prendas para circular
          </p>
          <p style={{ fontSize: "13px", marginBottom: "24px" }}>
            Marca prendas como &quot;donar&quot; o &quot;reciclar&quot; desde tu
            armario
          </p>
          <Link
            href="/armario"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Ir al armario →
          </Link>
        </div>
      )}

      {/* Grid de prendas */}
      <section aria-label="Lista de prendas para circular">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {prendas.map((prenda) => (
            <article
              key={prenda._id}
              style={{
                borderRadius: "12px",
                border: "0.5px solid var(--color-border)",
                overflow: "hidden",
                position: "relative",
                height: "280px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Imagen de fondo */}
              <Image
                src={prenda.imagen || "https://via.placeholder.com/200x280"}
                alt={`Fotografía de ${prenda.nombre}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{ objectFit: "cover" }}
              />

              {/* Pill estado arriba */}
              <div style={{ position: "absolute", top: "10px", left: "10px" }}>
                <span className={`pill pill-${prenda.estado}`}>
                  {prenda.estado}
                </span>
              </div>

              {/* Gradiente + info + acciones */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                  padding: "14px",
                  color: "white",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "2px",
                  }}
                >
                  {prenda.nombre}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    opacity: 0.8,
                    marginBottom: "10px",
                  }}
                >
                  {prenda.tipo}
                  {prenda.marca ? ` · ${prenda.marca}` : ""}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <button
                    onClick={() => cambiarEstado(prenda, "usado")}
                    style={{
                      width: "100%",
                      fontSize: "11px",
                      padding: "5px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "500",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    Volver al armario
                  </button>

                  {prenda.estado === "donar" && (
                    <button
                      onClick={() => cambiarEstado(prenda, "reciclar")}
                      style={{
                        width: "100%",
                        fontSize: "11px",
                        padding: "5px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "var(--color-reciclar)",
                        color: "var(--color-reciclar-text)",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Mover a reciclar
                    </button>
                  )}

                  {prenda.estado === "reciclar" && (
                    <button
                      onClick={() => cambiarEstado(prenda, "donar")}
                      style={{
                        width: "100%",
                        fontSize: "11px",
                        padding: "5px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "var(--color-donar)",
                        color: "var(--color-donar-text)",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Mover a donar
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
