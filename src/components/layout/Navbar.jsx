"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/armario", label: "Armario" },
  { href: "/outfits", label: "Outfits" },
  { href: "/circular", label: "Circular" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header style={{ backgroundColor: "var(--color-primary)" }}>
      <nav
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#F7F5F2",
            textDecoration: "none",
            letterSpacing: "0.12em",
          }}
        >
          SENDA
        </Link>

        {/* Links */}
        <ul
          style={{
            display: "flex",
            gap: "32px",
            listStyle: "none",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontSize: "14px",
                    fontWeight: isActive ? "500" : "400",
                    color: isActive ? "#F7F5F2" : "var(--color-primary-light)",
                    textDecoration: "none",
                    borderBottom: isActive ? "1.5px solid #F7F5F2" : "none",
                    paddingBottom: "2px",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
