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
    <main>
      {/* Cabecera */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "500",
            color: "var(--color-text)",
            marginBottom: "4px",
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
          marginBottom: "28px",
        }}
      >
        <div
          role="status"
          aria-label={`${prendas.filter((p) => p.estado === "donar").length} prendas para donar`}
          style={{
            backgroundColor: "var(--color-donar)",
            borderRadius: "10px",
            padding: "16px",
            border: "0.5px solid var(--color-border)",
          }}
        >
          <p
            aria-hidden="true"
            style={{
              fontSize: "28px",
              fontWeight: "500",
              color: "var(--color-donar-text)",
            }}
          >
            {prendas.filter((p) => p.estado === "donar").length}
          </p>
          <p
            aria-hidden="true"
            style={{
              fontSize: "13px",
              color: "var(--color-donar-text)",
              marginTop: "2px",
            }}
          >
            Para donar
          </p>
        </div>
        <div
          role="status"
          aria-label={`${prendas.filter((p) => p.estado === "reciclar").length} prendas para reciclar`}
          style={{
            backgroundColor: "var(--color-reciclar)",
            borderRadius: "10px",
            padding: "16px",
            border: "0.5px solid var(--color-border)",
          }}
        >
          <p
            aria-hidden="true"
            style={{
              fontSize: "28px",
              fontWeight: "500",
              color: "var(--color-reciclar-text)",
            }}
          >
            {prendas.filter((p) => p.estado === "reciclar").length}
          </p>
          <p
            aria-hidden="true"
            style={{
              fontSize: "13px",
              color: "var(--color-reciclar-text)",
              marginTop: "2px",
            }}
          >
            Para reciclar
          </p>
        </div>
        <div
          role="status"
          aria-label={`${prendas.length} prendas en total en circulación`}
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "10px",
            padding: "16px",
            border: "0.5px solid var(--color-border)",
          }}
        >
          <p
            aria-hidden="true"
            style={{
              fontSize: "28px",
              fontWeight: "500",
              color: "var(--color-primary)",
            }}
          >
            {prendas.length}
          </p>
          <p
            aria-hidden="true"
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
              marginTop: "2px",
            }}
          >
            Total en circulación
          </p>
        </div>
      </section>

      {/* Filtros */}
      <nav aria-label="Filtrar prendas por estado de circulación">
        <div
          role="group"
          aria-label="Estados de circulación"
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              aria-pressed={filtro === f}
              aria-label={`Filtrar por: ${f === "Todas" ? "todas las prendas" : f}`}
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
          aria-live="assertive"
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
          aria-live="polite"
          style={{ color: "var(--color-text-muted)", fontSize: "14px" }}
        >
          Cargando prendas...
        </p>
      )}

      {/* Sin prendas — empty state con enlace */}
      {!cargando && !error && prendas.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
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
            style={{
              display: "inline-block",
              backgroundColor: "var(--color-primary)",
              color: "white",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            Ir al armario →
          </Link>
        </div>
      )}

      {/* Grid de prendas */}
      <section aria-label="Lista de prendas para circular">
        <div
          className="cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
          }}
        >
          {prendas.map((prenda) => (
            <article
              key={prenda._id}
              aria-label={`Prenda ${prenda.nombre}, estado: ${prenda.estado}`}
              style={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "12px",
                border: "0.5px solid var(--color-border)",
                overflow: "hidden",
              }}
            >
              {/* Imagen */}
              <div
                style={{
                  height: "180px",
                  backgroundColor: "var(--color-border)",
                  position: "relative",
                }}
              >
                <Image
                  src={prenda.imagen || "https://via.placeholder.com/220x160"}
                  alt={`Fotografía de ${prenda.nombre}, tipo ${prenda.tipo}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div
                  aria-hidden="true"
                  style={{ position: "absolute", top: "8px", left: "8px" }}
                >
                  <span className={`pill pill-${prenda.estado}`}>
                    {prenda.estado}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "14px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--color-text)",
                    marginBottom: "2px",
                  }}
                >
                  {prenda.nombre}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-muted)",
                    marginBottom: "12px",
                  }}
                >
                  {prenda.tipo} {prenda.marca ? `· ${prenda.marca}` : ""}
                </p>

                {/* Acciones */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => cambiarEstado(prenda, "usado")}
                    aria-label={`Devolver ${prenda.nombre} al armario`}
                    style={{
                      width: "100%",
                      fontSize: "12px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Volver al armario
                  </button>

                  {prenda.estado === "donar" && (
                    <button
                      onClick={() => cambiarEstado(prenda, "reciclar")}
                      aria-label={`Mover ${prenda.nombre} a reciclar`}
                      style={{
                        width: "100%",
                        fontSize: "12px",
                        padding: "8px",
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
                      aria-label={`Mover ${prenda.nombre} a donar`}
                      style={{
                        width: "100%",
                        fontSize: "12px",
                        padding: "8px",
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
