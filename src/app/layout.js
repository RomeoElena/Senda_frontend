import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Senda — Tu armario inteligente",
  description: "Gestión de armario sostenible y consciente",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
