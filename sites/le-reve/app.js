import { articles, projects } from "./data.js";

const parameters = new URLSearchParams(location.search);
const page = parameters.get("page") || "home";
const item = parameters.get("item");
const main = document.querySelector("main");
const heroPhotos = ["Mw7GIckKwmixZbMJ4bVCp5dJIc.jpg", "t2z660HhKFQCyQ25z9rjWzZL24.jpg"];
const slug = text => text.toLowerCase().replaceAll(" ", "-");
const media = file => `${import.meta.env.BASE_URL}editorial/${file}`;
const photo = (file, alt = "", priority = false) =>
  `<img src="${media(file)}" alt="${alt}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const path = (section, name) => `?page=${section}&amp;item=${slug(name)}`;

function projectGrid(entries) {
  return `<div class="projects">${entries.map(([name, client, image]) => `
    <a class="project" href="${path("work", name)}">
      <div class="project-image">${photo(image)}<strong aria-hidden="true">${initials(name)}</strong></div>
      <div class="caption"><b>${name}</b><span>${client}</span><time>2025</time></div>
    </a>`).join("")}</div>`;
}

function initials(name) {
  return name.split(" ").map(word => word[0]).join("");
}

function journalGrid(entries) {
  return `<div class="journal-grid">${entries.map(([name, title, image]) => `
    <a class="journal-card" href="${path("journal", name)}">
      ${photo(image)}
      <div class="caption"><span>Article</span><span>A. Álvarez</span></div>
      <h2>${name}<br>${title}</h2>
    </a>`).join("")}</div>`;
}

const craft = `<section class="craft inset">
  <div><h2>OUR CRAFT</h2><p>We help brands articulate who they are and how they want to be seen.</p></div>
  <div class="service-list">
    <div><h3>BRAND STRATEGY</h3><p>Positioning, audience research, naming and messaging.</p></div>
    <div><h3>BRAND GUIDELINES</h3><p>Visual and verbal systems for consistent work across every channel.</p></div>
    <div><h3>CREATIVE DIRECTION</h3><p>Art direction for campaigns, editorials and product launches.</p></div>
  </div>
