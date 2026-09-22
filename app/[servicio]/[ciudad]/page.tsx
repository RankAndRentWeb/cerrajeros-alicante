import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  config,
  negocio,
  getCiudadBySlug,
  getServicioBySlug,
  getAllCiudadSlugs,
  getAllServicioSlugs,
  buildLocalBusinessSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWhatsAppUrl,
  buildTelUrl,
  faqs,
  garantias,
} from '@/lib/config'

// ─── Static params: generates one page per [servicio]/[ciudad] combination ───

export function generateStaticParams() {
  const params: { servicio: string; ciudad: string }[] = []

  for (const servicio of getAllServicioSlugs()) {
    for (const ciudad of getAllCiudadSlugs()) {
      params.push({ servicio, ciudad })
    }
  }

  return params
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicio: string; ciudad: string }>
}): Promise<Metadata> {
  const { servicio: servicioSlug, ciudad: ciudadSlug } = await params

  const servicio = getServicioBySlug(servicioSlug)
  const ciudad = getCiudadBySlug(ciudadSlug)

  if (!servicio || !ciudad) return {}

  // Override SEO copy for city pages: inject city name into service SEO
  const title = `${servicio.seo.title.replace('Valencia', ciudad.nombre)}`
  const description = `${servicio.seo.meta_desc.replace(/en Valencia/g, `en ${ciudad.nombre}`)}`
  const canonicalUrl = `${negocio.dominio}/${servicioSlug}/${ciudadSlug}/`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CiudadServicioPage({
  params,
}: {
  params: Promise<{ servicio: string; ciudad: string }>
}) {
  const { servicio: servicioSlug, ciudad: ciudadSlug } = await params

  const servicio = getServicioBySlug(servicioSlug)
  const ciudad = getCiudadBySlug(ciudadSlug)

  if (!servicio || !ciudad) notFound()

  const h1 = `${servicio.seo.h1.replace(/en Valencia/g, `en ${ciudad.nombre}`)}`
  const canonicalUrl = `${negocio.dominio}/${servicioSlug}/${ciudadSlug}/`
  const telUrl = buildTelUrl()
  const waUrl = buildWhatsAppUrl()

  // Schemas
  const localBusinessSchema = buildLocalBusinessSchema(ciudad)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Inicio', url: `${negocio.dominio}/` },
    { name: servicio.nombre, url: `${negocio.dominio}/${servicioSlug}/` },
    { name: ciudad.nombre, url: canonicalUrl },
  ])
  const faqSchema = buildFaqSchema(faqs.slice(0, 3))

  // Other services for internal linking
  const otrosServicios = config.servicios.filter((s) => s.slug !== servicioSlug)

  // Other cities for internal linking
  const otrasCiudades = config.ciudades.filter((c) => c.slug !== ciudadSlug)

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <div className="container">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <a href="/">Inicio</a>
            </li>
            <li className="breadcrumb-sep" aria-hidden="true">/</li>
            <li className="breadcrumb-item">
              <a href={`/${servicioSlug}/`}>{servicio.nombre}</a>
            </li>
            <li className="breadcrumb-sep" aria-hidden="true">/</li>
            <li className="breadcrumb-item" aria-current="page">
              {ciudad.nombre}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-label">
              {servicio.nombre} · {ciudad.nombre}, {ciudad.provincia}
            </span>

            <h1 className="hero-h1">{h1}</h1>

            <p className="hero-desc">
              Servicio profesional de {servicio.nombre.toLowerCase()} en{' '}
              {ciudad.nombre}. {ciudad.descripcion_local} Presupuesto gratuito
              en menos de 24 horas.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href={telUrl} className="btn-primary" style={{ width: 'auto', paddingInline: '32px' }}>
                <PhoneIcon />
                {negocio.telefono_display}
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  border: '1px solid var(--color-borde)',
                  fontSize: '0.94rem',
                  fontWeight: 500,
                }}
              >
                Solicitar por WhatsApp
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <p className="stat-number">{negocio.servicios_realizados}+</p>
                <p className="stat-label">trabajos en {negocio.provincia}</p>
              </div>
              <div>
                <p className="stat-number">{negocio.anos_experiencia}</p>
                <p className="stat-label">años de experiencia</p>
              </div>
              <div>
                <p className="stat-number">{negocio.tiempo_respuesta}</p>
                <p className="stat-label">tiempo de respuesta</p>
              </div>
            </div>
          </div>

          {/* Lead form */}
          <aside className="lead-form-card">
            <p className="lead-form-title">Presupuesto en {ciudad.nombre}</p>
            <p className="lead-form-subtitle">Gratis y sin compromiso. En 24h.</p>
            <LeadForm
              negocioNombre={negocio.nombre}
              pagina={`${servicioSlug}/${ciudadSlug}`}
              ciudad={ciudad.nombre}
            />
          </aside>
        </div>
      </section>

      {/* ── Descripción del servicio ── */}
      <section className="section" aria-labelledby="servicio-desc-title">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <h2 className="section-title" id="servicio-desc-title">
                {servicio.nombre} en {ciudad.nombre}
              </h2>
              <p style={{ marginTop: '20px', color: 'var(--color-texto-suave)', lineHeight: 1.7 }}>
                {servicio.descripcion}
              </p>
              {ciudad.barrios_destacados.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <p style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: '12px' }}>
                    Barrios y zonas donde trabajamos en {ciudad.nombre}:
                  </p>
                  <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {ciudad.barrios_destacados.map((barrio) => (
                      <li
                        key={barrio}
                        style={{
                          padding: '4px 12px',
                          border: '1px solid var(--color-borde)',
                          fontSize: '0.82rem',
                          color: 'var(--color-texto-suave)',
                        }}
                      >
                        {barrio}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Garantías en la página de ciudad */}
            <ul className="garantias-list" role="list">
              {garantias.map((g, i) => (
                <li key={i} className="garantia-item">
                  <CheckIcon className="garantia-check" />
                  <span className="garantia-text">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" aria-labelledby="faq-ciudad-title">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" id="faq-ciudad-title">
              Preguntas sobre {servicio.nombre.toLowerCase()} en {ciudad.nombre}
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <p className="faq-question">
                  {faq.pregunta.replace('Valencia', ciudad.nombre)}
                </p>
                <p className="faq-answer">
                  {faq.respuesta.replace(/Valencia/g, ciudad.nombre)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal linking: otros servicios ── */}
      {otrosServicios.length > 0 && (
        <section className="section" aria-labelledby="otros-servicios-title">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" id="otros-servicios-title">
                Otros servicios en {ciudad.nombre}
              </h2>
            </div>
            <div className="services-grid">
              {otrosServicios.map((s) => (
                <a key={s.slug} href={`/${s.slug}/${ciudadSlug}/`} className="service-card">
                  <p className="service-card-name">{s.nombre} en {ciudad.nombre}</p>
                  <p className="service-card-desc">{s.descripcion_corta}</p>
                  <span className="service-card-link">Ver servicio</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Internal linking: otras ciudades ── */}
      {otrasCiudades.length > 0 && (
        <section className="section" aria-labelledby="otras-ciudades-title">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" id="otras-ciudades-title">
                {servicio.nombre} en otros municipios
              </h2>
            </div>
            <div className="ciudades-grid">
              {otrasCiudades.map((c) => (
                <a key={c.slug} href={`/${servicioSlug}/${c.slug}/`} className="ciudad-card">
                  <p className="ciudad-card-nombre">{servicio.nombre} en {c.nombre}</p>
                  <p className="ciudad-card-desc">{c.descripcion_local}</p>
                  <span className="ciudad-card-link">Ver zona</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      <section
        style={{
          padding: '80px 0',
          backgroundColor: 'var(--color-superficie)',
          borderTop: '1px solid var(--color-borde)',
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              maxWidth: '28ch',
              lineHeight: 1.2,
            }}
          >
            ¿Necesitas {negocio.nicho_singular} en {ciudad.nombre}?
          </h2>
          <p style={{ color: 'var(--color-texto-suave)', maxWidth: '52ch' }}>
            Respondemos en {negocio.tiempo_respuesta}. Presupuesto gratuito, sin
            desplazamiento.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href={telUrl} className="btn-primary" style={{ width: 'auto', paddingInline: '32px' }}>
              <PhoneIcon />
              {negocio.telefono_display}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                border: '1px solid var(--color-borde)',
                fontSize: '0.94rem',
                fontWeight: 500,
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

// ─── Lead Form ────────────────────────────────────────────────────────────────

function LeadForm({
  negocioNombre,
  pagina,
  ciudad,
}: {
  negocioNombre: string
  pagina: string
  ciudad: string
}) {
  return (
    <form className="lead-form" action="/api/lead" method="POST">
      <input type="hidden" name="negocio" value={negocioNombre} />
      <input type="hidden" name="pagina" value={pagina} />
      <input type="hidden" name="ciudad_origen" value={ciudad} />

      <div className="form-field">
        <label className="form-label" htmlFor={`nombre-${pagina}`}>
          Nombre
        </label>
        <input
          className="form-input"
          type="text"
          id={`nombre-${pagina}`}
          name="nombre"
          placeholder="Tu nombre"
          autoComplete="name"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={`telefono-${pagina}`}>
          Teléfono
        </label>
        <input
          className="form-input"
          type="tel"
          id={`telefono-${pagina}`}
          name="telefono"
          placeholder="600 000 000"
          autoComplete="tel"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor={`mensaje-${pagina}`}>
          Describe el trabajo
        </label>
        <textarea
          className="form-textarea"
          id={`mensaje-${pagina}`}
          name="mensaje"
          placeholder={`Trabajo de pintura en ${ciudad}...`}
          rows={3}
        />
      </div>

      <button type="submit" className="btn-primary">
        Solicitar presupuesto gratis
      </button>

      <p className="form-privacy">
        Sin compromiso.{' '}
        <a href="/politica-privacidad/">Política de privacidad.</a>
      </p>
    </form>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
