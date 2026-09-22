import type { Metadata } from 'next'
import {
  config,
  negocio,
  servicios,
  ciudades,
  faqs,
  testimonios,
  garantias,
  buildLocalBusinessSchema,
  buildFaqSchema,
  buildWhatsAppUrl,
  buildTelUrl,
} from '@/lib/config'

export const metadata: Metadata = {
  title: config.seo.home.title,
  description: config.seo.home.meta_desc,
  alternates: {
    canonical: negocio.dominio + '/',
  },
}

export default function HomePage() {
  const schema = buildLocalBusinessSchema()
  const faqSchema = buildFaqSchema(faqs)
  const telUrl = buildTelUrl()
  const waUrl = buildWhatsAppUrl()

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-label">
              {negocio.ciudad_principal} · {negocio.provincia}
            </span>

            <h1 className="hero-h1">{config.seo.home.h1}</h1>

            <p className="hero-desc">
              Presupuesto gratuito en menos de 24 horas, sin visita previa. Más
              de {negocio.servicios_realizados} trabajos completados en{' '}
              {negocio.ciudad_principal} y provincia.
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
                  color: 'var(--color-texto)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                Solicitar presupuesto
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <p className="stat-number">{negocio.servicios_realizados}+</p>
                <p className="stat-label">trabajos realizados</p>
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
            <p className="lead-form-title">Presupuesto gratuito</p>
            <p className="lead-form-subtitle">
              Sin compromiso. Respuesta en menos de 24h.
            </p>
            <LeadForm negocioNombre={negocio.nombre} />
          </aside>
        </div>
      </section>

      {/* ── Servicios ── */}
      <section className="section" aria-labelledby="servicios-title">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" id="servicios-title">
              Servicios de pintura en {negocio.ciudad_principal}
            </h2>
            <p className="section-desc">
              Trabajamos en interiores, exteriores y comunidades de propietarios.
              Materiales de primera calidad incluidos en el presupuesto.
            </p>
          </div>

          <div className="services-grid">
            {servicios.map((servicio) => (
              <a
                key={servicio.slug}
                href={`/${servicio.slug}/`}
                className="service-card"
              >
                <p className="service-card-name">{servicio.nombre}</p>
                <p className="service-card-desc">{servicio.descripcion_corta}</p>
                <span className="service-card-link">Ver servicio</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Garantías ── */}
      <section className="section" aria-labelledby="garantias-title">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" id="garantias-title">
              Por qué confiar en {negocio.nombre}
            </h2>
          </div>
          <ul className="garantias-list" role="list">
            {garantias.map((g, i) => (
              <li key={i} className="garantia-item">
                <CheckIcon className="garantia-check" />
                <span className="garantia-text">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="section" aria-labelledby="testimonios-title">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" id="testimonios-title">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="testimonios-grid">
            {testimonios.map((t, i) => (
              <article key={i} className="testimonio-card">
                <div className="testimonio-stars" aria-label={`${t.estrellas} de 5 estrellas`}>
                  {'★'.repeat(t.estrellas)}
                </div>
                <p className="testimonio-text">"{t.texto}"</p>
                <div>
                  <p className="testimonio-author">{t.nombre}</p>
                  <p className="testimonio-location">
                    {t.barrio}, {t.ciudad} · {t.servicio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zonas ── */}
      <section className="section" aria-labelledby="zonas-title">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" id="zonas-title">
              Pintores en {negocio.provincia} y municipios
            </h2>
            <p className="section-desc">
              Cubrimos {negocio.ciudad_principal} y los municipios de la
              provincia sin coste de desplazamiento.
            </p>
          </div>
          <div className="ciudades-grid">
            {ciudades.map((ciudad) => (
              <a
                key={ciudad.slug}
                href={`/${servicios[0].slug}/${ciudad.slug}/`}
                className="ciudad-card"
              >
                <p className="ciudad-card-nombre">
                  {negocio.nicho_singular.charAt(0).toUpperCase() +
                    negocio.nicho_singular.slice(1)}{' '}
                  en {ciudad.nombre}
                </p>
                <p className="ciudad-card-desc">{ciudad.descripcion_local}</p>
                <span className="ciudad-card-link">Ver zona</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" id="faq-title">
              Preguntas frecuentes sobre pintura en {negocio.ciudad_principal}
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <p className="faq-question">{faq.pregunta}</p>
                <p className="faq-answer">{faq.respuesta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section
        style={{
          padding: '80px 0',
          backgroundColor: 'var(--color-superficie)',
          borderTop: '1px solid var(--color-borde)',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              maxWidth: '28ch',
              lineHeight: 1.2,
            }}
          >
            ¿Necesitas un pintor en {negocio.ciudad_principal}?
          </h2>
          <p style={{ color: 'var(--color-texto-suave)', maxWidth: '52ch' }}>
            Llámanos ahora o solicita tu presupuesto por WhatsApp. Respondemos
            en {negocio.tiempo_respuesta}.
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

// ─── Lead Form (Server Component → Client form via action) ───────────────────

function LeadForm({ negocioNombre }: { negocioNombre: string }) {
  return (
    <form className="lead-form" action="/api/lead" method="POST">
      <input type="hidden" name="negocio" value={negocioNombre} />
      <input type="hidden" name="pagina" value="home" />

      <div className="form-field">
        <label className="form-label" htmlFor="nombre">
          Nombre
        </label>
        <input
          className="form-input"
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Tu nombre"
          autoComplete="name"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="telefono">
          Teléfono
        </label>
        <input
          className="form-input"
          type="tel"
          id="telefono"
          name="telefono"
          placeholder="600 000 000"
          autoComplete="tel"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="mensaje">
          Describe el trabajo
        </label>
        <textarea
          className="form-textarea"
          id="mensaje"
          name="mensaje"
          placeholder="Piso de 90m², pintura interior, dos habitaciones..."
          rows={3}
        />
      </div>

      <button type="submit" className="btn-primary">
        Solicitar presupuesto gratis
      </button>

      <p className="form-privacy">
        Sin compromiso. Tus datos no se comparten con terceros.{' '}
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
