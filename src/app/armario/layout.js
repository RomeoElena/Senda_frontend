export const metadata = {
  title: "Mi armario — Senda",
  description:
    "Gestiona tu inventario de ropa. Añade, edita y organiza tus prendas por tipo y estado.",
};

export default function ArmarioLayout({ children }) {
  return <main className="page-container">{children}</main>;
}
