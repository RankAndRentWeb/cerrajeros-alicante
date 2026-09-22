import type { SiteConfig, Ciudad, Servicio } from '@/types/config'
import rawConfig from '@/config/site.config.json'

// Cast once at the boundary. All consumers get full types.
export const config: SiteConfig = rawConfig as SiteConfig

// ─── Convenience accessors ──────────────────────────────────────────────────

export const negocio = config.negocio
export const diseno = config.diseno
export const servicios = config.servicios
export const ciudades = config.ciudades
export const faqs = config.faqs
export const testimonios = config.testimonios
export const garantias = config.garantias

// ─── Route helpers (used by generateStaticParams) ───────────────────────────

export function getCiudadBySlug(slug: string): Ciudad | undefined {
  return config.ciudades.find((c) => c.slug === slug)
}

export function getServicioBySlug(slug: string): Servicio | undefined {
  return config.servicios.find((s) => s.slug === slug)
}

export function getAllCiudadSlugs(): string[] {
  return config.ciudades.map((c) => c.slug)
}

export function getAllServicioSlugs(): string[] {
  return config.servicios.map((s) => s.slug)
}

// ─── URL builders ────────────────────────────────────────────────────────────

export function buildWhatsAppUrl(): string {
  const mensaje = encodeURIComponent(config.negocio.whatsapp_mensaje)
  return `https://wa.me/${config.negocio.whatsapp}?text=${mensaje}`
}

export function buildTelUrl(): string {
  return `tel:${config.negocio.telefono}`
}

// ─── Schema.org JSON-LD builders ─────────────────────────────────────────────

export function buildLocalBusinessSchema(ciudad?: Ciudad) {
  const { negocio: n, schema } = config

  const areaServed = ciudad
    ? { '@type': 'City', name: ciudad.nombre }
    : config.ciudades.map((c) => ({ '@type': 'City', name: c.nombre }))

  const openingHours: object[] = [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: n.horario.semana.abre,
      closes: n.horario.semana.cierra,
    },
  ]

  if (n.horario.sabado) {
    openingHours.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: n.horario.sabado.abre,
      closes: n.horario.sabado.cierra,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': schema.type,
    '@id': `${n.dominio}/#local-business`,
    name: n.nombre,
    url: n.dominio,
    telephone: n.telefono,
    email: n.email,
    priceRange: schema.price_range,
    image: `${n.dominio}${diseno.logo_url}`,
    description: config.seo.home.meta_desc,
    areaServed,
    address: {
      '@type': 'PostalAddress',
      addressLocality: n.ciudad_principal,
      addressRegion: n.provincia,
      addressCountry: n.pais,
      postalCode: n.direccion.cp,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: n.coordenadas.lat,
      longitude: n.coordenadas.lon,
    },
    openingHoursSpecification: openingHours,
    ...(schema.same_as.length > 0 && { sameAs: schema.same_as }),
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildFaqSchema(faqItems: { pregunta: string; respuesta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.respuesta,
      },
    })),
  }
}
