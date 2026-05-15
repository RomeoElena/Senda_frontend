"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <main>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-logo-container">
              <Image
                src="/logo.png"
                alt="Senda Logo"
                width={180}
                height={180}
                className="hero-logo"
                priority
              />
            </div>

            <h1 className="hero-title">
              Tu armario,
              <br />
              digitalizado
            </h1>

            <p className="hero-subtitle">
              Gestiona tus prendas de forma inteligente, crea looks únicos y
              contribuye a un consumo más consciente y sostenible
            </p>

            <Link href="/armario/nueva" className="hero-cta">
              Crear mi armario
              <span className="arrow">→</span>
            </Link>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">1</div>
              <h3 className="feature-title">Digitaliza</h3>
              <p className="feature-description">
                Fotografía cada prenda y crea tu armario digital completo
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">2</div>
              <h3 className="feature-title">Combina</h3>
              <p className="feature-description">
                Crea outfits perfectos y guarda tus looks favoritos
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">3</div>
              <h3 className="feature-title">Optimiza</h3>
              <p className="feature-description">
                Aprovecha al máximo lo que tienes y reduce el consumo
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
