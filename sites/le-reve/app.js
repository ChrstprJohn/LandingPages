import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { articles, projects } from "./data.js";
import { articlePath, matchRoute, previousDetailPaths, projectPath } from "./routes.js";

gsap.registerPlugin(ScrollTrigger);

const { page, item, legacy } = matchRoute(location.pathname, location.search);
const main = document.querySelector("main");
const heroPhotos = [
  "cover.jpg",
  "formal.jpg",
  "portrait.jpg",
  "white-suit.jpg"
];
const media = file => `${import.meta.env.BASE_URL}editorial/${file}`;
const photo = (file, alt = "", priority = false) =>
  `<img src="${media(file)}" alt="${alt}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

function projectGrid(entries) {
  const ticker = '<span>SEE MORE.</span>'.repeat(16);
  return `<div class="projects">${entries.map(([name, client, image]) => `
    <a class="project" href="${projectPath(name)}">
      <div class="project-image">${photo(image)}<strong aria-hidden="true">${initials(name)}</strong><span class="project-teaser" aria-hidden="true"><span class="project-ticker">${ticker}</span></span></div>
      <div class="caption"><b>${name}</b><span>${client}</span><time datetime="2026">2026</time></div>
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
      <div class="caption"><span>Article</span><span>DECODÉ</span></div>
      <p>${summary}</p>
    </a>`;
  }).join("")}</div>`;
}

const services = [
  ["BRAND STRATEGY", "Positioning, audience research, naming and messaging."],
  ["BRAND GUIDELINES", "Visual and verbal systems for consistent work across every channel."],
  ["CREATIVE DIRECTION", "Art direction for campaigns, editorials and product launches."],
  ["REBRAND LAB", "A new identity built around the parts of a brand worth keeping."]
];

function serviceList(count) {
  return services.slice(0, count).map(([name, text]) =>
    `<div class="service"><div><h3>${name}</h3><p>${text}</p></div></div>`
  ).join("");
}

const craftPhotos = ["fragrance.jpg", "tailoring.jpg", "tulle.jpg"];
const craft = `<section class="craft">
  <div class="service-list">
    <div class="craft-heading"><h2>OUR <br>CRAFT</h2><p>We work across the brief, the shoot and the finished page.</p></div>
    ${serviceList(3)}
  </div>
  <div class="craft-media" aria-hidden="true">
    ${photo("coat.jpg")}
    ${craftPhotos.map(file => photo(file)).join("")}
  </div>
