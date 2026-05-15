"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState([]);
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    prendas: [],
  });

  const fetchOutfits = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/outfits`);
      if (!res.ok) throw new Error("Error al cargar los outfits");
      const data = await res.json();
      setOutfits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  const fetchPrendas = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prendas`);
      if (!res.ok) throw new Error("Error al cargar las prendas");
      const data = await res.json();
      setPrendas(data);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  useEffect(() => {
    fetchOutfits();
    fetchPrendas();
  }, [fetchOutfits, fetchPrendas]);

  const togglePrenda = (id) => {
    setFormData((prev) => ({
      ...prev,
      prendas: prev.prendas.includes(id)
        ? prev.prendas.filter((p) => p !== id)
        : [...prev.prendas, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre) {
      alert("El nombre del outfit es obligatorio");
      return;
    }
    try {
      setGuardando(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/outfits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al crear el outfit");
      setFormData({ nombre: "", descripcion: "", prendas: [] });
      setMostrarFormulario(false);
      fetchOutfits();
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarOutfit = async (id, nombre) => {
    if (!confirm(`¿Segura que quieres eliminar el outfit "${nombre}"?`)) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/outfits/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Error al eliminar");
      setOutfits(outfits.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleFavorito = async (outfit) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/outfits/${outfit._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ favorito: !outfit.favorito }),
        },
      );
      if (!res.ok) throw new Error("Error al actualizar");
      setOutfits(
        outfits.map((o) =>
          o._id === outfit._id ? { ...o, favorito: !o.favorito } : o,
        ),
      );
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
            Mis outfits
          </h1>
          <p
            aria-live="polite"
            style={{ fontSize: "14px", color: "var(--color-text-muted)" }}
          >
            {outfits.length} {outfits.length === 1 ? "conjunto" : "conjuntos"}{" "}
            guardados
          </p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          aria-expanded={mostrarFormulario}
          className={mostrarFormulario ? "btn-secondary" : "btn-primary"}
        >
          {mostrarFormulario ? "Cancelar" : "+ Crear outfit"}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <section
          id="formulario-outfit"
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "12px",
            border: "0.5px solid var(--color-border)",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--color-text)",
              marginBottom: "20px",
            }}
          >
            Nuevo outfit
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle} htmlFor="nombre">
                Nombre{" "}
                <span style={{ color: "var(--color-reciclar-text)" }}>*</span>
              </label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej: Look de oficina"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle} htmlFor="descripcion">
                Descripción
              </label>
              <input
                id="descripcion"
                type="text"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Ej: Para el día a día en la oficina"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ ...labelStyle, marginBottom: "12px" }}>
                Prendas del outfit{" "}
                <span
                  style={{
                    color: "var(--color-text-muted)",
                    fontWeight: "400",
                  }}
                >
                  ({formData.prendas.length} seleccionadas)
                </span>
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: "10px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "4px",
                }}
              >
                {prendas.map((prenda) => {
                  const seleccionada = formData.prendas.includes(prenda._id);
                  return (
                    <div
                      key={prenda._id}
                      onClick={() => togglePrenda(prenda._id)}
                      role="checkbox"
                      aria-checked={seleccionada}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          togglePrenda(prenda._id);
                        }
                      }}
                      style={{
                        borderRadius: "10px",
                        border: seleccionada
                          ? "2px solid var(--color-primary)"
                          : "1px solid var(--color-border)",
                        overflow: "hidden",
                        cursor: "pointer",
                        opacity: seleccionada ? 1 : 0.65,
                        transition: "all 0.15s ease",
                        backgroundColor: "var(--color-bg)",
                      }}
                    >
                      <div style={{ height: "90px", position: "relative" }}>
                        <Image
                          src={
                            prenda.imagen ||
                            "https://via.placeholder.com/110x90"
                          }
                          alt={prenda.nombre}
                          fill
                          sizes="110px"
                          style={{ objectFit: "cover" }}
                        />
                        {seleccionada && (
                          <div
                            style={{
                              position: "absolute",
                              top: "6px",
                              right: "6px",
                              backgroundColor: "var(--color-primary)",
                              color: "white",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: "700",
                            }}
                          >
                            ✓
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "6px 8px" }}>
                        <p
                          style={{
                            fontSize: "11px",
                            fontWeight: "500",
                            color: "var(--color-text)",
                          }}
                        >
                          {prenda.nombre}
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {prenda.tipo}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                opacity: guardando ? 0.7 : 1,
              }}
            >
              {guardando ? "Guardando..." : "Guardar outfit"}
            </button>
          </form>
        </section>
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
          {error}
        </div>
      )}

      {/* Cargando */}
      {cargando && (
        <p
          role="status"
          style={{ color: "var(--color-text-muted)", fontSize: "14px" }}
        >
          Cargando outfits...
        </p>
      )}

      {/* Vacío */}
      {!cargando && !error && outfits.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>
            No tienes outfits guardados
          </p>
          <p style={{ fontSize: "13px" }}>
            Crea tu primer conjunto con el botón de arriba
          </p>
        </div>
      )}

      {/* Lista de outfits */}
      <section aria-label="Lista de outfits">
        <div style={{ display: "grid", gap: "16px" }}>
          {outfits.map((outfit) => (
            <article
              key={outfit._id}
              style={{
                backgroundColor: "var(--color-surface)",
                borderRadius: "12px",
                border: outfit.favorito
                  ? "1.5px solid var(--color-primary)"
                  : "0.5px solid var(--color-border)",
                padding: "20px",
                transition: "box-shadow 0.2s ease",
              }}
            >
              {/* Cabecera del outfit */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: "600",
                        color: "var(--color-text)",
                      }}
                    >
                      {outfit.nombre}
                    </h3>
                    {outfit.favorito && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "500",
                          color: "var(--color-primary)",
                          backgroundColor: "var(--color-nuevo)",
                          padding: "2px 8px",
                          borderRadius: "99px",
                        }}
                      >
                        ★ Favorito
                      </span>
                    )}
                  </div>
                  {outfit.descripcion && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--color-text-muted)",
                        marginBottom: "4px",
                      }}
                    >
                      {outfit.descripcion}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {outfit.prendas?.length || 0}{" "}
                    {outfit.prendas?.length === 1 ? "prenda" : "prendas"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => toggleFavorito(outfit)}
                    aria-pressed={outfit.favorito}
                    className="btn-secondary"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    {outfit.favorito ? "★ Favorito" : "☆ Favorito"}
                  </button>
                  <button
                    onClick={() => eliminarOutfit(outfit._id, outfit.nombre)}
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--color-reciclar)",
                      color: "var(--color-reciclar-text)",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Prendas del outfit */}
              {outfit.prendas?.length > 0 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {outfit.prendas.map((prenda) => (
                    <div
                      key={prenda._id}
                      style={{
                        width: "80px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "0.5px solid var(--color-border)",
                      }}
                    >
                      <div style={{ height: "80px", position: "relative" }}>
                        <Image
                          src={
                            prenda.imagen || "https://via.placeholder.com/80"
                          }
                          alt={prenda.nombre}
                          fill
                          sizes="80px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "4px 6px",
                          backgroundColor: "var(--color-bg)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "10px",
                            color: "var(--color-text)",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {prenda.nombre}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "500",
  color: "var(--color-text)",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid var(--color-border)",
  backgroundColor: "white",
  color: "var(--color-text)",
  fontSize: "14px",
  outline: "none",
};
