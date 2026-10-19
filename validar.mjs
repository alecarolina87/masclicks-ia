import fs from "fs";

/**
 * Comprobación estructural de la landing.
 *
 * No sustituye a mirarla con los ojos, pero sí pilla lo que se escapa al
 * editar HTML a mano: una etiqueta sin cerrar, un enlace del menú que apunta a
 * una sección que ya no existe, un JSON-LD roto.
 *
 * Se deja en el repositorio a propósito: `node validar.mjs` antes de publicar.
 */

const archivo = process.argv[2] || "diseno-web.html";
const t = fs.readFileSync(archivo, "utf8");
const cuerpo = t.slice(t.indexOf("<body"), t.indexOf("</body>"));

let fallo = false;

// ── Etiquetas balanceadas ───────────────────────────────────────────────────
const ETIQUETAS = ["section", "div", "a", "ul", "li", "details", "form", "p", "h2", "h3"];

for (const et of ETIQUETAS) {
  const abren = (cuerpo.match(new RegExp("<" + et + "(?=[\\s>])", "g")) || []).length;
  const cierran = (cuerpo.match(new RegExp("</" + et + ">", "g")) || []).length;
  const ok = abren === cierran;
  if (!ok) fallo = true;
  console.log(
    `${ok ? "  OK " : "  !! "} ${et.padEnd(8)} ${String(abren).padStart(3)} abren · ${String(cierran).padStart(3)} cierran`,
  );
}

// ── Los enlaces del menú llevan a algún sitio ───────────────────────────────
const ids = new Set([...cuerpo.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
const rotas = [...cuerpo.matchAll(/href="#([^"]+)"/g)]
  .map((m) => m[1])
  .filter((a) => !ids.has(a));

if (rotas.length) fallo = true;
console.log("\nAnclas rotas:", rotas.length ? [...new Set(rotas)].join(", ") : "ninguna");

// ── Los datos estructurados siguen siendo JSON válido ───────────────────────
// Un schema roto es peor que no tenerlo: Google lo descarta entero y sin avisar.
const bloques = [...t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
for (const [i, b] of bloques.entries()) {
  try {
    console.log(`  OK  schema ${i + 1} · ${JSON.parse(b[1])["@type"]}`);
  } catch (e) {
    fallo = true;
    console.log(`  !!  schema ${i + 1} · roto: ${e.message}`);
  }
}

// ── Recuento de lo que debe haber ───────────────────────────────────────────
console.log("\nSecciones:", [...cuerpo.matchAll(/<section[^>]*id="([^"]+)"/g)].map((m) => m[1]).join(" · "));
console.log("Tarjetas de portfolio:", (cuerpo.match(/class="port__card"/g) || []).length);
console.log("Planes:", (cuerpo.match(/class="plan__name"/g) || []).length);
console.log("Preguntas:", (cuerpo.match(/<details/g) || []).length);
console.log("Enlaces a WhatsApp:", (cuerpo.match(/data-wa\b/g) || []).length);

process.exit(fallo ? 1 : 0);
