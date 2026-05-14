"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/armario", label: "Armario" },
  { href: "/outfits", label: "Outfits" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/circular", label: "Circular" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
        position: "sticky",
        top: 0,
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
        <Link
          href="/"
          style={{
            textDecoration: "none",
          }}
        >
          <span
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

        <ul className="nav-links-desktop">
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

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="hamburger-btn"
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

      {menuOpen && (
        <div className="mobile-menu">
          <ul>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={isActive ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
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
