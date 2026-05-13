import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Senda — Tu armario digital",
  description:
    "Gestiona tu armario personal de forma inteligente. Organiza prendas, crea outfits y contribuye a la economía circular.",
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
            padding: "48px 24px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