</section>`;

function home() {
  return `<section class="cover">
    <div class="portrait">${photo(heroPhotos[0], "Fashion editorial portrait", true)}</div>
    <h1>LE RÊVE</h1><small>© 2025 Le Rêve® Studio</small>
  </section>
  <section class="statement inset">
    <h2>DEFINE YOUR<br>IMPACT</h2>
    <p>THE TIME IS NOW. LET’S BUILD.</p>
  </section>
  <section class="welcome inset">
    <span>WELCOME TO LE RÊVE</span>
    ${photo("F2WaiWbXWpLO2v3c6bgU9WJ3i4.jpg", "Editorial portrait")}
    <div><h2>BUILD VALUE.</h2><p>We build brand identities and digital experiences for fashion and culture, bringing strategy and art direction together from the first idea through the final image.</p></div>
  </section>
  <div class="banner" aria-hidden="true">LEGACY. LEGACY.</div>
  <section class="featured"><h2 class="inset">FEATURED</h2>${projectGrid(projects.slice(0, 5))}</section>
  ${craft}
  <div class="banner" aria-hidden="true">LE RÊVE. LE RÊVE.</div>`;
}

function work() {
  return `<section class="listing-cover inset">
    <p>Recent projects across strategy, identity and creative direction.</p>
    <div class="listing-photo">${photo("jkbYI83hLhNLSbRGqHU5NQ1mDo.jpg", "", true)}<span>COMING SOON</span></div>
    <h1>WORK.</h1>
  </section>${projectGrid(projects)}`;
}

function about() {
  return `<section class="about-cover inset">
    <h1>THE<br>STUDIO.</h1>
    ${photo("QwguGwCCrl6nE9DPClR05Lalu0.jpg", "Fashion portrait with dark sunglasses", true)}
    <p>Le Rêve is an independent branding studio working across design, strategy and creative direction.</p>
  </section>
  <section class="studio inset">
    <span>WHO WE ARE</span><h2>IDENTITIES WITH A CLEAR POINT OF VIEW.</h2>
    <p>We work with founders and growing brands to shape how their ideas look, sound and feel across campaigns, products and digital experiences.</p>
    <span>OUR PHILOSOPHY</span><h2>DESIGN THAT AGES WELL.</h2>
    <p>Research gives our work direction. Photography, typography and art direction give each brand its own character.</p>
  </section>${craft}`;
}

function journal() {
  return `<section class="journal-lead inset">
    <p>An archive of ideas and creative experiments across art, design and image-making.</p>
    <h1>BLOG.</h1>
  </section><section class="inset" aria-label="Journal articles">${journalGrid(articles)}</section>`;
}

function projectDetail(project, index) {
  const [name, client, image, scope, headline, summary] = project;
  const next = projects[(index + 1) % projects.length];
  const gallery = index === 0
    ? ["1lMApZy9YiXYTwlluDR0qxMI4nI.jpg", "tvuxr7MrGGUgsAAIZF8KZjvsHs.jpg", "rATMsPHebgbVFwRezzVZpEyfPK4.jpg"]
    : ["jwBg3ZJilOwnxiolnXUnfeY.jpg", "geGhsqF53nrx2i3yOzGg7oo7xlY.jpg", "x5M74ldT5CoUgBze2ZgcNz1jMH4.jpg"].filter(file => file !== image);
  return `<section class="project-hero">
    ${photo(image, "", true)}
    <span class="project-initials">${initials(name)}</span>
    <h1>${name}</h1><time>2025</time>
  </section>
  <section class="project-notes inset">
    <div><p>${scope}</p><h2>${headline}</h2></div>
    <div><dl><dt>CLIENT</dt><dd>${client}</dd><dt>YEAR</dt><dd>2025</dd></dl><p>${summary}</p></div>
  </section>
  <div class="lookbook inset">${gallery.map(file => photo(file)).join("")}</div>
  <section class="related"><h2 class="inset">NEXT PROJECT</h2>${projectGrid([next])}<a class="back inset" href="?page=work">← All work</a></section>`;
}

function articleDetail(article, index) {
  const [name, title, image, secondary, summary] = article;
  const next = articles[(index + 1) % articles.length];
  return `<article>
    <header class="article-lead inset"><h1>${name}<br>${title}</h1><p>A. Álvarez · <time datetime="2023-09-22">Sep 22, 2023</time></p></header>
    <div class="article-image inset">${photo(image, "Editorial photograph for " + name, true)}</div>
    <p class="article-text inset">${summary}</p>
    <div class="article-image inset">${photo(secondary, "Second editorial photograph for " + name)}</div>
  </article>
  <section class="related inset"><h2>READ NEXT</h2>${journalGrid([next])}<a class="back" href="?page=journal">← All articles</a></section>`;
}

const listings = { home, work, journal, about };
const collection = page === "work" ? projects : articles;
const index = item ? collection.findIndex(([name]) => slug(name) === item) : -1;
if (index >= 0 && page === "work") {
  main.innerHTML = projectDetail(collection[index], index);
} else if (index >= 0 && page === "journal") {
  main.innerHTML = articleDetail(collection[index], index);
} else if (Object.hasOwn(listings, page)) {
  main.innerHTML = listings[page]();
} else {
  main.innerHTML = '<section class="article-lead inset"><h1>PAGE NOT FOUND</h1><a href="./index.html">Return home</a></section>';
}

document.body.dataset.page = page;
if (page !== "home") {
  document.querySelector(`.site-header a[href="?page=${CSS.escape(page)}"]`)?.setAttribute("aria-current", "page");
  document.title = `${main.querySelector("h1").innerText.replace(/\n/g, " ")} — Le Rêve`;
}

const portrait = document.querySelector(".portrait img");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let frame = 0;
let timer;
function updateRotation() {
  clearInterval(timer);
  if (!portrait || motion.matches || document.hidden) return;
  timer = setInterval(() => {
    frame = (frame + 1) % heroPhotos.length;
    portrait.src = media(heroPhotos[frame]);
  }, 1400);
}
motion.addEventListener("change", updateRotation);
document.addEventListener("visibilitychange", updateRotation);
updateRotation();
