import puppeteer from "puppeteer";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const promptsRoot = resolve(
  root,
  "../monetize-projects/prompts-contadores"
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mdToHtml(md) {
  const cleaned = md.replace(/<!--[\s\S]*?-->/g, "");
  return marked.parse(cleaned);
}

function readPromptFile(relPath) {
  return readFileSync(resolve(promptsRoot, relPath), "utf-8");
}

function stripFirstH1(html) {
  return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "");
}

// ---------------------------------------------------------------------------
// Content structure
// ---------------------------------------------------------------------------

const categories = [
  {
    num: 1,
    title: "An&aacute;lisis Fiscal",
    files: [
      "01-analisis-fiscal/01-revision-cfdi.md",
      "01-analisis-fiscal/02-lista-69b.md",
      "01-analisis-fiscal/03-planeacion-fiscal.md",
      "01-analisis-fiscal/04-conciliacion-contable-fiscal.md",
      "01-analisis-fiscal/05-cartas-invitacion-sat.md",
      "01-analisis-fiscal/06-resumen-miscelanea.md",
    ],
  },
  {
    num: 2,
    title: "An&aacute;lisis Financiero",
    files: [
      "02-analisis-financiero/01-estados-financieros.md",
      "02-analisis-financiero/02-razones-financieras.md",
      "02-analisis-financiero/03-flujo-efectivo.md",
      "02-analisis-financiero/04-presupuesto-anual.md",
    ],
  },
  {
    num: 3,
    title: "N&oacute;mina e IMSS",
    files: [
      "03-nomina-imss/01-salario-base-cotizacion.md",
      "03-nomina-imss/02-prima-riesgo-trabajo.md",
      "03-nomina-imss/03-liquidacion-finiquito.md",
      "03-nomina-imss/04-reconciliacion-sua-idse.md",
      "03-nomina-imss/05-isn-por-estado.md",
    ],
  },
  {
    num: 4,
    title: "Comunicaci&oacute;n con Clientes",
    files: [
      "04-comunicacion/01-correo-profesional-clientes.md",
      "04-comunicacion/02-propuesta-servicios.md",
      "04-comunicacion/03-explicacion-impuestos-simple.md",
      "04-comunicacion/04-recordatorio-cobro.md",
    ],
  },
  {
    num: 5,
    title: "Productividad del Despacho",
    files: [
      "05-productividad/01-expedientes-digitales.md",
      "05-productividad/02-checklist-cierre-mensual.md",
      "05-productividad/03-automatizacion-reportes.md",
      "05-productividad/04-vencimientos-obligaciones.md",
      "05-productividad/05-minutas-reunion.md",
    ],
  },
  {
    num: 6,
    title: "Bonus",
    files: [
      "06-bonus/01-meta-prompt-crear-propios.md",
    ],
  },
];

// ---------------------------------------------------------------------------
// Build TOC
// ---------------------------------------------------------------------------

