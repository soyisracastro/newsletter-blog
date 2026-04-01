import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function imgToBase64(relPath) {
  const abs = resolve(root, "public", relPath.replace(/^\//, ""));
  const buf = readFileSync(abs);
  const ext = relPath.endsWith(".webp") ? "webp" : "png";
  return `data:image/${ext};base64,${buf.toString("base64")}`;
}

const cap00 = imgToBase64("ebook/ia-para-contadores/cap-00.webp");
const cap01 = imgToBase64("ebook/ia-para-contadores/cap-01.webp");
const cap02 = imgToBase64("ebook/ia-para-contadores/cap-02.webp");

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
    max-width: 340pt;
  }
  .cover .author {
    font-size: 11pt;
    color: #737373;
  }
  .cover .preview-badge {
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
  .toc-locked {
    color: #a3a3a3;
    font-style: italic;
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

  /* Preview watermark */
  .preview-watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 72pt;
    color: rgba(0,0,0,0.03);
    font-weight: 700;
    pointer-events: none;
    z-index: -1;
    white-space: nowrap;
  }
</style>
</head>
<body>

<div class="preview-watermark">PREVIEW</div>

<!-- ==================== COVER ==================== -->
<div class="cover">
  <p class="label">Ebook</p>
  <h1>IA para Contadores</h1>
  <p class="subtitle">No te reemplaza la IA, te reemplaza el contador que la usa bien</p>
  <p class="author">Israel Castro</p>
  <p class="preview-badge">Preview &mdash; Primeros 2 cap&iacute;tulos</p>
</div>

<!-- ==================== TOC ==================== -->
<div class="toc-page">
  <h2>Contenido</h2>

  <div class="toc-item">
    <span class="toc-num">Intro</span>
    <span class="toc-title">Por qu&eacute; este libro existe</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">01</span>
    <span class="toc-title">La IA no es lo que crees que es</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">02</span>
    <span class="toc-title">No todos los modelos son iguales</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">03</span>
    <span class="toc-title toc-locked">C&oacute;mo aprende la IA</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">04</span>
    <span class="toc-title toc-locked">Lo que cuesta hablarle</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">05</span>
    <span class="toc-title toc-locked">La IA solo sabe lo que le cuentas</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">06</span>
    <span class="toc-title toc-locked">La diferencia entre adivinar y razonar</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">07</span>
    <span class="toc-title toc-locked">Temperatura y creatividad</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">08</span>
    <span class="toc-title toc-locked">El manual para la IA</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">09</span>
    <span class="toc-title toc-locked">Darle la informaci&oacute;n correcta</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">10</span>
    <span class="toc-title toc-locked">Cuando la IA no sabe</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">11</span>
    <span class="toc-title toc-locked">Few-shot, zero-shot</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">12</span>
    <span class="toc-title toc-locked">La IA no tiene RFC</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">13</span>
    <span class="toc-title toc-locked">Poderosa como inocente</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">14</span>
    <span class="toc-title toc-locked">Sesgo, &eacute;tica, responsabilidad</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">15</span>
    <span class="toc-title toc-locked">Ojo con la automatizaci&oacute;n</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">16</span>
    <span class="toc-title toc-locked">Qu&eacute; s&iacute; puedes hacer hoy</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">17</span>
    <span class="toc-title toc-locked">El contador que usa IA vs el que no</span>
  </div>

  <p class="toc-section-label">Ap&eacute;ndices</p>
  <div class="toc-item">
    <span class="toc-num">A</span>
    <span class="toc-title toc-locked">Glosario</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">B</span>
    <span class="toc-title toc-locked">Recursos</span>
  </div>
  <div class="toc-item">
    <span class="toc-num">C</span>
    <span class="toc-title toc-locked">Prompts muestra</span>
  </div>
</div>

<!-- ==================== INTRODUCCION ==================== -->
<div class="chapter">
  <div class="chapter-header">
    <img class="chapter-img" src="${cap00}" alt="Introducci&oacute;n">
    <h1>Introducci&oacute;n: Por qu&eacute; este libro existe</h1>
    <p class="chapter-desc">Lo que me hubiera gustado leer cuando empec&eacute; a usar IA en mi despacho. Sin tecnicismos, sin promesas vac&iacute;as.</p>
  </div>

  <h2>Quiero contarte una historia</h2>
  <p>Un d&iacute;a estaba viendo un video en YouTube. Era uno de esos videos t&eacute;cnicos sobre fundamentos de inteligencia artificial, orientado a programadores. El presentador explicaba conceptos como <em>tokens, modelos de lenguaje, temperatura, ventanas de contexto</em>. Y mientras lo ve&iacute;a, tuve una de esas epifan&iacute;as que te cambian la perspectiva: &laquo;<strong>Esto es exactamente lo que necesitan saber los contadores. Y nadie se los est&aacute; explicando</strong>.&raquo;</p>
  <p>Me llamo Israel Castro. Soy contador p&uacute;blico mexicano y, por azares del destino y una gran curiosidad por saber c&oacute;mo funcionan las computadoras, tambi&eacute;n soy programador. Soy co-fundador de S I Castro Consultores, una firma contable que lleva operando por m&aacute;s de 15 a&ntilde;os, y creador de la marca TodoConta, un proyecto que me ha tra&iacute;do hasta aqu&iacute; pasando por crear contenido, art&iacute;culos y varios productos digitales a lo largo de mi vida profesional.</p>
  <p>Llevo a&ntilde;os haciendo algo que a muchos les parece raro: combinar contabilidad con tecnolog&iacute;a. No soy investigador de inteligencia artificial. No trabajo en un laboratorio de Silicon Valley. Soy un profesionista que se sienta frente a su computadora todos los d&iacute;as a hacer declaraciones, revisar estados financieros y atender clientes. La diferencia es que llevo un buen rato usando herramientas de IA para hacerlo mejor y m&aacute;s r&aacute;pido.</p>
  <p>Despu&eacute;s de ver ese video, empec&eacute; a escribir sobre el tema en mi newsletter. Quer&iacute;a traducir esos conceptos t&eacute;cnicos al lenguaje de los contadores. Explicar qu&eacute; es un <em>token</em> sin que sonara a clase de ingenier&iacute;a. Contar c&oacute;mo uso la IA en mi despacho sin que pareciera ciencia ficci&oacute;n. La respuesta me sorprendi&oacute;. Recib&iacute; m&aacute;s correos, m&aacute;s preguntas y m&aacute;s comentarios que con cualquier otro tema que hubiera tocado antes. Hab&iacute;a tocado un nervio.</p>
  <p>Este libro es el resultado de todo eso.</p>
  <p>Compila, expande y organiza lo que aprend&iacute;, lo que prob&eacute;, lo que funcion&oacute; y lo que no. No es un tratado acad&eacute;mico. Es lo que me hubiera gustado leer cuando empec&eacute;.</p>

  <h2>Para qui&eacute;n es este libro</h2>
  <p>Si eres contador y nunca has tocado una herramienta de IA, este libro es para ti. Tal vez piensas que la inteligencia artificial es magia negra, o que es una moda pasajera, o que va a quitarte el trabajo ma&ntilde;ana. O quiz&aacute; crees que necesitas fundamentos antes de empezar a moverle, que necesitas entender qu&eacute; est&aacute; pasando realmente, sin el sensacionalismo de los titulares.</p>
  <p>Si eres contador y ya has usado ChatGPT/Gemini/Claude o cualquier LLM un par de veces, este libro tambi&eacute;n es para ti. Quiz&aacute; le pediste que te escribiera un correo, te gust&oacute; el resultado y ahora piensas que ya dominas el tema.</p>
  <p>Te tengo noticias: hay mucho que no sabes. Y no lo digo con arrogancia, porque yo tampoco lo s&eacute; todo. Nadie lo sabe. Ni siquiera las personas que est&aacute;n construyendo estas herramientas entienden completamente c&oacute;mo funcionan. Eso deber&iacute;a darte humildad y curiosidad a partes iguales.</p>
  <p>La brecha entre los contadores que entienden la IA y los que no se est&aacute; ampliando. No me refiero a que unos van a perder su trabajo y otros no. Me refiero a que unos van a trabajar mejor, m&aacute;s r&aacute;pido, con menos errores y con m&aacute;s tiempo para lo que realmente importa. Y los otros van a seguir haciendo todo a mano, pregunt&aacute;ndose por qu&eacute; sus colegas terminan antes.</p>

  <h2>Lo que este libro NO es</h2>
  <p>Necesito ser honesto contigo desde el principio para que no haya falsas expectativas.</p>
  <p><strong>No es un manual de ChatGPT.</strong> No voy a ense&ntilde;arte d&oacute;nde est&aacute; cada bot&oacute;n ni c&oacute;mo configurar tu cuenta. Las herramientas cambian cada semana. Para cuando leas esto, probablemente la interfaz ya sea diferente. Lo que no cambia son los conceptos. Si entiendes c&oacute;mo funcionan los modelos de lenguaje, puedes usar cualquier herramienta que salga ma&ntilde;ana.</p>
  <p><strong>No es un libro de programaci&oacute;n.</strong> No vas a ver una sola l&iacute;nea de c&oacute;digo. Cero. Nada. Si alguna vez alguien te dijo que necesitas saber programar para usar IA, te minti&oacute;. Ayuda, claro. Pero no es requisito.</p>
  <p><strong>No es una promesa de que la IA va a hacer tu trabajo.</strong> La IA no va a preparar tus declaraciones sola. No va a firmar tus dict&aacute;menes. No va a sentarse con tu cliente a explicarle por qu&eacute; debe m&aacute;s impuestos de los que esperaba. Lo que s&iacute; va a hacer es ayudarte a llegar a esas reuniones mejor preparado, con mejor informaci&oacute;n y habiendo invertido menos tiempo en tareas repetitivas.</p>

  <h2>C&oacute;mo leer este libro</h2>
  <p>El libro tiene 5 partes y 17 cap&iacute;tulos cortos. Puedes leerlo en un fin de semana si te lo propones. Cada cap&iacute;tulo est&aacute; dise&ntilde;ado para funcionar por s&iacute; solo, pero se construyen uno sobre otro. Mi recomendaci&oacute;n es que lo leas en orden la primera vez y despu&eacute;s regreses a los cap&iacute;tulos que m&aacute;s te interesaron.</p>
  <p>Al final de varios cap&iacute;tulos vas a encontrar una secci&oacute;n que se llama &laquo;Pru&eacute;balo t&uacute; mismo&raquo;. Son ejercicios pr&aacute;cticos, opcionales pero recomendados. La IA se aprende us&aacute;ndola, no leyendo sobre ella. Es como aprender a nadar: puedes leer cincuenta libros sobre t&eacute;cnica de nado, pero hasta que no te metas al agua, no sabes nadar.</p>
  <p>Al final del libro hay un glosario con todos los t&eacute;rminos t&eacute;cnicos que uso. Si en alg&uacute;n momento lees una palabra que no entiendes, ve al Ap&eacute;ndice A. Est&aacute; ah&iacute; para eso.</p>

  <h2>La prueba de la chela</h2>
  <p>S&eacute; que solo un friki habla de estos temas mientras se toma una cerveza, pero aqu&iacute; estamos. As&iacute; que te propongo un reto que voy a llamar &laquo;<em>la prueba de la chela</em>&raquo;.</p>
  <p>Cuando termines este libro, imagina que est&aacute;s en una reuni&oacute;n con colegas. Tal vez en una comida despu&eacute;s de una capacitaci&oacute;n del IMCP, o en una cena con compa&ntilde;eros de la universidad. Alguien menciona la inteligencia artificial. Si en ese momento puedes explicar con tus propias palabras qu&eacute; es un token, qu&eacute; es una alucinaci&oacute;n y por qu&eacute; la estructura de un prompt importa, mientras te tomas una cerveza tranquilamente, misi&oacute;n cumplida.</p>
  <p>No necesitas sonar como ingeniero. No necesitas impresionar a nadie con terminolog&iacute;a rebuscada. Solo necesitas poder explicarlo de forma clara, sencilla y correcta.</p>
  <p>Eso es lo que busca este libro.</p>

  <h2>Antes de empezar</h2>
  <p>Quiero pedirte algo. Mientras leas, mant&eacute;n la mente abierta pero no tanto que se te caiga el cerebro. La IA no es ni el salvador de la profesi&oacute;n contable ni su verdugo. Es una herramienta. Una herramienta poderosa, imperfecta, en constante cambio y con un potencial enorme. Tu trabajo como contador no va a desaparecer. Pero s&iacute; va a cambiar. Y los que mejor entiendan c&oacute;mo y por qu&eacute;, van a estar en mejor posici&oacute;n.</p>
  <p>No te pido que aceptes sin cuestionar nada de lo que leas aqu&iacute;. Te pido que lo pruebes. Que experimentes. Que te equivoques. Que vuelvas a intentarlo. As&iacute; es como se aprende cualquier cosa que vale la pena.</p>
  <p>Nos vemos en el Cap&iacute;tulo 1.</p>
  <p><em>Isca</em></p>
</div>

<!-- ==================== CAPITULO 1 ==================== -->
<div class="chapter">
  <div class="chapter-header">
    <img class="chapter-img" src="${cap01}" alt="Cap&iacute;tulo 1">
    <h1>Cap&iacute;tulo 1: La IA no es lo que crees que es</h1>
    <p class="chapter-desc">Los LLM no piensan ni entienden: predicen. Entender esto es la diferencia entre usar bien o mal cualquier herramienta de IA.</p>
  </div>

  <p>Son las 11 de la noche de un martes. Est&aacute;s revisando las &uacute;ltimas conciliaciones del mes y te llega un WhatsApp de un cliente. Abres el mensaje y lees las primeras palabras: &laquo;Contador, el SAT me mand&oacute; una carta de...&raquo;</p>
  <p>No necesitas leer el resto. Tu cerebro ya complet&oacute; la frase. Ya sabes que viene algo que no te va a gustar. Ya est&aacute;s pensando en qu&eacute; tipo de carta es, qu&eacute; plazos tienes, qu&eacute; informaci&oacute;n vas a necesitar pedirle. Todo eso antes de terminar de leer el mensaje.</p>
  <p>Ahora imagina que pudieras hacer eso mismo, pero con miles de millones de textos le&iacute;dos, a una velocidad absurda, y sobre cualquier tema. Eso, en esencia, es lo que hace la inteligencia artificial que usamos hoy. No es magia. No es un cerebro digital. Es predicci&oacute;n a una escala que ning&uacute;n humano podr&iacute;a alcanzar.</p>

  <h2>La m&aacute;quina de predecir palabras</h2>
  <p>Cuando escuchas &laquo;inteligencia artificial&raquo;, probablemente piensas en robots, en Skynet, o en esa caja m&aacute;gica donde escribes algo y aparece una respuesta perfecta. Ninguna de las dos im&aacute;genes es correcta, y quedarte con cualquiera de ellas te va a hacer usar estas herramientas mal.</p>
  <p>La realidad es m&aacute;s simple y, cuando la entiendes, mucho m&aacute;s &uacute;til.</p>
  <p>Las herramientas de IA que usas hoy (ChatGPT, Claude, Gemini, Copilot, Grok y las que vengan ma&ntilde;ana) son en realidad LLMs: <strong>Large Language Models</strong>, o Modelos de Lenguaje Grande. Y hacen una sola cosa fundamental: predecir la siguiente palabra.</p>
  <p>As&iacute; es. T&uacute; escribes algo en el chat, y el modelo calcula, con base en miles de millones de patrones que aprendi&oacute; durante su entrenamiento, cu&aacute;l es la palabra m&aacute;s probable que deber&iacute;a seguir. Luego calcula la siguiente. Y la siguiente. Y la siguiente. Hasta que tienes un p&aacute;rrafo completo que parece escrito por alguien que sabe de lo que habla.</p>
  <p>No piensa. No entiende. No &laquo;sabe&raquo; nada en el sentido humano de la palabra.</p>
  <p>Predice.</p>
  <p>Regresemos al ejemplo del WhatsApp. Cuando le&iacute;ste &laquo;el SAT me mand&oacute; una carta de...&raquo;, tu cerebro hizo una predicci&oacute;n basada en tu experiencia: has visto cientos de cartas del SAT, sabes qu&eacute; tipo de clientes te escriben a las 11 de la noche, conoces el tono de urgencia. Toda esa experiencia acumulada te permiti&oacute; predecir el final antes de leerlo.</p>
  <p>Un LLM hace exactamente lo mismo, pero su &laquo;experiencia&raquo; son billones de palabras de texto: libros, art&iacute;culos, p&aacute;ginas web, documentos t&eacute;cnicos, foros, c&oacute;digo. Todo eso comprimido en patrones estad&iacute;sticos que le permiten generar texto coherente sobre pr&aacute;cticamente cualquier tema.</p>
  <blockquote>
    <p><strong>LLM (Large Language Model):</strong> Un programa que genera texto prediciendo la siguiente palabra m&aacute;s probable, bas&aacute;ndose en patrones aprendidos de enormes cantidades de texto. No piensa ni entiende; calcula probabilidades.</p>
  </blockquote>

  <h2>Por qu&eacute; la IA explot&oacute; justo ahora</h2>
  <p>Tal vez te preguntes: si la idea de predecir palabras suena tan simple, &iquest;por qu&eacute; no ten&iacute;amos esto hace diez o veinte a&ntilde;os?</p>
  <p>La respuesta corta es que necesit&aacute;bamos tres cosas al mismo tiempo y las tres tardaron d&eacute;cadas en llegar: poder de c&oacute;mputo absurdamente grande, cantidades obscenas de datos, y una arquitectura matem&aacute;tica que supiera qu&eacute; hacer con ambas cosas.</p>
  <p>Esa arquitectura lleg&oacute; en 2017, cuando un equipo de investigadores de Google public&oacute; un paper con un t&iacute;tulo que no le dec&iacute;a nada a nadie en ese momento: &laquo;Attention Is All You Need&raquo;. Ah&iacute; describieron los Transformers, la estructura que hoy usan pr&aacute;cticamente todos los modelos de lenguaje. No necesitas entender los detalles t&eacute;cnicos. Lo que importa es que esa pieza fue la que faltaba.</p>
  <p>En 2020, OpenAI lanz&oacute; GPT-3 y el mundo empez&oacute; a notar que algo hab&iacute;a cambiado. Un modelo de lenguaje que pod&iacute;a escribir ensayos, traducir idiomas, generar c&oacute;digo y mantener conversaciones coherentes. Era impresionante, pero todav&iacute;a era cosa de investigadores y programadores.</p>
  <p>El punto de quiebre real fue noviembre de 2022, con el lanzamiento de ChatGPT. De pronto, cualquier persona con acceso a internet pod&iacute;a conversar con un LLM. Y todo cambi&oacute;. En dos meses ten&iacute;a m&aacute;s de 100 millones de usuarios. Ninguna tecnolog&iacute;a en la historia hab&iacute;a crecido tan r&aacute;pido.</p>
  <p>Desde entonces, la curva ha sido vertical. Lo que hace un a&ntilde;o era el modelo m&aacute;s avanzado del mundo, hoy es superado por modelos que se ejecutan en tu tel&eacute;fono. Es como si en 2015 te hubieran dado una supercomputadora del a&ntilde;o 2000 y te dijeran &laquo;esto ahora cabe en tu bolsillo&raquo;. Eso es literalmente lo que est&aacute; pasando.</p>
  <p>Y esto importa para ti como contador porque significa que la IA que conoces hoy no es la IA que vas a usar en seis meses. Los conceptos que aprendas ahora van a seguir siendo v&aacute;lidos; las herramientas espec&iacute;ficas, no necesariamente. Por eso este libro se enfoca en conceptos y no en botones o herramientas espec&iacute;ficas.</p>

  <h2>El paisaje actual: qui&eacute;n es qui&eacute;n</h2>
  <p>Hoy hay varios jugadores importantes en el mundo de los LLMs, y vale la pena que los conozcas al menos de nombre, no porque debas casarte con alguno, sino porque vas a escucharlos constantemente y necesitas contexto.</p>
  <p><strong>OpenAI</strong> es la empresa detr&aacute;s de ChatGPT y los modelos GPT. Fueron los primeros en llevar esta tecnolog&iacute;a al p&uacute;blico general y siguen siendo los m&aacute;s conocidos. Sus modelos m&aacute;s recientes &mdash;la familia GPT-5 y la serie &laquo;o&raquo;&mdash; compiten directamente por los primeros lugares con los de Google y Anthropic, dependiendo de la tarea.</p>
  <p><strong>Anthropic</strong> cre&oacute; Claude. Se ha posicionado como referencia en razonamiento, c&oacute;digo y trabajo con textos largos. Si alguna vez sientes que un modelo &laquo;te entiende mejor&raquo; cuando le das instrucciones largas y detalladas, probablemente est&aacute;s usando Claude.</p>
  <p><strong>Google</strong> tiene Gemini, que integra directamente en su ecosistema: b&uacute;squeda, correo, documentos. Sus modelos m&aacute;s recientes han alcanzado los primeros lugares en pruebas de l&oacute;gica y razonamiento, y su ventaja adicional es que puede conectarse con toda la informaci&oacute;n que ya tienes en sus servicios.</p>
  <p><strong>Meta</strong> (la empresa detr&aacute;s de Facebook) tom&oacute; un camino diferente: sus modelos Llama son de c&oacute;digo abierto. Esto significa que cualquier empresa o desarrollador puede tomarlos, modificarlos y usarlos libremente. Esto ha democratizado el acceso a la tecnolog&iacute;a de maneras que nadie anticip&oacute;.</p>
  <p><strong>DeepSeek</strong>, desde China, se ha ganado un lugar ofreciendo modelos con la mejor relaci&oacute;n rendimiento-precio del mercado.</p>
  <p>Y hay m&aacute;s: Mistral desde Francia, y docenas de modelos especializados que aparecen cada semana. El punto no es que memorices esta lista &mdash;como veremos en el Cap&iacute;tulo 2, los modelos cambian constantemente&mdash;. El punto es que entiendas que no existe &laquo;la IA&raquo; como una sola cosa. Existen muchos modelos, de muchas empresas, con diferentes capacidades. Elegir cu&aacute;l usar es una decisi&oacute;n que importa.</p>

  <h2>Por qu&eacute; entender esto es m&aacute;s valioso que aprender cualquier herramienta</h2>
  <p>Aqu&iacute; est&aacute; la trampa en la que caen muchos: se obsesionan con aprender a usar una herramienta espec&iacute;fica. Memorizan d&oacute;nde est&aacute;n los men&uacute;s, qu&eacute; botones presionar, c&oacute;mo se ve la pantalla. Y cuando esa herramienta cambia su interfaz (que lo hace cada pocas semanas) o aparece una mejor, tienen que empezar de cero.</p>
  <p>Es como si en lugar de aprender contabilidad hubieras aprendido a usar un software espec&iacute;fico. El d&iacute;a que el SAT cambia su plataforma, el que aprendi&oacute; conceptos se adapta en una tarde. El que solo aprendi&oacute; a darle clic a los botones correctos entra en crisis.</p>
  <p>Con la IA pasa exactamente lo mismo. Si entiendes que un LLM es una m&aacute;quina de predicci&oacute;n que necesita contexto para darte buenas respuestas, ese conocimiento te sirve hoy con ChatGPT, ma&ntilde;ana con Claude, pasado con el que sea. El concepto no caduca. La interfaz s&iacute;.</p>

  <h2>En la pr&aacute;ctica</h2>
  <p>Piensa en Laura, contadora de un despacho mediano en Guadalajara. Laura necesita redactar una respuesta a un requerimiento del SAT por diferencias en la declaraci&oacute;n anual de ISR de un cliente persona moral.</p>
  <p>Si Laura cree que la IA &laquo;sabe&raquo; lo que necesita, abre el chat y escribe algo como: &laquo;<em>Hazme una respuesta para el SAT</em>&raquo;. El modelo predice las palabras m&aacute;s probables que siguen a esa instrucci&oacute;n tan vaga, y le genera una respuesta gen&eacute;rica, probablemente correcta en forma pero in&uacute;til en fondo. Sin el RFC, sin el ejercicio fiscal, sin el tipo de diferencia, sin el fundamento legal espec&iacute;fico. Laura se frustra y concluye que &laquo;la IA no sirve para cosas fiscales&raquo;.</p>
  <p>Pero si Laura entiende que el modelo es una m&aacute;quina de predicci&oacute;n, cambia su enfoque. Le da contexto: el tipo de requerimiento, el art&iacute;culo del CFF que lo fundamenta, la situaci&oacute;n espec&iacute;fica del cliente, el resultado que espera. Con ese contexto, el modelo puede predecir palabras que se alinean con lo que Laura realmente necesita. La respuesta no ser&aacute; perfecta. Laura todav&iacute;a tiene que revisarla, porque ella es la que firma y la que responde ante el SAT; pero ser&aacute; un borrador &uacute;til que le ahorra una hora de redacci&oacute;n.</p>
  <p>La diferencia no fue la herramienta. Fue entender c&oacute;mo funciona.</p>

  <h2>Mito vs. Realidad</h2>
  <p><strong>Mito:</strong> La IA entiende lo que le pides y piensa su respuesta como lo har&iacute;a un colega contador.</p>
  <p><strong>Realidad:</strong> La IA calcula la secuencia de palabras m&aacute;s probable dada tu instrucci&oacute;n. No entiende, no razona en el sentido humano, y no tiene experiencia profesional. Por eso la calidad de lo que le das determina la calidad de lo que recibes.</p>
  <p><strong>Mito:</strong> Si la IA me da una respuesta incorrecta, es porque la tecnolog&iacute;a todav&iacute;a no est&aacute; lista.</p>
  <p><strong>Realidad:</strong> En la mayor&iacute;a de los casos, una respuesta mediocre es resultado de una instrucci&oacute;n mediocre. Como veremos a lo largo de este libro, aprender a dar instrucciones precisas (lo que se conoce como prompting, tema que profundizamos a partir del Cap&iacute;tulo 8) marca toda la diferencia.</p>

  <hr>

  <div class="takeaway">
    <h3>Lo que te llevas</h3>
    <ul>
      <li><strong>La IA que usas hoy no piensa ni entiende:</strong> predice la siguiente palabra m&aacute;s probable con base en patrones aprendidos. Eso la hace poderosa, pero tambi&eacute;n predecible si sabes c&oacute;mo funciona.</li>
      <li><strong>Entender el concepto de c&oacute;mo funciona un LLM</strong> te da una ventaja que no caduca, a diferencia de aprender a usar una herramienta espec&iacute;fica que cambia su interfaz cada mes.</li>
      <li><strong>La calidad de lo que recibes de la IA</strong> depende directamente de la calidad del contexto que le das. Si le das instrucciones vagas, obtienes respuestas vagas.</li>
    </ul>
  </div>

  <h3>Pru&eacute;balo t&uacute; mismo</h3>
  <ol>
    <li>Abre cualquier modelo de lenguaje (ChatGPT, Claude, Gemini, el que tengas a la mano) y escr&iacute;bele algo vago relacionado con tu trabajo. Por ejemplo: &laquo;Expl&iacute;came el ISR&raquo;. Lee la respuesta y nota qu&eacute; tan gen&eacute;rica es.</li>
    <li>Ahora escr&iacute;bele lo mismo pero con contexto: &laquo;Expl&iacute;came c&oacute;mo se calcula el ISR mensual de un trabajador en M&eacute;xico que gana $25,000 pesos brutos, usando las tablas del Anexo 8 de la Resoluci&oacute;n Miscel&aacute;nea Fiscal vigente. Dame el procedimiento paso a paso.&raquo; Compara ambas respuestas.</li>
    <li>Reflexiona: la diferencia entre las dos respuestas no fue que el modelo &laquo;se esforz&oacute; m&aacute;s&raquo; la segunda vez. Fue que le diste mejor contexto para predecir las palabras correctas.</li>
  </ol>
</div>

<!-- ==================== CAPITULO 2 ==================== -->
<div class="chapter">
  <div class="chapter-header">
    <img class="chapter-img" src="${cap02}" alt="Cap&iacute;tulo 2">
    <h1>Cap&iacute;tulo 2: No todos los modelos son iguales</h1>
    <p class="chapter-desc">Par&aacute;metros, modelos frontier vs modelos peque&ntilde;os, benchmarks. C&oacute;mo elegir el modelo correcto para cada tarea.</p>
  </div>

  <p>Imag&iacute;nate que tienes una duda fiscal complicada. De esas que te quitan el sue&ntilde;o. Un cliente persona moral con operaciones en dos reg&iacute;menes, ingresos acumulables que no cuadran con los CFDI emitidos, y el SAT ya mand&oacute; un requerimiento citando el art&iacute;culo 42 del CFF.</p>
  <p>Tienes dos opciones para pedir una opini&oacute;n.</p>
  <p>La primera: le preguntas al practicante que lleva tres meses en el despacho. Acaba de salir de la universidad, tiene buena actitud, sabe lo b&aacute;sico. Te va a dar una respuesta. Tal vez hasta suene convincente.</p>
  <p>La segunda: se la planteas al socio de una firma con quince a&ntilde;os de experiencia en auditor&iacute;a fiscal. Ha visto cientos de casos como este, conoce los criterios del Tribunal Federal de Justicia Administrativa, sabe qu&eacute; argumentos funcionan y cu&aacute;les no.</p>
  <p>Los dos te van a responder. Pero la distancia entre ambas respuestas es enorme. Y t&uacute; lo sabes antes de preguntar.</p>
  <p>Con los modelos de IA pasa exactamente lo mismo. Todos se llaman &laquo;inteligencia artificial&raquo;. Todos tienen una cajita donde escribes y te responden. Pero por dentro son completamente distintos.</p>

  <h2>La experiencia acumulada de un modelo</h2>
  <p>En el Cap&iacute;tulo 1 vimos que un LLM es una m&aacute;quina de predicci&oacute;n de palabras. Ahora la pregunta es: qu&eacute; hace que un modelo prediga mejor que otro.</p>
  <p>La respuesta est&aacute; en los par&aacute;metros.</p>
  <p>Un par&aacute;metro es, en t&eacute;rminos muy simplificados, un valor num&eacute;rico que el modelo ajust&oacute; durante su entrenamiento. Piensa en cada par&aacute;metro como una peque&ntilde;a pieza de &laquo;experiencia&raquo; que el modelo acumul&oacute; al leer texto. Cuantos m&aacute;s par&aacute;metros tiene un modelo, m&aacute;s patrones pudo capturar, m&aacute;s matices puede distinguir, y m&aacute;s capacidad tiene para manejar situaciones complejas.</p>
  <p>Volvamos a la analog&iacute;a del despacho. El practicante de tres meses ha visto tal vez 50 declaraciones. El socio con quince a&ntilde;os ha visto miles. Cuando llega un caso raro, el practicante te da una respuesta basada en lo poco que ha visto. El socio reconoce el patr&oacute;n porque ya lo vivi&oacute; antes, quiz&aacute;s diez veces, en diferentes variantes. No es que sea m&aacute;s inteligente. Es que tiene m&aacute;s experiencia acumulada.</p>
  <p>Los par&aacute;metros son esa experiencia acumulada, pero medida en n&uacute;meros. Un modelo peque&ntilde;o puede tener unos pocos miles de millones de par&aacute;metros. Un modelo frontier puede tener cientos de miles de millones, o m&aacute;s (muchas empresas ya no publican el n&uacute;mero exacto, pero las diferencias en capacidad son evidentes).</p>
  <blockquote>
    <p><strong>Concepto Clave</strong></p>
    <p><strong>Par&aacute;metros:</strong> Los valores num&eacute;ricos que un modelo de IA ajusta durante su entrenamiento. Representan los patrones aprendidos. A mayor cantidad de par&aacute;metros, mayor capacidad del modelo para manejar tareas complejas, aunque no es el &uacute;nico factor que determina la calidad.</p>
  </blockquote>

  <h2>No solo es cuesti&oacute;n de tama&ntilde;o</h2>
  <p>Ahora, ser&iacute;a f&aacute;cil pensar que m&aacute;s par&aacute;metros siempre significa mejor modelo. Pero la realidad tiene m&aacute;s matices, igual que en un despacho.</p>
  <p>Un socio con quince a&ntilde;os de experiencia en auditor&iacute;a fiscal no necesariamente es el mejor para llevar un caso de derecho laboral. Tiene mucha experiencia, s&iacute;, pero en un &aacute;rea espec&iacute;fica. Lo mismo pasa con los modelos: c&oacute;mo fueron entrenados, con qu&eacute; datos, y qu&eacute; ajustes posteriores recibieron importa tanto como el tama&ntilde;o bruto.</p>
  <p>Adem&aacute;s, las empresas que desarrollan estos modelos han descubierto que con t&eacute;cnicas de entrenamiento m&aacute;s sofisticadas, modelos relativamente m&aacute;s peque&ntilde;os pueden rendir igual o mejor que modelos gigantes en ciertas tareas. Es como el contador joven que se especializ&oacute; a fondo en un tema y, en ese tema puntual, puede darle batalla al socio m&aacute;s experimentado.</p>
  <p>Dicho esto, para las tareas complejas que un contador enfrenta a diario &mdash;interpretar legislaci&oacute;n fiscal, analizar criterios normativos, redactar fundamentos legales&mdash;, los modelos con m&aacute;s capacidad siguen teniendo una ventaja clara. La diferencia se nota especialmente cuando la tarea requiere seguir instrucciones largas, mantener coherencia a lo largo de un documento extenso, o manejar m&uacute;ltiples variables al mismo tiempo.</p>

  <h2>Modelos frontier vs modelos peque&ntilde;os</h2>
  <p>En la industria se habla de &laquo;modelos frontier&raquo; para referirse a los modelos m&aacute;s capaces que existen en un momento dado. Son los que empujan los l&iacute;mites de lo que la IA puede hacer. Hoy, los modelos frontier incluyen los modelos m&aacute;s recientes de OpenAI, Claude de Anthropic, y Gemini de Google, entre otros.</p>
  <p>En el otro extremo est&aacute;n los modelos m&aacute;s peque&ntilde;os o ligeros. Algunos son gratuitos, otros son de c&oacute;digo abierto (como los modelos Llama de Meta), y muchos pueden correr en hardware mucho m&aacute;s modesto. No son malos. Simplemente est&aacute;n dise&ntilde;ados para tareas diferentes.</p>
  <blockquote>
    <p><strong>Concepto Clave</strong></p>
    <p><strong>Modelo frontier:</strong> El modelo de IA m&aacute;s avanzado disponible en un momento dado. Representa el estado del arte en capacidad, pero tambi&eacute;n suele ser el m&aacute;s costoso de usar. Lo que hoy es frontier, en seis meses puede ser superado.</p>
  </blockquote>
  <p>La clave est&aacute; en saber cu&aacute;ndo necesitas uno y cu&aacute;ndo necesitas el otro.</p>
  <p>Para redactar un correo sencillo de seguimiento a un cliente, un modelo peque&ntilde;o y gratuito probablemente te da un resultado perfectamente aceptable. Para analizar las implicaciones fiscales de una reestructura corporativa bajo los art&iacute;culos 14-B del CFF y 161 de la LISR, vas a querer el modelo m&aacute;s capaz que puedas usar. Pedirle al practicante que resuelva el caso de reestructura no es ser eficiente, es arriesgarte a un resultado que vas a tener que rehacer desde cero.</p>

  <h2>C&oacute;mo saber qu&eacute; modelo es mejor: benchmarks y LMArena</h2>
  <p>Aqu&iacute; es donde muchos contadores (y profesionistas en general) se pierden. Hay tantos modelos, con tantas versiones, que parece imposible saber cu&aacute;l es el &laquo;mejor&raquo;. Y la verdad es que no hay uno que sea el mejor para todo. Pero s&iacute; hay formas de evaluar y comparar.</p>
  <p>La industria usa lo que se llama benchmarks: pruebas estandarizadas que miden el desempe&ntilde;o de los modelos en diferentes tareas. Es como los ex&aacute;menes de certificaci&oacute;n para contadores. No te dicen todo sobre la capacidad de una persona, pero te dan un punto de referencia objetivo.</p>
  <p>Algunos benchmarks miden razonamiento matem&aacute;tico, otros miden comprensi&oacute;n de texto, otros miden capacidad de seguir instrucciones complejas, y otros miden conocimiento especializado. Un modelo puede ser excelente en razonamiento pero mediocre en seguimiento de instrucciones. Por eso no existe &laquo;el mejor modelo&raquo; en abstracto: depende de qu&eacute; necesitas que haga.</p>
  <p>Una herramienta particularmente &uacute;til es LMArena (anteriormente conocida como LMSYS Chatbot Arena). Funciona como un sistema de votaci&oacute;n donde personas reales interact&uacute;an con dos modelos al mismo tiempo, sin saber cu&aacute;l es cu&aacute;l, y eligen cu&aacute;l dio la mejor respuesta. Es como una cata a ciegas, pero de modelos de IA. El resultado es un ranking que refleja la preferencia humana real, no solo m&eacute;tricas t&eacute;cnicas.</p>
  <blockquote>
    <p><strong>Concepto Clave</strong></p>
    <p><strong>Benchmark:</strong> Una prueba estandarizada que mide el desempe&ntilde;o de un modelo de IA en tareas espec&iacute;ficas. Sirve como punto de referencia para comparar modelos, aunque ning&uacute;n benchmark captura toda la realidad de c&oacute;mo funciona un modelo en la pr&aacute;ctica.</p>
  </blockquote>
  <p>No necesitas convertirte en experto en benchmarks. Pero s&iacute; te conviene saber que existen, para que cuando alguien te diga &laquo;este modelo es el mejor&raquo; puedas preguntar: mejor para qu&eacute;, seg&uacute;n qu&eacute; medici&oacute;n, y desde cu&aacute;ndo.</p>

  <h2>El mapa de los modelos (que cambia cada semana)</h2>
  <blockquote>
    <p><strong>Nota importante:</strong> La siguiente informaci&oacute;n refleja el estado general del mercado y puede cambiar r&aacute;pidamente. Cons&iacute;d&eacute;rala una fotograf&iacute;a, no un mapa permanente.</p>
  </blockquote>
  <p>A grandes rasgos, las familias de modelos m&aacute;s relevantes hoy son:</p>
  <p><strong>GPT (OpenAI):</strong> La familia m&aacute;s conocida. Su modelo actual, <strong>GPT-5.4</strong>, ha integrado las capacidades de razonamiento de forma nativa. Es excelente en l&oacute;gica pura, programaci&oacute;n y seguimiento de instrucciones complejas. Sus versiones m&aacute;s potentes ahora manejan contextos de hasta un mill&oacute;n de tokens.</p>
  <p><strong>Claude (Anthropic):</strong> Es el favorito de muchos profesionistas por su tono natural y su precisi&oacute;n t&eacute;cnica. Con la llegada de <strong>Claude 4.6</strong>, su capacidad para manejar legislaci&oacute;n o contratos extensos se ha potenciado con el &laquo;Adaptive Thinking&raquo;, una funci&oacute;n donde el modelo se detiene a &laquo;pensar&raquo; y planificar antes de escribir.</p>
  <p><strong>Gemini (Google):</strong> Su gran ventaja es la multimodalidad y el ecosistema. Los modelos Gemini 3.1 no solo leen tus correos y documentos en Drive, sino que pueden procesar horas de video o miles de archivos PDF simult&aacute;neamente gracias a su ventana de contexto l&iacute;der en la industria.</p>
  <p><strong>Llama (Meta):</strong> El estandarte del c&oacute;digo abierto. <strong>Llama 4</strong> ha democratizado el acceso a modelos de nivel profesional. Es la opci&oacute;n preferida para quienes buscan privacidad total corriendo el modelo en servidores propios.</p>
  <p>Cada familia tiene m&uacute;ltiples versiones y tama&ntilde;os. Y cada pocas semanas aparecen actualizaciones que cambian el panorama. Por eso, como mencionamos en el Cap&iacute;tulo 1, vale m&aacute;s entender los conceptos que memorizar nombres de modelos.</p>

  <h2>La ecuaci&oacute;n costo vs calidad</h2>
  <p>Esto nos lleva a una realidad pr&aacute;ctica: los modelos m&aacute;s capaces cuestan m&aacute;s. No siempre en dinero directo (muchos ofrecen planes gratuitos limitados), pero s&iacute; en alguna combinaci&oacute;n de suscripci&oacute;n mensual, costo por uso, o l&iacute;mites de cu&aacute;nto puedes usarlos.</p>
  <p>Pi&eacute;nsalo como las herramientas de tu despacho. Puedes hacer una declaraci&oacute;n anual a mano con las tablas impresas del DOF. Funciona. Pero usas un software porque el tiempo que te ahorra justifica el costo. Con los modelos de IA es lo mismo: el costo de un modelo m&aacute;s capaz se justifica cuando el valor de la tarea lo amerita.</p>
  <p>La trampa en la que caen muchos es <strong>usar el modelo gratuito para todo y concluir que &laquo;la IA no sirve para cosas complejas&raquo;</strong>. Es como si un despacho le diera todos los clientes, incluidos los m&aacute;s grandes, al practicante de tres meses, y luego se quejara de que &laquo;el personal nuevo ya no viene preparado&raquo;.</p>
  <p>El mejor prompt del mundo, ejecutado en el modelo equivocado, te va a dar una respuesta mediocre. Es como tener la mejor receta de cocina y prepararla con ingredientes de mala calidad. La receta no es el problema. El ingrediente s&iacute;.</p>
  <p>Como veremos en el Cap&iacute;tulo 5, la forma en que le comunicas al modelo lo que necesitas es fundamental. Pero el modelo que elijas es el primer paso. Si la base es d&eacute;bil, ninguna instrucci&oacute;n, por brillante que sea, va a compensar.</p>

  <h2>En la pr&aacute;ctica</h2>
  <p>Carlos tiene un despacho en Monterrey. Usa un modelo gratuito para todo: desde redactar correos hasta analizar las implicaciones del art&iacute;culo 76 de la LISR para un cliente que realiza operaciones con partes relacionadas.</p>
  <p>Para los correos, funciona perfecto. El modelo le da un borrador limpio en segundos. Pero cuando le pide que analice si las operaciones de su cliente cumplen con los requisitos de documentaci&oacute;n de precios de transferencia conforme al art&iacute;culo 179 de la LISR, la respuesta es superficial, mezcla conceptos de diferentes jurisdicciones, y omite consideraciones clave como los m&eacute;todos establecidos en el art&iacute;culo 180.</p>
  <p>Carlos empieza a pensar que &laquo;la IA no sirve para temas fiscales complejos&raquo;. Pero lo que realmente pasa es que est&aacute; usando el practicante de tres meses para un caso que necesita al socio con quince a&ntilde;os de experiencia.</p>
  <p>Cuando prueba el mismo prompt con un modelo de frontera, la diferencia es notable. El an&aacute;lisis tiene m&aacute;s estructura, cita los art&iacute;culos correctos, distingue entre los m&eacute;todos de precios de transferencia, y hasta se&ntilde;ala puntos que Carlos deber&iacute;a verificar con las disposiciones vigentes. Sigue sin ser un producto final &mdash;Carlos tiene que validar todo, porque como veremos en el Cap&iacute;tulo 12, la responsabilidad profesional sigue siendo suya&mdash;, pero es un punto de partida s&oacute;lido que le ahorra horas de redacci&oacute;n.</p>
  <p>La lecci&oacute;n de Carlos no es que necesita pagar por el modelo m&aacute;s caro para todo. Es que necesita elegir el modelo adecuado para cada tarea. Correos rutinarios con el modelo gratuito. An&aacute;lisis fiscal complejo con el modelo m&aacute;s capaz que tenga disponible.</p>

  <h2>Mito vs. Realidad</h2>
  <p><strong>Mito:</strong> Todos los modelos de IA son b&aacute;sicamente iguales; la diferencia es solo la marca.</p>
  <p><strong>Realidad:</strong> Los modelos var&iacute;an enormemente en capacidad, tama&ntilde;o, entrenamiento y &aacute;reas de fortaleza. Elegir el modelo correcto para la tarea correcta es una decisi&oacute;n que afecta directamente la calidad del resultado que obtienes.</p>
  <p><strong>Mito:</strong> El modelo m&aacute;s caro siempre es el mejor para cualquier tarea.</p>
  <p><strong>Realidad:</strong> Un modelo m&aacute;s peque&ntilde;o y econ&oacute;mico puede ser perfectamente adecuado para tareas rutinarias. La habilidad est&aacute; en saber cu&aacute;ndo necesitas la potencia de un modelo de frontera y cu&aacute;ndo no. Usar el modelo m&aacute;s caro para redactar un correo de seguimiento es como contratar a un fiscalista senior para capturar facturas.</p>

  <hr>

  <div class="takeaway">
    <h3>Lo que te llevas</h3>
    <ul>
      <li>Los modelos de IA se diferencian por sus par&aacute;metros (experiencia acumulada), su entrenamiento, y sus &aacute;reas de fortaleza. &laquo;Inteligencia artificial&raquo; no es una sola cosa: es un ecosistema diverso donde elegir importa.</li>
      <li>Para tareas simples y rutinarias, un modelo gratuito o peque&ntilde;o puede ser suficiente. Para an&aacute;lisis fiscal complejo, redacci&oacute;n de fundamentos legales, o interpretaci&oacute;n de normatividad, los modelos de frontera marcan una diferencia real que justifica su costo.</li>
      <li>El mejor prompt con el modelo equivocado produce resultados mediocres. Antes de perfeccionar tus instrucciones, aseg&uacute;rate de que est&aacute;s usando un modelo con la capacidad que tu tarea requiere.</li>
    </ul>
  </div>

  <h3>Pru&eacute;balo t&uacute; mismo</h3>
  <ol>
    <li>Toma una tarea sencilla y una compleja de tu trabajo diario. La sencilla puede ser &laquo;redacta un correo recordando al cliente que env&iacute;e su constancia de situaci&oacute;n fiscal&raquo;. La compleja puede ser &laquo;explica las diferencias entre el r&eacute;gimen de RESICO y el r&eacute;gimen general de ley para una persona f&iacute;sica con actividad empresarial que factura $3 millones anuales, considerando ISR e IVA&raquo;.</li>
    <li>Prueba ambas tareas en un modelo gratuito y en un modelo de pago (si tienes acceso). Compara la profundidad, precisi&oacute;n y utilidad de cada respuesta.</li>
    <li>Nota el patr&oacute;n: en la tarea sencilla, la diferencia entre modelos es m&iacute;nima. En la compleja, la diferencia puede ser la que existe entre un borrador que tienes que rehacer y un borrador que solo necesitas ajustar.</li>
  </ol>
</div>

<!-- ==================== END PAGE ==================== -->
<div class="chapter" style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:80vh;text-align:center;">
  <p style="font-size:9pt;text-transform:uppercase;letter-spacing:4pt;color:#a3a3a3;margin-bottom:16pt;">Fin del preview</p>
  <h2 style="font-size:20pt;font-weight:600;margin-bottom:12pt;">El libro completo tiene 17 cap&iacute;tulos y 3 ap&eacute;ndices</h2>
  <p style="font-size:12pt;color:#525252;max-width:340pt;margin-bottom:24pt;">Disponible a partir del mi&eacute;rcoles 1 de abril de 2026.</p>
  <p style="font-size:11pt;color:#737373;">columna13.club/ia-para-contadores</p>
</div>

</body>
</html>`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle2", timeout: 60000 });

const outputPath = resolve(root, "ia-para-contadores-preview.pdf");
await page.pdf({
  path: outputPath,
  format: "Letter",
  printBackground: true,
  margin: { top: "0.83in", bottom: "0.83in", left: "0.69in", right: "0.69in" },
});

await browser.close();
console.log(`PDF generated: ${outputPath}`);
