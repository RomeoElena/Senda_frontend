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
    <div style={{ maxWidth: "720px" }}>
      {/* Cabecera */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "500",
            color: "var(--color-text)",
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          Tu armario digital
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--color-text-muted)",
            lineHeight: "1.6",
          }}
        >
          Gestiona tus prendas, crea looks personalizados y guarda tus favoritos
          en una experiencia digital diseñada para prolongar la vida de tu ropa.
        </p>
      </div>

      {/* Estadísticas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "40px",
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

      {/* Accesos directos */}
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "500",
          color: "var(--color-text)",
          marginBottom: "16px",
        }}
      >
        Accesos directos
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        <AccesoCard
          href="/armario"
          titulo="Mi armario"
          descripcion="Gestiona todas tus prendas"
          accion="Ver armario"
        />
        <AccesoCard
          href="/armario/nueva"
          titulo="Añadir prenda"
          descripcion="Registra una nueva prenda con foto"
          accion="Añadir"
          destacado
        />
        <AccesoCard
          href="/outfits"
          titulo="Mis outfits"
          descripcion="Crea y gestiona tus conjuntos"
          accion="Ver outfits"
        />
        <AccesoCard
          href="/circular"
          titulo="Economia circular"
          descripcion="Dona o recicla lo que no usas"
          accion="Ver circular"
        />
      </div>
    </div>
  );
}

function StatCard({ valor, label, color, bg }) {
  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: "10px",
        padding: "16px",
        border: "0.5px solid var(--color-border)",
      }}
    >
      <p
        style={{
          fontSize: "28px",
          fontWeight: "500",
          color: color,
          marginBottom: "4px",
        }}
      >
        {valor}
      </p>
      <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

function AccesoCard({ href, titulo, descripcion, accion, destacado }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "12px",
        padding: "20px",
        border: destacado
          ? "1.5px solid var(--color-primary)"
          : "0.5px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p
        style={{
          fontSize: "15px",
          fontWeight: "500",
          color: "var(--color-text)",
        }}
      >
        {titulo}
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "var(--color-text-muted)",
          lineHeight: "1.5",
          flex: 1,
        }}
      >
        {descripcion}
      </p>
      <Link
        href={href}
        style={{
          fontSize: "13px",
          fontWeight: "500",
          color: destacado ? "white" : "var(--color-primary)",
          backgroundColor: destacado ? "var(--color-primary)" : "transparent",
          textDecoration: "none",
          padding: destacado ? "8px 14px" : "0",
          borderRadius: destacado ? "6px" : "0",
          textAlign: destacado ? "center" : "left",
          marginTop: "4px",
          display: "block",
        }}
      >
        {accion} →
      </Link>
    </div>
  );
}