function extractTitle(md) {
  const match = md.match(/^#\s+(.+)$/m);
  return match ? match[1] : "Sin título";
}

let promptCounter = 0;
const tocEntries = [];
const chapterBlocks = [];

// Intro
const introMd = readPromptFile("00-introduccion.md");
const introTitle = "Gu&iacute;a r&aacute;pida: C&oacute;mo usar estos prompts";
tocEntries.push({ num: "Intro", title: introTitle, isCategoryHeader: false });
chapterBlocks.push(`
<div class="chapter">
  <div class="chapter-header">
    <h1>${introTitle}</h1>
  </div>
  ${stripFirstH1(mdToHtml(introMd))}
</div>`);

// Categories and prompts
for (const cat of categories) {
  tocEntries.push({
    num: "",
    title: `${cat.num}. ${cat.title}`,
    isCategoryHeader: true,
  });

  for (const file of cat.files) {
    promptCounter++;
    const md = readPromptFile(file);
    const title = extractTitle(md);
    const numStr = String(promptCounter).padStart(2, "0");

    tocEntries.push({ num: numStr, title, isCategoryHeader: false });

    chapterBlocks.push(`
<div class="chapter">
  <div class="chapter-header">
    <p class="prompt-number">Prompt #${promptCounter}</p>
    <h1>${title}</h1>
  </div>
  ${stripFirstH1(mdToHtml(md))}
</div>`);
  }
}

// Bonus guide excluded — bonus-video-guia-avanzada.md is internal marketing content

// ---------------------------------------------------------------------------
// TOC HTML
// ---------------------------------------------------------------------------

const tocHtml = tocEntries
  .map((e) => {
    if (e.isCategoryHeader) {
      return `<p class="toc-section-label">${e.title}</p>`;
    }
    return `
  <div class="toc-item">
    <span class="toc-num">${e.num}</span>
    <span class="toc-title">${e.title}</span>
  </div>`;
  })
  .join("\n");

// ---------------------------------------------------------------------------
// Full HTML
// ---------------------------------------------------------------------------

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900&display=swap" rel="stylesheet">
<style>
  @page {
    size: Letter;
    margin: 60pt 50pt 60pt 50pt;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Source Serif 4", Georgia, serif;
    font-size: 11pt;
    line-height: 1.7;
    color: #262626;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* --- Cover page --- */
  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    padding: 0 40pt;
  }
  .cover .label {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 4pt;
    color: #737373;
    margin-bottom: 16pt;
  }
  .cover h1 {
    font-size: 28pt;
    font-weight: 700;
    line-height: 1.2;
    color: #171717;
    margin-bottom: 8pt;
  }
  .cover .subtitle {
    font-size: 13pt;
    font-style: italic;
    color: #525252;
    margin-bottom: 32pt;
    max-width: 420pt;
    text-align: center;
  }
  .cover .author {
    font-size: 11pt;
    color: #737373;
  }
  .cover .prompt-count {
    margin-top: 32pt;
    display: inline-block;
    padding: 6pt 18pt;
    border: 1pt solid #d4d4d4;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 2pt;
    color: #737373;
  }

  /* --- TOC page --- */
  .toc-page {
    page-break-after: always;
  }
  .toc-page h2 {
    font-size: 20pt;
    font-weight: 600;
    margin-bottom: 24pt;
    color: #171717;
  }
  .toc-item {
    display: flex;
    align-items: baseline;
    gap: 10pt;
    padding: 5pt 0;
    border-bottom: 0.5pt solid #e5e5e5;
  }
  .toc-num {
    font-size: 9pt;
    color: #a3a3a3;
    width: 28pt;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }
  .toc-title {
    font-size: 10.5pt;
    color: #404040;
    flex: 1;
  }
  .toc-section-label {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 3pt;
    color: #a3a3a3;
    margin-top: 14pt;
    margin-bottom: 2pt;
  }

  /* --- Chapter pages --- */
  .chapter {
    page-break-before: always;
  }
  .chapter-header {
    text-align: center;
    margin-bottom: 28pt;
    padding-bottom: 14pt;
    border-bottom: 0.5pt solid #e5e5e5;
  }
  .prompt-number {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 3pt;
    color: #a3a3a3;
    margin-bottom: 8pt;
  }
  .chapter h1 {
    font-size: 20pt;
    font-weight: 700;
    line-height: 1.3;
    color: #171717;
    margin-bottom: 6pt;
  }
  .chapter-desc {
    font-size: 10pt;
    font-style: italic;
    color: #737373;
    max-width: 380pt;
    margin: 0 auto;
  }

  /* --- Content typography --- */
  h2 {
    font-size: 15pt;
    font-weight: 600;
    color: #171717;
    margin-top: 24pt;
    margin-bottom: 10pt;
  }
  h3 {
    font-size: 13pt;
    font-weight: 600;
    color: #171717;
    margin-top: 20pt;
    margin-bottom: 8pt;
  }
  h4 {
    font-size: 11.5pt;
    font-weight: 600;
    color: #171717;
    margin-top: 16pt;
    margin-bottom: 6pt;
  }
  p {
    margin-bottom: 10pt;
    text-align: justify;
    hyphens: auto;
  }
  strong { font-weight: 600; }
  em { font-style: italic; }
  blockquote {
    margin: 16pt 0;
    padding: 12pt 16pt;
    background: #fafafa;
    border-left: 3pt solid #d4d4d4;
    font-size: 10.5pt;
    color: #404040;
  }
  blockquote p { margin-bottom: 4pt; }
  blockquote p:last-child { margin-bottom: 0; }
  ul, ol {
    margin: 10pt 0 10pt 20pt;
  }
  li {
    margin-bottom: 6pt;
  }
  hr {
    border: none;
    border-top: 0.5pt solid #d4d4d4;
    margin: 24pt 0;
  }
  a {
    color: #262626;
    text-decoration: underline;
    text-decoration-color: #a3a3a3;
  }

  /* --- Code blocks (prompts) --- */
  pre {
    margin: 12pt 0;
    padding: 14pt 16pt;
    background: #fafafa;
    border: 0.5pt solid #e5e5e5;
    font-family: "SF Mono", "Consolas", "Liberation Mono", monospace;
    font-size: 8.5pt;
    line-height: 1.55;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  code {
    font-family: "SF Mono", "Consolas", "Liberation Mono", monospace;
    font-size: 9pt;
    background: #f5f5f5;
    padding: 1pt 3pt;
  }
  pre code {
    background: none;
    padding: 0;
    font-size: inherit;
  }

  /* --- Tables --- */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 9.5pt;
  }
  th, td {
    border: 0.5pt solid #d4d4d4;
    padding: 5pt 7pt;
    text-align: left;
  }
  th {
    background: #fafafa;
    font-weight: 600;
  }
</style>
</head>
<body>

<!-- ==================== COVER ==================== -->
<div class="cover">
  <p class="label">Pack de Prompts</p>
  <h1>Prompts de Productividad para Contadores Mexicanos</h1>
  <p class="subtitle">25 prompts listos para copiar, pegar y usar con ChatGPT, Claude o cualquier herramienta de IA</p>
  <p class="author">Israel Castro</p>
  <p class="prompt-count">25 prompts &bull; 5 categor&iacute;as &bull; 1 bonus</p>
</div>

<!-- ==================== TOC ==================== -->
<div class="toc-page">
  <h2>Contenido</h2>
  ${tocHtml}
</div>

<!-- ==================== CONTENT ==================== -->
${chapterBlocks.join("\n")}

<!-- ==================== BACK PAGE ==================== -->
<div class="chapter" style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:80vh;text-align:center;">
  <p style="font-size:11pt;color:#525252;max-width:360pt;margin-bottom:24pt;line-height:1.8;">
    Gracias por tu compra.<br>
    Si estos prompts te ahorran tiempo, hazle un favor a un colega y cu&eacute;ntale del pack.
  </p>
  <p style="font-size:11pt;color:#737373;">columna13.club</p>
</div>

</body>
</html>`;

// ---------------------------------------------------------------------------
// Generate PDF
// ---------------------------------------------------------------------------

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle2", timeout: 120_000 });

const outputPath = resolve(root, "prompts-contadores.pdf");
await page.pdf({
  path: outputPath,
  format: "Letter",
  printBackground: true,
  margin: {
    top: "0.83in",
    bottom: "0.83in",
    left: "0.69in",
    right: "0.69in",
  },
});

await browser.close();
console.log(`PDF generated: ${outputPath}`);
