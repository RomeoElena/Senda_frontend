"use client";

import { useState, useEffect, useCallback } from "react";

export default function EstadisticasPage() {
  const [prendas, setPrendas] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("6meses");

  const fetchDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const [resPrendas, resOutfits] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/prendas`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/outfits`),
      ]);
      if (!resPrendas.ok || !resOutfits.ok)
        throw new Error("Error al cargar los datos");
      const [dataPrendas, dataOutfits] = await Promise.all([
        resPrendas.json(),
        resOutfits.json(),
      ]);
      setPrendas(dataPrendas);
      setOutfits(dataOutfits);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  // Estadísticas calculadas
  const totalPrendas = prendas.length;
  const prendasNuevas = prendas.filter((p) => p.estado === "nuevo").length;
  const prendasUsadas = prendas.filter((p) => p.estado === "usado").length;
  const prendasDonar = prendas.filter((p) => p.estado === "donar").length;
  const prendasReciclar = prendas.filter((p) => p.estado === "reciclar").length;
  const totalOutfits = outfits.length;
  const outfitsFavoritos = outfits.filter((o) => o.favorito).length;

  // Distribución por tipo
  const tiposUnicos = [...new Set(prendas.map((p) => p.tipo))].filter(Boolean);
  const categorias = tiposUnicos
    .map((tipo) => {
      const cantidad = prendas.filter((p) => p.tipo === tipo).length;
      return {
        nombre: tipo,
        cantidad,
        porcentaje:
          totalPrendas > 0 ? Math.round((cantidad / totalPrendas) * 100) : 0,
      };
    })
    .sort((a, b) => b.cantidad - a.cantidad);

  // Outfits por mes (últimos 6 meses)
  const ahora = new Date();
  const meses = Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i), 1);
    return {
      mes: fecha.toLocaleString("es", { month: "short" }),
      year: fecha.getFullYear(),
      month: fecha.getMonth(),
      outfits: 0,
    };
  });

  outfits.forEach((outfit) => {
    if (!outfit.createdAt) return;
    const fecha = new Date(outfit.createdAt);
    const entry = meses.find(
      (m) => m.month === fecha.getMonth() && m.year === fecha.getFullYear(),
    );
    if (entry) entry.outfits++;
  });

  const maxOutfits = Math.max(...meses.map((m) => m.outfits), 1);

  if (cargando) {
    return (
      <main className="page-container">
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          Cargando estadísticas...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div
          style={{
            backgroundColor: "var(--color-reciclar)",
            color: "var(--color-reciclar-text)",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {error} — ¿Está el servidor backend encendido?
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Cabecera */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "600",
              color: "var(--color-text)",
              marginBottom: "6px",
            }}
          >
            Estadísticas
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Visualiza el impacto de tu armario digital.
          </p>
        </div>

        {/* Tarjetas principales */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatCard
            label="Total de prendas"
            value={totalPrendas}
            color="var(--color-primary)"
          />
          <StatCard
            label="Outfits creados"
            value={totalOutfits}
            color="var(--color-primary-hover)"
          />
          <StatCard
            label="Outfits favoritos"
            value={outfitsFavoritos}
            color="var(--color-nuevo-text)"
          />
          <StatCard
            label="En circulación"
            value={prendasDonar + prendasReciclar}
            color="var(--color-donar-text)"
          />
        </div>

        {/* Estado de prendas */}
        <div className="card" style={{ padding: "28px", marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: "600",
              color: "var(--color-text)",
              marginBottom: "20px",
            }}
          >
            Estado de tus prendas
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "16px",
            }}
          >
            <StatusPill
              label="Nuevas"
              count={prendasNuevas}
              className="pill-nuevo"
            />
            <StatusPill
              label="En uso"
              count={prendasUsadas}
              className="pill-usado"
            />
            <StatusPill
              label="Para donar"
              count={prendasDonar}
              className="pill-donar"
            />
            <StatusPill
              label="Reciclar"
              count={prendasReciclar}
              className="pill-reciclar"
            />
          </div>
        </div>

        {/* Distribución por tipo */}
        {categorias.length > 0 && (
          <div
            className="card"
            style={{ padding: "28px", marginBottom: "20px" }}
          >
            <h2
              style={{
                fontSize: "17px",
                fontWeight: "600",
                color: "var(--color-text)",
                marginBottom: "20px",
              }}
            >
              Distribución por tipo
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {categorias.map((cat) => (
                <CategoryBar
                  key={cat.nombre}
                  nombre={cat.nombre}
                  cantidad={cat.cantidad}
                  porcentaje={cat.porcentaje}
                />
              ))}
            </div>
          </div>
        )}

        {/* Outfits por mes */}
        <div className="card" style={{ padding: "28px", marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <h2
              style={{
                fontSize: "17px",
                fontWeight: "600",
                color: "var(--color-text)",
              }}
            >
              Outfits creados
            </h2>
            <select
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <option value="6meses">Últimos 6 meses</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "16px",
              height: "180px",
              padding: "0 8px",
            }}
          >
            {meses.map((mes) => (
              <div
                key={`${mes.mes}-${mes.year}`}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "var(--color-text)",
                  }}
                >
                  {mes.outfits}
                </span>
                <div
                  style={{
                    width: "100%",
                    height: `${(mes.outfits / maxOutfits) * 140}px`,
                    minHeight: "4px",
                    backgroundColor:
                      mes.outfits > 0
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.3s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-muted)",
                    fontWeight: "500",
                  }}
                >
                  {mes.mes}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendación */}
        {prendasDonar + prendasReciclar > 0 && (
          <div
            style={{
              padding: "20px 24px",
              backgroundColor: "rgba(168, 197, 188, 0.15)",
              borderRadius: "12px",
              border: "1px solid var(--color-primary-light)",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "var(--color-primary)",
                marginBottom: "8px",
              }}
            >
              Recomendación:
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text)",
                lineHeight: "1.6",
              }}
            >
              Tienes {prendasDonar + prendasReciclar} prendas en circulación.
              {prendasDonar > 0 && ` ${prendasDonar} listas para donar`}
              {prendasDonar > 0 && prendasReciclar > 0 && " y"}
              {prendasReciclar > 0 && ` ${prendasReciclar} para reciclar`}.
              ¡Dales una segunda vida!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      className="card"
      style={{
        padding: "24px",
        textAlign: "center",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color,
          marginBottom: "8px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--color-text-muted)",
          fontWeight: "500",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatusPill({ label, count, className }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span className={`pill ${className}`} style={{ fontSize: "13px" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "var(--color-text)",
        }}
      >
        {count}
      </span>
    </div>
  );
}

function CategoryBar({ nombre, cantidad, porcentaje }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontSize: "14px",
        }}
      >
        <span style={{ fontWeight: "500", color: "var(--color-text)" }}>
          {nombre}
        </span>
        <span style={{ color: "var(--color-text-muted)" }}>{cantidad}</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "var(--color-border)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${porcentaje}%`,
            height: "100%",
            backgroundColor: "var(--color-primary)",
            borderRadius: "4px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}
