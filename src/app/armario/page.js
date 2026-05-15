"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TIPOS = [
  "Superior",
  "Inferior",
  "Exterior",
  "Calzado",
  "Complemento",
  "Vestido",
];
const ESTADOS = ["nuevo", "usado", "donar", "reciclar"];

export default function EditarPrendaPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imagenNueva, setImagenNueva] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    color: "",
    marca: "",
    estado: "usado",
    imagen: "",
  });

  const fetchPrenda = useCallback(async () => {
    try {
      setCargando(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prendas/${id}`,
      );
      if (!res.ok) throw new Error("Prenda no encontrada");
      const data = await res.json();
      setFormData({
        nombre: data.nombre || "",
        tipo: data.tipo || "",
        color: data.color || "",
        marca: data.marca || "",
        estado: data.estado || "usado",
        imagen: data.imagen || "",
      });
      setPreview(data.imagen || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPrenda();
  }, [fetchPrenda]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenNueva(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.tipo) {
      setError("El nombre y el tipo son obligatorios");
      return;
    }

    try {
      setGuardando(true);
      setError(null);

      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("tipo", formData.tipo);
      data.append("color", formData.color);
      data.append("marca", formData.marca);
      data.append("estado", formData.estado);
      if (imagenNueva) data.append("imagen", imagenNueva);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prendas/${id}`,
        {
          method: "PUT",
          body: data,
        },
      );

      if (!res.ok) throw new Error("Error al actualizar la prenda");

      router.push("/armario");
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <main className="page-container">
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          Cargando prenda...
        </p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        {/* Cabecera */}
        <div style={{ marginBottom: "32px" }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              fontSize: "14px",
              cursor: "pointer",
              padding: "0",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ← Volver
          </button>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "600",
              color: "var(--color-text)",
              marginBottom: "6px",
            }}
          >
            Editar prenda
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Modifica los datos de tu prenda
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "var(--color-reciclar)",
              color: "var(--color-reciclar-text)",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Imagen */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Fotografía de la prenda</label>
            <div
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                backgroundColor: "var(--color-surface)",
                border: "1.5px dashed var(--color-border)",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => document.getElementById("imagen-input").click()}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                    padding: "24px",
                  }}
                >
                  <p style={{ fontSize: "40px", marginBottom: "12px" }}>📷</p>
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    Haz clic para cambiar la foto
                  </p>
                </div>
              )}
            </div>
            <input
              id="imagen-input"
              type="file"
              accept="image/*"
              onChange={handleImagen}
              style={{ display: "none" }}
            />
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setImagenNueva(null);
                }}
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                }}
              >
                Eliminar foto
              </button>
            )}
          </div>

          {/* Nombre */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle} htmlFor="nombre">
              Nombre{" "}
              <span style={{ color: "var(--color-reciclar-text)" }}>*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Camiseta blanca de algodón"
              style={inputStyle}
            />
          </div>

          {/* Tipo */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle} htmlFor="tipo">
              Tipo{" "}
              <span style={{ color: "var(--color-reciclar-text)" }}>*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Selecciona un tipo</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Color y Marca */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={labelStyle} htmlFor="color">
                Color
              </label>
              <input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ej: Blanco"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="marca">
                Marca
              </label>
              <input
                id="marca"
                name="marca"
                type="text"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Ej: Zara"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Estado */}
          <div style={{ marginBottom: "32px" }}>
            <label style={labelStyle}>Estado</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {ESTADOS.map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => setFormData({ ...formData, estado })}
                  style={{
                    fontSize: "13px",
                    padding: "6px 16px",
                    borderRadius: "99px",
                    border:
                      formData.estado === estado
                        ? "none"
                        : "1px solid var(--color-border)",
                    backgroundColor:
                      formData.estado === estado
                        ? "var(--color-primary)"
                        : "var(--color-surface)",
                    color:
                      formData.estado === estado
                        ? "white"
                        : "var(--color-text-muted)",
                    cursor: "pointer",
                    fontWeight: formData.estado === estado ? "500" : "400",
                    transition: "all 0.2s ease",
                  }}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              style={{ flex: 1, padding: "12px" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: guardando
                  ? "var(--color-primary-light)"
                  : "var(--color-primary)",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: guardando ? "not-allowed" : "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
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
  backgroundColor: "var(--color-surface)",
  color: "var(--color-text)",
  fontSize: "14px",
  outline: "none",
};
