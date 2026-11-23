import { articles, creativeDirectors, projectCredits, projects, projectVideos } from "./data.js";
import { articlePath, matchRoute, projectPath } from "./routes.js";
import { articleNotes } from "./article-notes.js";

const { page, item, legacy } = matchRoute(location.pathname, location.search);
const main = document.querySelector("main");
const heroPhotos = [
  "Mw7GIckKwmixZbMJ4bVCp5dJIc.jpg",
  "ynnm1qlBFDLXtQVSKbo4CfPZTk.jpg",
  "t2z660HhKFQCyQ25z9rjWzZL24.jpg",
  "jkbYI83hLhNLSbRGqHU5NQ1mDo.jpg"
];
const media = file => `${import.meta.env.BASE_URL}editorial/${file}`;
const photo = (file, alt = "", priority = false) =>
  `<img src="${media(file)}" alt="${alt}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

function projectMedia(name, image, priority = false) {
  const clip = projectVideos[name];
  return photo(image, "", priority) + (clip
    ? `<video data-src="${media(clip)}" muted loop playsinline preload="none" aria-hidden="true"></video>`
    : "");
}

function projectGrid(entries) {
  return `<div class="projects">${entries.map(([name, client, image]) => `
    <a class="project" href="${projectPath(name)}">
      <div class="project-image">${projectMedia(name, image)}<strong aria-hidden="true">${initials(name)}</strong><span class="project-teaser" aria-hidden="true">SEE MORE.</span></div>
      <div class="caption"><b>${name}</b><span>${client}</span><time>2025</time></div>
    </a>`).join("")}</div>`;
}

function initials(name) {
  return name.split(" ").map(word => word[0]).join("");
}

const journalCrops = ["2 / 3", "3 / 4", "2 / 3", "3 / 2", "4 / 5", "3 / 2"];

function journalGrid(entries) {
  return `<div class="journal-grid">${entries.map(entry => {
    const [name, title, image, , summary] = entry;
    return `<a class="journal-card" href="${articlePath(name, title)}" aria-label="${name}: ${title}">
      <div class="journal-image" style="--crop: ${journalCrops[articles.indexOf(entry)]}">${photo(image)}</div>
      <div class="caption"><span>Article</span><span>A. Álvarez</span></div>
      <p>${summary}</p>
    </a>`;
  }).join("")}</div>`;
}

const services = [
  ["BRAND STRATEGY", "Positioning, audience research, naming and messaging.", "tvuxr7MrGGUgsAAIZF8KZjvsHs.jpg"],
  ["BRAND GUIDELINES", "Visual and verbal systems for consistent work across every channel.", "9teLjFMpKKKKUQKKA5vbgIBMps.jpg"],
  ["CREATIVE DIRECTION", "Art direction for campaigns, editorials and product launches.", "5poLw8E1YUAHA8zxFjTXUebil8.jpg"],
  ["REBRAND LAB", "A new identity built around the parts of a brand worth keeping.", "QwguGwCCrl6nE9DPClR05Lalu0.jpg"]
];

function serviceList(count) {
  return `<div class="service-list">${services.slice(0, count).map(([name, text, file]) =>
    `<div class="service">${photo(file)}<div><h3>${name}</h3><p>${text}</p></div></div>`
  ).join("")}</div>`;
}

const craft = `<section class="craft">
  <div class="craft-heading"><h2>OUR <br>CRAFT</h2><p>We help brands articulate who they are and how they want to be seen.</p></div>
  ${serviceList(3)}
