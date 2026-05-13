"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/armario", label: "Armario" },
  { href: "/outfits", label: "Outfits" },
  { href: "/circular", label: "Circular" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cierra el menú al cambiar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Bloquea el scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      style={{
        backgroundColor: "var(--color-primary)",
        position: "relative",
        zIndex: 100,
      }}
    >
      <nav
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <Image
            src="/logo.png"
            alt="Senda logo"
            width={40}
            height={40}
            style={{ borderRadius: "6px" }}
          />
          <span
            className="logo-text"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#F7F5F2",
              letterSpacing: "0.12em",
            }}
          >
            SENDA
          </span>
        </Link>

        {/* Links — desktop */}
        <ul
          style={{
            display: "flex",
            gap: "32px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="nav-links-desktop"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontSize: "15px",
                    fontWeight: isActive ? "500" : "400",
                    color: isActive ? "#F7F5F2" : "var(--color-primary-light)",
                    textDecoration: "none",
                    borderBottom: isActive
                      ? "1.5px solid #F7F5F2"
                      : "1.5px solid transparent",
                    paddingBottom: "2px",
                    transition: "color 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Botón hamburguesa — solo móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="hamburger-btn"
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            width: "40px",
            height: "40px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              backgroundColor: "#F7F5F2",
              borderRadius: "2px",
              transition: "transform 0.25s ease, opacity 0.25s ease",
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              backgroundColor: "#F7F5F2",
              borderRadius: "2px",
              transition: "opacity 0.2s ease",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              backgroundColor: "#F7F5F2",
              borderRadius: "2px",
              transition: "transform 0.25s ease, opacity 0.25s ease",
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Menú desplegable — only móvil */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            backgroundColor: "var(--color-primary)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 0 16px",
            animation: "slideDown 0.2s ease",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      display: "block",
                      padding: "14px 24px",
                      fontSize: "16px",
                      fontWeight: isActive ? "500" : "400",
                      color: isActive
                        ? "#F7F5F2"
                        : "var(--color-primary-light)",
                      textDecoration: "none",
                      borderLeft: isActive
                        ? "3px solid #F7F5F2"
                        : "3px solid transparent",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
