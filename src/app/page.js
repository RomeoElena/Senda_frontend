"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalPrendas: 0,
    paraCircular: 0,
    totalOutfits: 0,
    prendasNuevas: 0,
  });
  const [cargando, setCargando] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [resPrendas, resOutfits] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/prendas`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/outfits`),
      ]);
      const prendas = await resPrendas.json();
      const outfits = await resOutfits.json();

      setStats({
        totalPrendas: prendas.length,
        paraCircular: prendas.filter(
          (p) => p.estado === "donar" || p.estado === "reciclar",
        ).length,
        totalOutfits: outfits.length,
        prendasNuevas: prendas.filter((p) => p.estado === "nuevo").length,
      });
    } catch (err) {
      console.error("Error al cargar estadísticas:", err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div>
      <style>{`
        .stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .acceso-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .acceso-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.10);
        }
        .acceso-link {
          transition: gap 0.2s ease;
        }
        .acceso-card:hover .acceso-link {
          gap: 8px;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .accesos-grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          .home-h1 {
            font-size: 28px !important;
            text-align: left !important;
          }
          .home-p {
            font-size: 15px !important;
          }
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ marginBottom: "56px" }}>
        <h1
          className="home-h1"
          style={{
            fontSize: "42px",
            fontWeight: "500",
            color: "var(--color-text)",
            marginBottom: "16px",
            letterSpacing: "-0.02em",
            lineHeight: "1.2",
            textAlign: "center",
          }}
        >
          Tu armario digital
        </h1>
        <p
          className="home-p"
          style={{
            fontSize: "18px",
            color: "var(--color-text-muted)",
            lineHeight: "1.7",
            textAlign: "left",
          }}
        >
          Gestiona tus prendas, crea looks personalizados y guarda tus favoritos
          en una experiencia digital diseñada para prolongar la vida de tu ropa.
        </p>
      </div>

      {/* Estadísticas */}
      <section aria-label="Resumen del armario">
        <h2
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "16px",
          }}
        >
          Resumen
        </h2>
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "56px",
          }}
        >
          <StatCard
            valor={cargando ? "..." : stats.totalPrendas}
            label="Prendas en el armario"
            color="var(--color-primary)"
            bg="var(--color-surface)"
          />
          <StatCard
            valor={cargando ? "..." : stats.totalOutfits}
            label="Outfits creados"
            color="var(--color-primary)"
            bg="var(--color-surface)"
          />
          <StatCard
            valor={cargando ? "..." : stats.prendasNuevas}
            label="Prendas nuevas"
            color="var(--color-nuevo-text)"
            bg="var(--color-nuevo)"
          />
          <StatCard
            valor={cargando ? "..." : stats.paraCircular}
            label="Para circular"
            color="var(--color-donar-text)"
            bg="var(--color-donar)"
          />
        </div>
      </section>

      {/* Accesos directos */}
      <section aria-label="Accesos directos">
        <h2
          style={{
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "16px",
          }}
        >
          Accesos directos
        </h2>
        <div
          className="accesos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          <AccesoCard
            href="/armario"
            titulo="Mi armario"
            descripcion="Gestiona todas tus prendas, filtra por tipo y estado"
            accion="Ver armario"
          />
          <AccesoCard
            href="/armario/nueva"
            titulo="Añadir prenda"
            descripcion="Registra una nueva prenda con foto en Cloudinary"
            accion="Añadir prenda"
            destacado
          />
          <AccesoCard
            href="/outfits"
            titulo="Mis outfits"
            descripcion="Crea conjuntos y guarda tus looks favoritos"
            accion="Ver outfits"
          />
          <AccesoCard
            href="/circular"
            titulo="Economia circular"
            descripcion="Dona o recicla lo que ya no usas"
            accion="Ver circular"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ valor, label, color, bg }) {
  return (
    <div
      className="stat-card"
      style={{
        backgroundColor: bg,
        borderRadius: "12px",
        padding: "32px",
        border: "0.5px solid var(--color-border)",
      }}
    >
      <p
        style={{
          fontSize: "42px",
          fontWeight: "500",
          color: color,
          marginBottom: "8px",
          lineHeight: 1,
        }}
      >
        {valor}
      </p>
      <p style={{ fontSize: "15px", color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

function AccesoCard({ href, titulo, descripcion, accion, destacado }) {
  return (
    <div
      className="acceso-card"
      style={{
        backgroundColor: destacado
          ? "var(--color-primary)"
          : "var(--color-surface)",
        borderRadius: "12px",
        padding: "32px",
        border: destacado ? "none" : "0.5px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: "240px",
      }}
    >
      <p
        style={{
          fontSize: "19px",
          fontWeight: "500",
          color: destacado ? "white" : "var(--color-text)",
        }}
      >
        {titulo}
      </p>
      <p
        style={{
          fontSize: "15px",
          color: destacado
            ? "rgba(255,255,255,0.80)"
            : "var(--color-text-muted)",
          lineHeight: "1.6",
          flex: 1,
        }}
      >
        {descripcion}
      </p>
      <Link
        href={href}
        className="acceso-link"
        style={{
          fontSize: "15px",
          fontWeight: "500",
          color: destacado ? "white" : "var(--color-primary)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {accion} →
      </Link>
    </div>
  );
}
