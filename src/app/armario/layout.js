export const metadata = {
  title: "Mi armario — Senda",
  description:
    "Gestiona tu inventario de ropa. Añade, edita y organiza tus prendas por tipo y estado.",
};

export default function ArmarioLayout({ children }) {
  return (
    <main
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 16px" }}
    >
      {children}
    </main>
  );
}
