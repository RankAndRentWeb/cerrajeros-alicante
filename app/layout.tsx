import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { config, negocio, diseno, buildWhatsAppUrl, buildTelUrl } from '@/lib/config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(negocio.dominio),
  title: {
    default: config.seo.home.title,
    template: `%s | ${negocio.nombre}`,
  },
  description: config.seo.home.meta_desc,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: negocio.dominio,
    siteName: negocio.nombre,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const telUrl = buildTelUrl()
  const waUrl = buildWhatsAppUrl()

  return (
    <html lang="es" className={inter.className}>
      <head>
        {/* CSS variables injected from config — zero hardcoded values in CSS */}
        <style>{`
          :root {
            --color-fondo: ${diseno.color_fondo};
            --color-superficie: ${diseno.color_superficie};
            --color-borde: ${diseno.color_borde};
            --color-texto: ${diseno.color_texto};
            --color-texto-suave: ${diseno.color_texto_suave};
            --color-acento: ${diseno.color_acento};
            --color-acento-hover: ${diseno.color_acento_hover};
          }
        `}</style>
      </head>
      <body>
        <Header telUrl={telUrl} />
        <main>{children}</main>
        <Footer waUrl={waUrl} telUrl={telUrl} />
        <FloatingCTA telUrl={telUrl} waUrl={waUrl} />
      </body>
    </html>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ telUrl }: { telUrl: string }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="logo" aria-label={`${negocio.nombre} – Inicio`}>
          <span className="logo-text">{negocio.nombre}</span>
        </a>

        <nav aria-label="Navegación principal">
          <ul className="nav-list">
            {config.servicios.map((s) => (
              <li key={s.slug}>
                <a href={`/${s.slug}/`} className="nav-link">
                  {s.nombre}
                </a>
              </li>
            ))}
            <li>
              <a href="/contacto/" className="nav-link">
                Contacto
              </a>
            </li>
          </ul>
        </nav>

        <a href={telUrl} className="header-tel" aria-label={`Llamar al ${negocio.telefono_display}`}>
          {negocio.telefono_display}
        </a>
      </div>
    </header>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ waUrl, telUrl }: { waUrl: string; telUrl: string }) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <p className="footer-brand">{negocio.nombre}</p>
          <p className="footer-desc">
            Servicio de pintura profesional en {negocio.ciudad_principal} y provincia.
            Más de {negocio.anos_experiencia} años de experiencia.
          </p>
        </div>

        <div className="footer-col">
          <p className="footer-label">Servicios</p>
          <ul className="footer-list">
            {config.servicios.map((s) => (
              <li key={s.slug}>
                <a href={`/${s.slug}/`}>{s.nombre}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-label">Zonas</p>
          <ul className="footer-list">
            {config.ciudades.map((c) => (
              <li key={c.slug}>
                <a href={`/${config.servicios[0].slug}/${c.slug}/`}>
                  {negocio.nicho_singular.charAt(0).toUpperCase() + negocio.nicho_singular.slice(1)} en {c.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-label">Contacto</p>
          <a href={telUrl} className="footer-tel">
            {negocio.telefono_display}
          </a>
          <a href={waUrl} className="footer-wa" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <p className="footer-email">{negocio.email}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            © {year} {negocio.nombre}. Todos los derechos reservados.
          </p>
          <nav aria-label="Navegación legal">
            <a href="/aviso-legal/">Aviso legal</a>
            <a href="/politica-privacidad/">Privacidad</a>
            <a href="/cookies/">Cookies</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

// ─── Floating CTA (mobile-first conversion element) ──────────────────────────

function FloatingCTA({ telUrl, waUrl }: { telUrl: string; waUrl: string }) {
  return (
    <div className="floating-cta" role="complementary" aria-label="Contacto rápido">
      <a href={waUrl} className="floating-btn floating-btn--wa" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
        <WhatsAppIcon />
      </a>
      <a href={telUrl} className="floating-btn floating-btn--tel" aria-label={`Llamar al ${negocio.telefono_display}`}>
        <PhoneIcon />
        <span>Llamar ahora</span>
      </a>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
