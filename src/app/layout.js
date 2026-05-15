import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/layout/ScrollToTop";

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
        <ScrollToTop />
        <Navbar />
        {children}
        <footer>
          <div className="footer-content">
            © 2026 Senda · Tu armario digital
          </div>
        </footer>
      </body>
    </html>
  );
}
