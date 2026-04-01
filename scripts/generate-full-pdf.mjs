import puppeteer from "puppeteer";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const chaptersDir = resolve(
  root,
  "src/content/ebooks/ia-para-contadores"
);
const imagesDir = resolve(root, "public/ebook/ia-para-contadores");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function imgToBase64(filename) {
  const abs = resolve(imagesDir, filename);
  try {
    const buf = readFileSync(abs);
    const ext = filename.endsWith(".webp") ? "webp" : "png";
    return `data:image/${ext};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function loadChapters() {
  const files = readdirSync(chaptersDir).filter((f) => f.endsWith(".md"));
  const chapters = files.map((f) => {
    const raw = readFileSync(resolve(chaptersDir, f), "utf-8");
    const { data, content } = matter(raw);
    return { ...data, content, file: f };
  });
  chapters.sort((a, b) => a.chapter - b.chapter);
  return chapters;
}

function mdToHtml(md) {
  // Strip HTML comments (<!-- ... -->)
  const cleaned = md.replace(/<!--[\s\S]*?-->/g, "");
  return marked.parse(cleaned);
}

function stripFirstH1(html) {
  // Remove the first <h1>…</h1> since we render our own chapter header
  return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "");
}

// ---------------------------------------------------------------------------
// Build chapter images map
// ---------------------------------------------------------------------------

const chapterImages = {};
for (let i = 0; i <= 17; i++) {
  const key = String(i).padStart(2, "0");
  chapterImages[i] = imgToBase64(`cap-${key}.webp`);
}

// ---------------------------------------------------------------------------
// Load all chapters
// ---------------------------------------------------------------------------

const allChapters = loadChapters();
const mainChapters = allChapters.filter((c) => c.chapter <= 17);
const appendices = allChapters.filter((c) => c.chapter >= 18);

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

function tocNumber(ch) {
  if (ch.chapter === 0) return "Intro";
  if (ch.chapter >= 18) return ["A", "B", "C"][ch.chapter - 18];
  return String(ch.chapter).padStart(2, "0");
}

function tocTitle(ch) {
  return ch.title
    .replace(/^Capítulo \d+:\s*/, "")
    .replace(/^Introducción:\s*/, "")
    .replace(/^Apéndice [ABC]:\s*/, "");
}

const tocMainHtml = mainChapters
  .map(
    (ch) => `
  <div class="toc-item">
    <span class="toc-num">${tocNumber(ch)}</span>
    <span class="toc-title">${tocTitle(ch)}</span>
  </div>`
  )
  .join("\n");

const tocAppendicesHtml = appendices
  .map(
    (ch) => `
  <div class="toc-item">
    <span class="toc-num">${tocNumber(ch)}</span>
    <span class="toc-title">${tocTitle(ch)}</span>
  </div>`
  )
  .join("\n");

// ---------------------------------------------------------------------------
// Chapter HTML blocks
// ---------------------------------------------------------------------------

function chapterHtml(ch) {
  const img = chapterImages[ch.chapter];
  const body = stripFirstH1(mdToHtml(ch.content));
  const imgTag = img
    ? `<img class="chapter-img" src="${img}" alt="${ch.title}">`
    : "";

  return `
<div class="chapter">
  <div class="chapter-header">
    ${imgTag}
    <h1>${ch.title}</h1>
    <p class="chapter-desc">${ch.description}</p>
  </div>
  ${body}
</div>`;
}

function appendixHtml(ch) {
  const body = stripFirstH1(mdToHtml(ch.content));
  return `
<div class="chapter">
  <div class="chapter-header">
    <h1>${ch.title}</h1>
    <p class="chapter-desc">${ch.description}</p>
  </div>
  ${body}
</div>`;
}

const chaptersHtml = mainChapters.map(chapterHtml).join("\n");
const appendicesHtml = appendices.map(appendixHtml).join("\n");

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
    font-size: 32pt;
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
    padding: 6pt 0;
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
    font-size: 11pt;
    color: #404040;
    flex: 1;
  }
  .toc-section-label {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 3pt;
    color: #a3a3a3;
    margin-top: 16pt;
    margin-bottom: 4pt;
  }

  /* --- Chapter pages --- */
  .chapter {
    page-break-before: always;
  }
  .chapter-header {
    text-align: center;
    margin-bottom: 32pt;
    padding-bottom: 16pt;
  }
  .chapter-img {
    max-width: 280pt;
    max-height: 200pt;
    margin: 0 auto 20pt;
    display: block;
  }
  .chapter h1 {
    font-size: 22pt;
    font-weight: 700;
    line-height: 1.3;
    color: #171717;
    margin-bottom: 8pt;
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

  /* --- Code blocks (for prompt examples) --- */
  pre {
    margin: 12pt 0;
    padding: 14pt 16pt;
    background: #fafafa;
    border: 0.5pt solid #e5e5e5;
    font-family: "SF Mono", "Consolas", "Liberation Mono", monospace;
    font-size: 9pt;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  code {
    font-family: "SF Mono", "Consolas", "Liberation Mono", monospace;
    font-size: 9.5pt;
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
    font-size: 10pt;
  }
  th, td {
    border: 0.5pt solid #d4d4d4;
    padding: 6pt 8pt;
    text-align: left;
  }
  th {
    background: #fafafa;
    font-weight: 600;
  }

  /* --- Takeaway boxes --- */
  .takeaway {
    margin-top: 20pt;
    padding: 14pt 16pt;
    background: #fafafa;
    border: 0.5pt solid #e5e5e5;
  }
  .takeaway h3 {
    margin-top: 0;
    font-size: 11pt;
  }
  .takeaway ul {
    margin: 6pt 0 0 16pt;
  }
  .takeaway li {
    font-size: 10.5pt;
    margin-bottom: 4pt;
  }

  /* --- Footer --- */
  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 8pt;
    color: #a3a3a3;
    padding-bottom: 20pt;
  }
</style>
</head>
<body>

<!-- ==================== COVER ==================== -->
<div class="cover">
  <p class="label">Ebook</p>
  <h1>IA para Contadores</h1>
  <p class="subtitle">No te reemplaza la IA, te reemplaza el contador que la usa bien</p>
  <p class="author">Israel Castro</p>
</div>

<!-- ==================== TOC ==================== -->
<div class="toc-page">
  <h2>Contenido</h2>
  ${tocMainHtml}
  <p class="toc-section-label">Ap&eacute;ndices</p>
  ${tocAppendicesHtml}
</div>

<!-- ==================== CHAPTERS ==================== -->
${chaptersHtml}

<!-- ==================== APPENDICES ==================== -->
${appendicesHtml}

<!-- ==================== BACK PAGE ==================== -->
<div class="chapter" style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:80vh;text-align:center;">
  <p style="font-size:11pt;color:#525252;max-width:360pt;margin-bottom:24pt;line-height:1.8;">
    Gracias por leer.<br>
    Si este libro te fue &uacute;til, hazle un favor a un colega y cu&eacute;ntale del libro.
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

const outputPath = resolve(root, "ia-para-contadores.pdf");
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
