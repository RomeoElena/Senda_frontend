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
    <main>
      {/* Intro */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "500",
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
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: "500",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          + Añadir prenda
        </Link>
      </div>

      {/* Filtros tipo */}
      <nav aria-label="Filtrar por tipo de prenda">
        <div
          role="group"
          aria-label="Tipos de prenda"
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          {FILTROS_TIPO.map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              aria-pressed={filtroTipo === tipo}
              aria-label={`Filtrar por tipo: ${tipo}`}
              style={{
                fontSize: "13px",
                padding: "6px 14px",
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

      {/* Filtros estado */}
      <nav aria-label="Filtrar por estado de prenda">
        <div
          role="group"
          aria-label="Estados de prenda"
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          {FILTROS_ESTADO.map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              aria-pressed={filtroEstado === estado}
              aria-label={`Filtrar por estado: ${estado}`}
              style={{
                fontSize: "12px",
                padding: "4px 12px",
                borderRadius: "99px",
                border:
                  filtroEstado === estado
                    ? "none"
                    : "1px solid var(--color-border)",
                backgroundColor:
                  filtroEstado === estado ? "var(--color-text)" : "transparent",
                color:
                  filtroEstado === estado ? "white" : "var(--color-text-muted)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {estado}
            </button>
          ))}
        </div>
      </nav>

      {/* Estado de carga */}
      {cargando && (
        <p
          role="status"
          aria-live="polite"
          style={{ color: "var(--color-text-muted)", fontSize: "14px" }}
        >
          Cargando prendas...
        </p>
      )}

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
          {error} — ¿Está el servidor backend encendido?
        </div>
      )}

      {/* Armario vacío */}
      {!cargando && !error && prendas.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
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
            gap: "16px",
          }}
        >
          {prendas.map((prenda) => (
            <article
              key={prenda._id}
              aria-label={`Prenda: ${prenda.nombre}`}
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
                  height: "160px",
                  backgroundColor: "var(--color-border)",
                  position: "relative",
                }}
              >
                <Image
                  src={prenda.imagen || "https://via.placeholder.com/200x160"}
                  alt={`Fotografía de ${prenda.nombre}, tipo ${prenda.tipo}`}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>

              {/* Información */}
              <div style={{ padding: "12px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--color-text)",
                    marginBottom: "4px",
                  }}
                >
                  {prenda.nombre}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--color-primary-hover)",
                    marginBottom: "8px",
                  }}
                >
                  {prenda.tipo}
                </p>

                {/* estado */}
                <span
                  className={`pill pill-${prenda.estado}`}
                  aria-label={`Estado: ${prenda.estado}`}
                >
                  {prenda.estado}
                </span>

                {/* Acciones */}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Link
                    href={`/armario/${prenda._id}`}
                    aria-label={`Editar prenda ${prenda.nombre}`}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "12px",
                      padding: "6px",
                      borderRadius: "6px",
                      backgroundColor: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminarPrenda(prenda._id, prenda.nombre)}
                    aria-label={`Eliminar prenda ${prenda.nombre}`}
                    style={{
                      flex: 1,
                      fontSize: "12px",
                      padding: "6px",
                      borderRadius: "6px",
                      backgroundColor: "var(--color-reciclar)",
                      color: "var(--color-reciclar-text)",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