</section>`;

function home() {
  return `<section class="cover">
    <div class="portrait">${photo(heroPhotos[0], "Fashion editorial portrait", true)}</div>
    <h1 aria-label="Le Rêve">LERÊVE</h1><small>© 2025 Le Rêve® Studio</small>
  </section>
  <section class="statement inset">
    <h2><span>DEFINE YOUR</span>IMPACT</h2>
    <div class="statement-caption"><span>IT</span><span>RESHAPES</span><span>PERCEPTION</span></div>
    <p>THE TIME IS NOW. LET’S BUILD.</p>
  </section>
  <section class="welcome inset">
    <span>WELCOME TO LE RÊVE</span>
    ${photo("F2WaiWbXWpLO2v3c6bgU9WJ3i4.jpg", "Editorial portrait")}
    <div><h2>BUILD VALUE.</h2><div class="welcome-notes"><strong>THE ONLY<br>INVESTMENT<br>THAT LASTS</strong><p>We build brand identities and digital experiences for fashion and culture, bringing strategy and art direction together from the first idea through the final image.</p></div></div>
  </section>
  ${banner("LEGACY.")}
  <section class="featured"><h2 class="inset">FEATURED</h2><div class="featured-cue" aria-hidden="true"></div>${projectGrid(projects.slice(0, 5))}</section>
  ${craft}
  <section class="image-study">
    ${banner("LE RÊVE.")}
    <div class="study-portraits">${[
      ["tvuxr7MrGGUgsAAIZF8KZjvsHs.jpg", "U8Vg5n0udgRw8Sxt4TAfelLsFQ.jpg"],
      ["VaVeL0jmtullQAkoQ37i7Y4er6k.jpg", "bsKPZP76FlBVKmo7uSXI3whYM.jpg"],
      ["O1NAT0hwgGZBCqv95S4Hll1Hc.jpg", "U8oqYyQiEJdpCRBBHLATMsFPpk.jpg"]
    ].map(files => `<div>${files.map(file => photo(file)).join("")}</div>`).join("")}</div>
    <p>We create brand identities and digital experiences.</p>
  </section>`;
}

function banner(label) {
  const group = `<span>${label} ${label} ${label}</span>`;
  return `<div class="banner" aria-hidden="true"><div class="banner-track">${group}${group}</div></div>`;
}

function work() {
  return `<section class="listing-cover inset">
    <p>A selection of recent projects in design, strategy and creative direction, from couture and perfume to retail and live performance.</p>
    <div class="listing-photo">${photo(heroPhotos[0], "", true)}<span>COMING SOON</span></div>
    <h1>WORK.<sup class="listing-count" data-count="[${projects.length}]" aria-hidden="true"></sup></h1>
  </section>${projectGrid(projects)}`;
}

function about() {
  const team = [
    ["Liam Carter", "CEO", "rMnwMUYWUnFID701bDGgSGSyLU.jpg"],
    ["Sofia Alvarez", "Creative Director", "p402G0oqkIq7x6IoTAINQdreVk.jpg"],
    ["Ethan Rivera", "Project Manager", "KwPNxiylHGqLEPGMz0nL3VhNus.jpg"],
    ["Mia Thompson", "Senior Designer", "sxSo19CpPfWA6SQeIU3lMCWfu8.jpg"]
  ];
  return `<section class="about-cover inset">
    <h1>THE<br>STUDIO.</h1>
    ${photo("QwguGwCCrl6nE9DPClR05Lalu0.jpg", "Fashion portrait with dark sunglasses", true)}
    <div class="about-intro">
      <p>Le Rêve is an independent branding studio working across design, strategy and creative direction. We help brands express what makes them distinctive through clear ideas and considered design.</p>
      <p>We turn those ideas into visual systems that carry a consistent identity across print, campaigns and digital experiences.</p>
    </div>
  </section>
  <section class="studio inset">
    <h2>WHO WE ARE</h2>
    <p class="studio-lead">WE CREATE DISTINCTIVE IDENTITIES GROUNDED IN STRATEGY AND EXPRESSED THROUGH DESIGN.</p>
    ${photo("5poLw8E1YUAHA8zxFjTXUebil8.jpg", "Editorial portrait in a red and white jacket")}
    <div class="studio-copy">
      <p>We work with founders and growing brands to shape how their ideas look, sound and feel across campaigns, products and digital experiences.</p>
      <p>We give each identity a character that reflects the people behind it and the audience it needs to reach.</p>
    </div>
  </section>
  <section class="studio studio-philosophy inset">
    <h2>OUR PHILOSOPHY</h2>
    <p class="studio-lead">WE BUILD IDENTITIES AROUND PURPOSE SO THEY CAN ENDURE AS TASTES CHANGE.</p>
    ${photo("tvuxr7MrGGUgsAAIZF8KZjvsHs.jpg", "Fashion editorial with two models")}
    <div class="studio-copy">
      <p>Research gives our work direction. Photography, typography and art direction give each brand its own character.</p>
      <p>We balance intuition with research to create a visual language that stays coherent as the business grows.</p>
    </div>
  </section>
  <section class="studio-services inset">
    ${photo("9teLjFMpKKKKUQKKA5vbgIBMps.jpg")}
    <h2>OUR SERVICES</h2>
    <p class="studio-lead">WE TRANSLATE BRAND STRATEGY INTO A VISUAL IDENTITY WITH A CLEAR PURPOSE.</p>
    <ol>${services.map(([name, text], index) => `<li><span aria-hidden="true">[0${index + 1}]</span><h3>${name}</h3><p>${text}</p></li>`).join("")}</ol>
  </section>
  <section class="team inset"><h2>OUR TEAM</h2><p class="studio-lead">STRATEGISTS AND DESIGNERS WORKING TOGETHER TO SHAPE HOW BRANDS LOOK, SOUND AND FEEL.</p>
  <div class="team-grid">${team.map(([name, role, file]) =>
    `<a href="https://www.linkedin.com/company/ler%C3%AAve/">${photo(file)}<div class="team-caption"><strong>${name}</strong><span>${role}</span></div></a>`
  ).join("")}</div></section>`;
}

function journal() {
  return `<section class="journal-lead inset">
    <p>An archive of creative experiments and the stories behind our work in art, design and branding.</p>
    <h1>BLOG.</h1>
  </section><section class="inset" aria-label="Journal articles">${journalGrid(articles)}</section>`;
}

function projectDetail(project, index) {
  const [name, client, image, scope, headline, summary] = project;
  const next = projects[index + 1];
  const [artDirector, naming, tags] = projectCredits[index];
  const gallery = index === 0
    ? ["1lMApZy9YiXYTwlluDR0qxMI4nI.jpg", "tvuxr7MrGGUgsAAIZF8KZjvsHs.jpg", "rATMsPHebgbVFwRezzVZpEyfPK4.jpg"]
    : ["jwBg3ZJilOwnxiolnXUnfeY.jpg", "geGhsqF53nrx2i3yOzGg7oo7xlY.jpg", "x5M74ldT5CoUgBze2ZgcNz1jMH4.jpg"].filter(file => file !== image);
  return `<section class="project-hero">
    ${projectMedia(name, image, true)}
    <div class="project-stamp">${photo(image)}<span class="project-initials" aria-hidden="true">${initials(name)}</span></div>
    <div class="project-heading">
      <h1>${name}</h1><div><time>2025</time><p>${scope}</p></div>
    </div>
  </section>
  <section class="project-notes inset">
    <div class="project-facts">
      <h2>${headline}.</h2>
      <h3>Credits:</h3>
      <dl class="credit-list">
        <dt>Creative Direction:</dt><dd>${creativeDirectors[index]}</dd>
        <dt>Art Direction:</dt><dd>${artDirector}</dd>
        <dt>Brand Strategy:</dt><dd>A. Álvarez</dd>
        <dt>Naming:</dt><dd>${naming}</dd>
      </dl>
      <dl class="project-fields"><dt>Client:</dt><dd>${client}</dd><dt>Year:</dt><dd>2025</dd><dt>Tags:</dt><dd>${tags}</dd></dl>
      <p>${summary}</p>
    </div>
  </section>
  <div class="lookbook inset">${gallery.map(file => photo(file)).join("")}</div>
  ${next ? `<section class="project-next related"><h2 class="inset">NEXT UP</h2><p>DISCOVER MORE</p>${projectGrid([next])}</section>` : ""}`;
}

function articleDetail(article, index) {
  const [name, title, image, secondary, summary] = article;
  const [context, question, answer, quote, credit] = articleNotes[name];
  const related = [1, 2, 3].map(offset => articles[(index + offset) % articles.length]);
  return `<article>
    <header class="article-lead inset"><h1>${name}:<br>${title}</h1><p><span>A. Álvarez</span><time datetime="2023-09-22">Sep 22, 2023</time></p></header>
    <div class="article-image inset">${photo(image, "Editorial photograph for " + name, true)}</div>
    <div class="article-text">
      <p>${summary}</p>
      <p>${context}</p>
      <h2>${question}</h2>
      <p>${answer}</p>
      ${photo(secondary, "Second editorial photograph for " + name)}
    </div>
    <figure class="article-quote">
      <blockquote>“${quote}”</blockquote>
      <figcaption>${credit}</figcaption>
    </figure>
  </article>
  <section class="related inset"><h2>MORE ARTICLES.</h2>${journalGrid(related)}<a class="back" href="/journal">← All articles</a></section>`;
}

const listings = { home, work, journal, about };
const collection = page === "work" ? projects : articles;
const index = item ? collection.findIndex(([name, title]) => {
  const path = page === "work" || legacy ? projectPath(name) : articlePath(name, title);
  return path.endsWith(`/${item}`);
}) : -1;
if (index >= 0 && page === "work") {
  main.innerHTML = projectDetail(collection[index], index);
} else if (index >= 0 && page === "journal") {
  main.innerHTML = articleDetail(collection[index], index);
} else if (!item && Object.hasOwn(listings, page)) {
  main.innerHTML = listings[page]();
} else {
  main.innerHTML = '<section class="article-lead inset"><h1>PAGE NOT FOUND</h1><a href="/">Return home</a></section>';
}

document.body.dataset.page = page;
if (item) document.body.dataset.detail = "";
if (page !== "home") {
  document.querySelector(`.site-header a[href="/${CSS.escape(page)}"]`)?.setAttribute("aria-current", "page");
  document.title = `${main.querySelector("h1").innerText.replace(/\n/g, " ")} — Le Rêve`;
}

const portrait = document.querySelector(".portrait img, .listing-photo img");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let frame = 0;
let timer;
function updateRotation() {
  clearInterval(timer);
  if (!portrait || motion.matches || document.hidden) return;
  timer = setInterval(() => {
    frame = (frame + 1) % heroPhotos.length;
    const nextPhoto = new Image();
    nextPhoto.src = media(heroPhotos[frame]);
    const scheduled = frame;
    nextPhoto.decode().then(() => {
      if (!motion.matches && !document.hidden && frame === scheduled) portrait.src = nextPhoto.src;
    }).catch(() => {});
  }, 405);
}
motion.addEventListener("change", updateRotation);
document.addEventListener("visibilitychange", updateRotation);
updateRotation();

const videos = [...document.querySelectorAll("video[data-src]")];
const visibleVideos = new Set();

function syncVideo(video) {
  const shouldPlay = visibleVideos.has(video) && !motion.matches && !document.hidden;
  if (shouldPlay) {
    if (!video.hasAttribute("src")) video.src = video.dataset.src;
    video.play().catch(() => {});
  } else {
    video.pause();
  }
}

const videoObserver = new IntersectionObserver(entries => {
  for (const { target, isIntersecting } of entries) {
    if (isIntersecting) visibleVideos.add(target);
    else visibleVideos.delete(target);
    syncVideo(target);
  }
}, { threshold: .2 });

for (const video of videos) {
  video.addEventListener("playing", () => video.classList.add("is-playing"));
  video.addEventListener("error", () => video.classList.remove("is-playing"));
  videoObserver.observe(video);
}
motion.addEventListener("change", () => videos.forEach(syncVideo));
document.addEventListener("visibilitychange", () => videos.forEach(syncVideo));

if (!motion.matches) {
  const reveals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.animate(
        [{ opacity: .15, translate: "0 36px" }, { opacity: 1, translate: "0 0" }],
        { duration: 640, easing: "cubic-bezier(.22,1,.36,1)" }
      );
      reveals.unobserve(entry.target);
    }
  }, { threshold: .12 });
  document.querySelectorAll(".statement > *, .welcome > *, .featured > h2, .craft-heading > *, .service, .studio > *, .studio-services li, .team-grid a, .study-portraits img, .project-notes > *, .lookbook img")
    .forEach(element => reveals.observe(element));
}
