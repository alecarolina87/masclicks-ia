# MasClicks IA

Sitio de MasClicks IA, agencia especializada en agentes de WhatsApp con IA para
clínicas de medicina estética. Dos landings orientadas a conversión, cada una
con su propia propuesta de valor y su llamada a la acción.

🔗 **[servicios-digitales-black.vercel.app](https://servicios-digitales-black.vercel.app/)**

## Páginas

### [`index.html`](index.html) — Agente de WhatsApp con IA

Landing principal. Titular: *"Deja de perder citas: tu WhatsApp ahora agenda por ti"*.

Recorre el problema, la solución, una comparativa, cómo funciona, los planes,
los resultados, las opiniones y las preguntas frecuentes, y cierra con una
demo. La estructura está pensada para resolver objeciones en orden antes de
pedir la acción.

### [`diseno-web.html`](diseno-web.html) — Diseño web y landing pages

Segunda línea de servicio: problema, servicios, proceso, portfolio, por qué
nosotros, precios, testimonios, preguntas frecuentes y contacto.

### Páginas legales

[Aviso legal](aviso-legal.html) y [política de privacidad](politica-privacidad.html).

## Pendiente antes del lanzamiento

- [ ] Sustituir los testimonios de la portada, marcados como *"Pendiente de reemplazar"*.
- [ ] Rellenar el campo de email, que aún muestra el marcador `[TU_EMAIL]`.

## Detalles técnicos

Sitio estático: HTML semántico, CSS propio ([`assets/theme.css`](assets/theme.css)
compartido y [`assets/legal.css`](assets/legal.css) para las páginas legales) y
JavaScript mínimo. Sin dependencias ni proceso de compilación.

Incluye metadatos Open Graph y datos estructurados en JSON-LD. Las URLs
canónicas apuntan al despliegue actual de Vercel; si el sitio pasa a un dominio
propio, hay que actualizarlas en `index.html` y `diseno-web.html`.

Desplegado en Vercel.
