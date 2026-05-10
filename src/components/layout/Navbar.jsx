import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Senda — Tu armario inteligente",
  description: "Gestión de armario sostenible y consciente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
