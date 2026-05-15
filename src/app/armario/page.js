"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const FILTROS_TIPO = [
  "Todas",
  "Superior",
  "Inferior",
  "Exterior",
  "Calzado",
  "Complemento",
];
const FILTROS_ESTADO = ["Todos", "nuevo", "usado", "donar", "reciclar"];

const labelFiltro = {
  fontSize: "12px",
  fontWeight: "500",
  color: "var(--color-text-muted)",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export default function ArmarioPage() {
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const fetchPrendas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/prendas?`;
      if (filtroTipo !== "Todas") url += `tipo=${filtroTipo}&`;
      if (filtroEstado !== "Todos") url += `estado=${filtroEstado}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al cargar las prendas");
      const data = await res.json();
      setPrendas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [filtroTipo, filtroEstado]);

  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  const eliminarPrenda = async (id, nombre) => {
    if (!confirm(`¿Segura que quieres eliminar "${nombre}"?`)) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prendas/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Error al eliminar");
      setPrendas(prendas.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="page-container">
      {/* Cabecera */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "600",
              color: "var(--color-text)",
              marginBottom: "4px",
            }}
          >
            Mi armario
          </h1>
          <p
            aria-live="polite"
            style={{ fontSize: "14px", color: "var(--color-text-muted)" }}
          >
            {prendas.length} {prendas.length === 1 ? "prenda" : "prendas"}{" "}
            registradas
          </p>
        </div>
        <Link
          href="/armario/nueva"
          aria-label="Añadir nueva prenda al armario"
          className="btn-primary"
          style={{ textDecoration: "none" }}
        >
          + Añadir prenda
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: "32px" }}>
        <nav aria-label="Filtrar por tipo de prenda">
          <p style={labelFiltro}>Tipo</p>
          <div
            role="group"
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {FILTROS_TIPO.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                aria-pressed={filtroTipo === tipo}
                style={{
                  fontSize: "13px",
                  padding: "6px 16px",
                  borderRadius: "99px",
                  border:
                    filtroTipo === tipo
                      ? "none"
                      : "1px solid var(--color-border)",
                  backgroundColor:
                    filtroTipo === tipo
                      ? "var(--color-primary)"
                      : "var(--color-surface)",
                  color:
                    filtroTipo === tipo ? "white" : "var(--color-text-muted)",
                  cursor: "pointer",
                  fontWeight: filtroTipo === tipo ? "500" : "400",
                  transition: "all 0.2s ease",
                }}
              >
                {tipo}
              </button>
            ))}
          </div>
        </nav>

        <nav aria-label="Filtrar por estado de prenda">
          <p style={labelFiltro}>Estado</p>
          <div
            role="group"
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {FILTROS_ESTADO.map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                aria-pressed={filtroEstado === estado}
                style={{
                  fontSize: "12px",
                  padding: "4px 14px",
                  borderRadius: "99px",
                  border:
                    filtroEstado === estado
                      ? "none"
                      : "1px solid var(--color-border)",
                  backgroundColor:
                    filtroEstado === estado
                      ? "var(--color-text)"
                      : "var(--color-surface)",
                  color:
                    filtroEstado === estado
                      ? "white"
                      : "var(--color-text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {estado}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Cargando */}
      {cargando && (
        <p
          role="status"
          style={{ color: "var(--color-text-muted)", fontSize: "14px" }}
        >
          Cargando prendas...
        </p>
      )}

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
          {error} — ¿Está el servidor backend encendido?
        </div>
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
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>
            Tu armario está vacío
          </p>
          <p style={{ fontSize: "13px" }}>
            Añade tu primera prenda para empezar
          </p>
        </div>
      )}

      {/* Grid de prendas */}
      <section aria-label="Lista de prendas">
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
              aria-label={`Prenda: ${prenda.nombre}`}
              style={{
                borderRadius: "12px",
                border: "0.5px solid var(--color-border)",
                overflow: "hidden",
                position: "relative",
                height: "280px",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Image
                src={prenda.imagen || "https://via.placeholder.com/200x280"}
                alt={`Fotografía de ${prenda.nombre}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{ objectFit: "cover" }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
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
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className={`pill pill-${prenda.estado}`}>
                    {prenda.estado}
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Link
                      href={`/armario/${prenda._id}`}
                      aria-label={`Editar prenda ${prenda.nombre}`}
                      style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "500",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => eliminarPrenda(prenda._id, prenda.nombre)}
                      aria-label={`Eliminar prenda ${prenda.nombre}`}
                      style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
