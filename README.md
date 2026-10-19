# MasClicks IA

Sitio de MasClicks IA: webs con reservas, contenido para redes sociales y campañas
en Meta Ads para clínicas dentales y de estética en España.

🔗 **[servicios-digitales-black.vercel.app](https://servicios-digitales-black.vercel.app/)**

## Páginas

### [`web.html`](web.html) — Web + Reservas

Landing para clínicas que necesitan una web que convierta. El hero muestra la web
de ortodoncia de Clínica Dental One haciendo scroll en ordenador y en móvil, y una
galería explica qué partes de esa web ayudan a que el paciente reserve.

### [`contenido.html`](contenido.html) — Contenido y Meta Ads

Landing de los planes de contenido para redes (Presencia, Crecimiento y Marca) y de
la gestión de Meta Ads. Hero con vídeo de fondo, portafolio real de Dental One (reels,
carruseles y la serie de Mola) y ejemplos de medicina estética marcados como
contenido de muestra.

### Otras páginas

- [`index.html`](index.html) y [`diseno-web.html`](diseno-web.html): versiones anteriores
  del sitio, pendientes de sustituir por las landings nuevas.
- [Aviso legal](aviso-legal.html) y [política de privacidad](politica-privacidad.html).

## Pendiente antes del lanzamiento

- [ ] Datos del titular en el aviso legal y la política de privacidad.
- [ ] IDs de GA4 y del Pixel de Meta (bloque comentado en el `<head>` de cada landing).
- [ ] Convertir `web.html` en la portada y quitar el `noindex` de las dos landings.

## Detalles técnicos

Sitio estático: HTML semántico, CSS propio ([`assets/clinicas.css`](assets/clinicas.css))
y JavaScript mínimo ([`assets/clinicas.js`](assets/clinicas.js)) para los vídeos, el
formulario (abre WhatsApp con el mensaje ya escrito) y la medición. Sin dependencias
ni proceso de compilación. `node validar.mjs web.html` comprueba la estructura antes
de publicar.

Los vídeos de `media/` ya están comprimidos para web; los originales y los documentos
internos se quedan en local (ver `.gitignore` y `.vercelignore`).

Desplegado en Vercel.
