export interface Horario {
  abre: string
  cierra: string
}

export interface Coordenadas {
  lat: number
  lon: number
}

export interface Direccion {
  calle: string | null
  cp: string
  ciudad: string
  provincia: string
  pais: string
}

export interface Negocio {
  nombre: string
  nombre_corto: string
  nicho: string
  nicho_singular: string
  ciudad_principal: string
  provincia: string
  pais: string
  telefono: string
  telefono_display: string
  whatsapp: string
  whatsapp_mensaje: string
  email: string
  dominio: string
  direccion: Direccion
  coordenadas: Coordenadas
  horario: {
    semana: Horario
    sabado: Horario | null
    domingo: Horario | null
  }
  tiempo_respuesta: string
  anos_experiencia: number
  servicios_realizados: number
}

export interface Diseno {
  color_fondo: string
  color_superficie: string
  color_borde: string
  color_texto: string
  color_texto_suave: string
  color_acento: string
  color_acento_hover: string
  fuente_principal: string
  logo_url: string
}

export interface SeoMeta {
  title: string
  h1: string
  meta_desc: string
  keywords?: string[]
}

export interface Servicio {
  slug: string
  nombre: string
  descripcion_corta: string
  descripcion: string
  icono: string
  seo: SeoMeta
}

export interface Ciudad {
  slug: string
  nombre: string
  provincia: string
  lat: number
  lon: number
  descripcion_local: string
  barrios_destacados: string[]
  cp_principales: string[]
}

export interface FAQ {
  pregunta: string
  respuesta: string
}

export interface Testimonio {
  nombre: string
  ciudad: string
  barrio: string
  texto: string
  estrellas: number
  servicio: string
}

export interface SchemaConfig {
  type: string
  price_range: string
  same_as: string[]
}

export interface SiteConfig {
  negocio: Negocio
  diseno: Diseno
  seo: {
    home: SeoMeta
  }
  servicios: Servicio[]
  ciudades: Ciudad[]
  faqs: FAQ[]
  testimonios: Testimonio[]
  garantias: string[]
  schema: SchemaConfig
}