</section>`;

function home() {
  return `<section class="cover">
    <div class="portrait">${photo(heroPhotos[0], "Fashion editorial portrait", true)}</div>
    <h1 aria-label="DECODÉ">DECODÉ</h1><small>© DECODÉ Studio</small>
  </section>
  <section class="statement inset">
    <h2><span class="statement-kicker">LOOK AT THE</span><span class="statement-impact">DETAILS</span></h2>
    <div class="statement-caption"><span>FORM</span><span>LIGHT</span><span>MATERIAL</span></div>
    <p>FASHION. FRAGRANCE. OBJECTS.</p>
  </section>
  <section class="welcome inset">
    <span>DECODÉ STUDIO</span>
    ${photo("red-study.jpg", "Editorial portrait against a red backdrop")}
    <div><h2>IN FOCUS.</h2><div class="welcome-notes"><strong>CUT<br>TEXTURE<br>ATTITUDE</strong><p>We develop campaigns, lookbooks and visual identities for fashion, fragrance and accessories. The work starts with how the object is made and how it sits in an image.</p></div></div>
  </section>
  ${banner("HERITAGE.")}
  <section class="featured"><h2 class="inset"><span>FEATURED</span></h2><div class="featured-cue" aria-hidden="true"></div>${projectGrid(projects.slice(0, 5))}</section>
  ${craft}
  <section class="image-study">
    <div class="study-stage">
    ${banner("DECODÉ.")}
    <div class="study-portraits" aria-hidden="true">${[
      ["outerwear.jpg", "pinstripe.jpg", "formal.jpg"],
      ["suit.jpg", "fragrance.jpg", "glass.jpg"],
      ["layers.jpg", "tulle.jpg", "jewelry.jpg"]
    ].map(files => `<div>${files.map(file => photo(file)).join("")}</div>`).join("")}</div>
    <p>We study how clothes move, where the light falls and which details hold the eye. These photographs bring together different ways of looking at tailoring, fabric and the objects worn alongside them. The same observations guide our work on campaigns and lookbooks.</p>
    </div>
  </section>`;
}

function banner(label) {
  const group = `<span>${label} ${label} ${label}</span>`;
  return `<div class="banner" aria-hidden="true"><div class="banner-track">${group}${group}</div></div>`;
}

function work() {
  return `<section class="listing-cover inset">
    <p>A portfolio of self-initiated campaign, lookbook and identity concepts across fashion, fragrance and accessories.</p>
    <div class="listing-photo">${photo(heroPhotos[0], "", true)}<span>EDITORIAL ARCHIVE</span></div>
    <h1>WORK.<sup class="listing-count" data-count="[${projects.length}]" aria-hidden="true"></sup></h1>
  </section>${projectGrid(projects)}`;
}

function about() {
  const disciplines = [
    ["Campaigns", "Image direction", "pinstripe.jpg", 0],
    ["Fragrance", "Identity and packaging", "fragrance.jpg", 1],
    ["Collections", "Lookbooks and styling", "outerwear.jpg", 3],
    ["Objects", "Editorial photography", "jewelry.jpg", 4]
  ];
  return `<section class="about-cover inset">
    <h1>THE<br>STUDIO.</h1>
    <div class="about-portrait">${photo("coat.jpg", "Model wearing a dark coat", true)}</div>
    <div class="about-intro">
      <p>DECODÉ is an independent creative studio for fashion, fragrance and objects. We work across identity, campaigns and editorial photography.</p>
      <p>A project can start with a garment, a scent or a collection. We develop an image language that holds together across a lookbook, a launch and the web.</p>
    </div>
  </section>
  <section class="studio inset">
    <h2>WHO WE ARE</h2>
    <p class="studio-lead">WE CREATE DISTINCTIVE IDENTITIES GROUNDED IN STRATEGY AND EXPRESSED THROUGH DESIGN.</p>
    ${photo("tailoring.jpg", "Model in a pinstripe blazer")}
    <div class="studio-copy">
      <p>We work with founders and growing brands to shape how their ideas look, sound and feel across campaigns, products and digital experiences.</p>
      <p>We give each identity a character that reflects the people behind it and the audience it needs to reach.</p>
    </div>
  </section>
  <section class="studio studio-philosophy inset">
    <h2>OUR PHILOSOPHY</h2>
    <p class="studio-lead">WE BUILD IDENTITIES AROUND PURPOSE SO THEY CAN ENDURE AS TASTES CHANGE.</p>
    ${photo("outerwear.jpg", "Outerwear fashion editorial")}
    <div class="studio-copy">
      <p>Research gives our work direction. Photography, typography and art direction give each brand its own character.</p>
      <p>We balance intuition with research to create a visual language that stays coherent as the business grows.</p>
    </div>
  </section>
  <section class="studio-services inset">
    ${photo("silk.jpg")}
    <h2>OUR SERVICES</h2>
    <p class="studio-lead">WE TRANSLATE BRAND STRATEGY INTO A VISUAL IDENTITY WITH A CLEAR PURPOSE.</p>
    <ol>${services.map(([name, text], index) => `<li><span aria-hidden="true">[0${index + 1}]</span><h3>${name}</h3><p>${text}</p></li>`).join("")}</ol>
  </section>
  <section class="team inset"><h2>IN PRACTICE</h2><p class="studio-lead">CAMPAIGNS, COLLECTIONS AND OBJECTS THROUGH THE STUDIO’S LENS.</p>
  <div class="team-grid">${disciplines.map(([name, role, file, projectIndex]) =>
    `<a href="${projectPath(projects[projectIndex][0])}">${photo(file)}<div class="team-caption"><strong>${name}</strong><span>${role}</span></div></a>`
  ).join("")}</div></section>`;
}

function journal() {
  return `<section class="journal-lead inset">
    <p>Field notes on making fashion images, from the drape of a dress to the shadow cast by a bottle.</p>
    <h1>BLOG.</h1>
  </section><section class="inset" aria-label="Journal articles">${journalGrid(articles)}</section>`;
}

function projectDetail(project, index) {
  const [name, client, image, scope, headline, summary] = project;
  const next = projects[index + 1];
  const galleries = [
    ["cover.jpg", "pinstripe.jpg", "formal.jpg"],
    ["glass.jpg", "silk.jpg"],
    ["tulle.jpg", "coat.jpg"],
    ["coat.jpg", "pinstripe.jpg"],
    ["portrait.jpg", "layers.jpg"],
    ["tailoring.jpg", "pinstripe.jpg"],
    ["silk.jpg", "light-study.jpg"],
    ["pinstripe.jpg", "suit.jpg"],
    ["jewelry.jpg", "coat.jpg"],
    ["formal.jpg", "outerwear.jpg"]
  ];
  const gallery = galleries[index];
  return `<section class="project-hero">
    ${photo(image, "", true)}
    <div class="project-stamp">${photo(image)}<span class="project-initials" aria-hidden="true">${initials(name)}</span></div>
    <div class="project-heading">
      <h1>${name}</h1><div><time datetime="2026">2026</time><p>${scope}</p></div>
    </div>
  </section>
  <section class="project-notes inset">
    <div class="project-facts">
      <h2>${headline}.</h2>
      <h3>Project notes</h3>
      <dl class="credit-list">
        <dt>Studio</dt><dd>DECODÉ</dd>
        <dt>Direction</dt><dd>${scope}</dd>
      </dl>
      <dl class="project-fields"><dt>Format</dt><dd>${client}</dd><dt>Year</dt><dd>2026</dd></dl>
      <p>${summary}</p>
    </div>
  </section>
  <div class="lookbook inset">${gallery.map(file => photo(file)).join("")}</div>
  ${next ? `<section class="project-next related"><h2 class="inset">NEXT UP</h2><p>DISCOVER MORE</p>${projectGrid([next])}</section>` : ""}`;
}

function articleDetail(article, index) {
  const [name, title, image, secondary, summary, context, question, answer] = article;
  const closingLines = [
    "A turn can tell you more about a dress than a still fitting.",
    "The edge of a lapel is a good place to start looking.",
    "A fragrance image starts with materials the viewer can see.",
    "Leave space between the jewelry and the edge of the frame.",
    "Show what the coat looks like over the clothes it was cut to cover.",
    "Before adding another light, see what changes when the sitter turns."
  ];
  const related = [1, 2, 3].map(offset => articles[(index + offset) % articles.length]);
  return `<article>
    <header class="article-lead inset"><h1>${name}:<br>${title}</h1><p><span>DECODÉ</span><span>Field Notes</span></p></header>
    <div class="article-image inset">${photo(image, "Editorial photograph for " + name, true)}</div>
    <div class="article-text">
      <p>${summary}</p>
      <p>${context}</p>
      <h2>${question}</h2>
      <p>${answer}</p>
      ${photo(secondary, "Second editorial photograph for " + name)}
    </div>
    <figure class="article-quote">
      <blockquote>“${closingLines[index]}”</blockquote>
      <figcaption>DECODÉ FIELD NOTES</figcaption>
    </figure>
  </article>
  <section class="related inset"><h2>MORE ARTICLES.</h2>${journalGrid(related)}<a class="back" href="/journal">← All posts</a></section>`;
}

const listings = { home, work, journal, about };
const collection = page === "work" ? projects : articles;
const currentIndex = item ? collection.findIndex(([name, title]) => {
  const path = page === "work" || legacy ? projectPath(name) : articlePath(name, title);
  return path.endsWith(`/${item}`);
}) : -1;
const previousIndex = item ? previousDetailPaths[page]?.findIndex(path => {
  const slug = path.split("/").at(-1);
  return slug === item || (page === "journal" && legacy && slug.startsWith(item + "-"));
}) ?? -1 : -1;
const index = currentIndex >= 0 ? currentIndex : previousIndex;
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
if (page === "home") {
  const navigation = performance.getEntriesByType("navigation")[0];
  const fromOutside = !document.referrer || new URL(document.referrer).origin !== location.origin;
  if (navigation?.type === "reload" || (navigation?.type !== "back_forward" && fromOutside)) {
    document.body.classList.add("home-entrance");
  }
}
if (item) document.body.dataset.detail = "";
if (page !== "home") {
  document.querySelector(`.site-header a[href="/${CSS.escape(page)}"]`)?.setAttribute("aria-current", "page");
  document.title = `${main.querySelector("h1").innerText.replace(/\n/g, " ")} — DECODÉ`;
}

const motion = matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".site-header");
const compactHeader = matchMedia("(max-width: 640px)");
let scrollEdge = Math.max(0, scrollY);
addEventListener("scroll", () => {
  const position = Math.max(0, scrollY);
  if (position <= 24) {
    header.classList.remove("is-scrolled-away");
    scrollEdge = position;
  } else if (header.classList.contains("is-scrolled-away")) {
    scrollEdge = Math.max(position, scrollEdge);
    if (!compactHeader.matches && scrollEdge - position >= 128) {
      header.classList.remove("is-scrolled-away");
      scrollEdge = position;
    }
  } else {
    scrollEdge = Math.min(position, scrollEdge);
    if (position - scrollEdge >= 64) {
      header.classList.add("is-scrolled-away");
      scrollEdge = position;
    }
  }
}, { passive: true });

function rotatePortrait(portrait) {
  let frame = heroPhotos.findIndex(file => portrait.getAttribute("src")?.endsWith(file));
  let timer;
  let visible = false;
  function updateRotation() {
    clearInterval(timer);
    if (!visible || motion.matches || document.hidden) return;
    timer = setInterval(() => {
      frame = (frame + 1) % heroPhotos.length;
      const nextPhoto = new Image();
      nextPhoto.src = media(heroPhotos[frame]);
      const scheduled = frame;
      nextPhoto.decode().then(() => {
        if (visible && !motion.matches && !document.hidden && frame === scheduled) portrait.src = nextPhoto.src;
      }).catch(() => {});
    }, 405);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateRotation();
  }).observe(portrait);
  motion.addEventListener("change", updateRotation);
  document.addEventListener("visibilitychange", updateRotation);
}
document.querySelectorAll(".portrait img, .listing-photo img, .footer-cover img").forEach(rotatePortrait);

const scrollMotion = gsap.matchMedia();
scrollMotion.add({
  animate: "(prefers-reduced-motion: no-preference)",
  wide: "(min-width: 1200px)",
  compact: "(max-width: 640px)"
}, ({ conditions }) => {
  if (!conditions.animate) return;

  function reveal(selector, start, opacity = 0) {
    for (const layer of document.querySelectorAll(selector)) {
      if (layer.getBoundingClientRect().bottom <= 0) continue;
      gsap.from(layer, {
        opacity,
        y: opacity === 0 ? "2.5rem" : "2.25rem",
        duration: .65,
        ease: opacity === 0 ? "power2.out" : "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: layer, start, once: true }
      });
    }
  }

  const { wide, compact } = conditions;
  reveal(".statement h2 > span, .statement-caption, .statement > p, .featured h2 > span", "top 90%");
  reveal(".welcome > span, .welcome-notes > *", "top 70%");
  reveal(".welcome > img", wide ? "top 57%" : "top 70%");
  reveal(".welcome h2", wide ? "top 70%" : "top 90%");
  reveal(".about-intro", compact ? "top bottom" : "top 84%");
  reveal(".craft-heading > *, .service > div, .studio > *, .studio-services li, .team-grid a, .project-notes > *, .lookbook img", "top 88%", .15);

  const study = document.querySelector(".image-study");
  if (study) {
    gsap.from(".study-portraits > div", {
      scale: .5,
      ease: "none",
      scrollTrigger: { trigger: study, start: "top bottom", end: "top top", scrub: true }
    });

    const studyFrames = gsap.timeline({
      scrollTrigger: {
        trigger: study,
        start: "top top",
        end: "bottom 110%",
        scrub: true,
        snap: {
          snapTo: [0, .5, 1],
          inertia: false,
          delay: .16,
          duration: { min: .15, max: .35 }
        }
      }
    });
    for (const [index, child] of [2, 3].entries()) {
      studyFrames.fromTo(
        `.study-portraits img:nth-child(${child})`,
        wide ? { xPercent: 100, opacity: 1 } : { opacity: 0 },
        wide
          ? { xPercent: 0, duration: 1, ease: "none" }
          : { opacity: 1, duration: 1, ease: "none" },
        index
      );
    }
  }

  const craft = document.querySelector(".craft");
  if (!craft || !wide) return;
  const panels = craft.querySelector(".service-list");
  const layers = craft.querySelectorAll(".craft-media img + img");
  const crossfade = gsap.timeline({
    scrollTrigger: {
      trigger: craft,
      start: "top top",
      end: () => "+=" + panels.offsetHeight,
      scrub: true
    }
  });
  layers.forEach((layer, index) => {
    crossfade.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: .5, ease: "none" }, index + .25);
  });
  crossfade.to({}, { duration: 1.25 });
});
