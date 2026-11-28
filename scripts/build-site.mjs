import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist");
const publicRoot = path.join(projectRoot, "public");
const stylesheetVersion = createHash("sha256")
    .update(await readFile(path.join(publicRoot, "css", "studio.css")))
    .digest("hex")
    .slice(0, 12);
const bookingSessions = [
    { title: "Little", duration: "1 oră", description: "Ședință foto de Crăciun.", image: "christmas/christmas-pet-portrait", slug: "craciun-little" },
    { title: "Signature", duration: "2 ore", description: "Ședință foto de Crăciun.", image: "christmas/christmas-baby", slug: "craciun-signature" },
    { title: "Grand", duration: "3 ore", description: "Ședință foto de Crăciun.", image: "christmas/christmas-160", slug: "craciun-grand" }
];
const bookingBaseUrl = "https://cal.com/antonia-ghiliman-p1v0nm";
const christmas2025 = [
    { photo: "christmas-06.jpg", alt: "Fetiță lângă șemineul decorat de Crăciun", width: 1200, height: 1800 },
    { photo: "craciun-113.jpg", alt: "Tată ridicând un copil îmbrăcat în roșu lângă brad", width: 1067, height: 1600 },
    { photo: "gallery-01.jpg", alt: "Mamă și copil într-un decor de Crăciun", width: 1800, height: 1200 },
    { photo: "craciun-58.jpg", alt: "Două persoane în pulovere roșii cu motive de Crăciun", width: 1600, height: 1067 },
    { photo: "gallery-02.jpg", alt: "Mâna unui bebeluș ținută de un adult", width: 1800, height: 1200 },
    { photo: "christmas-07.jpg", alt: "Tată și copil lângă bradul de Crăciun", width: 1800, height: 1200 },
    { photo: "gallery-03.jpg", alt: "Copil cu o acadea într-un decor de Crăciun", width: 1200, height: 1800 },
    { photo: "craciun-94.jpg", alt: "Femeie și elf de Crăciun lângă un cadou", width: 1600, height: 1067 },
    { photo: "gallery-04.jpg", alt: "Familie cu un copil într-un decor de Crăciun", width: 1800, height: 1200 },
    { photo: "craciun-149.jpg", alt: "Copil întinzând mâna spre o figurină de Moș Crăciun", width: 1600, height: 1067 },
    { photo: "gallery-05.jpg", alt: "Copil într-un decor de sărbătoare cu lumini", width: 1800, height: 1200 },
    { photo: "craciun-151.jpg", alt: "Copil strângând în brațe un ursuleț de pluș", width: 1067, height: 1600 },
    { photo: "gallery-06.jpg", alt: "Viitori părinți într-un decor de Crăciun", width: 1800, height: 1200 },
    { photo: "craciun-208.jpg", alt: "Fetiță rezemată de cadouri într-un decor luminat de Crăciun", width: 1067, height: 1600 },
    { photo: "christmas-02.jpg", alt: "Mamă și copil lângă cadouri și luminițe", width: 1800, height: 1200 },
    { photo: "craciun-242.jpg", alt: "Femeie și copil într-un decor cu globuri argintii", width: 1067, height: 1600 },
    { photo: "christmas-pet-portrait.jpg", alt: "Femeie cu un cățel alb într-un decor de Crăciun", width: 1200, height: 1800, reel: "DfZ71qNoxxL" },
    { photo: "craciun-367.jpg", alt: "Femeie cu un cățel lângă un urs de pluș, în decor de Crăciun", width: 1067, height: 1600 },
    { photo: "christmas-pet.jpg", alt: "Femeie cu un cățel într-un decor de Crăciun", width: 1800, height: 1200 },
    { photo: "craciun-449.jpg", alt: "Bebeluș sprijinit de un urs mare de pluș", width: 1067, height: 1600 },
    { photo: "christmas-baby.jpg", alt: "Bebeluș cu căciulă de Crăciun și ursuleț", width: 1200, height: 1800 },
    { photo: "craciun-17.jpg", alt: "Copil sărutându-și mama pe obraz, cu un ursuleț în brațe", width: 1067, height: 1600 },
    { photo: "christmas-05.jpg", alt: "Familie cu un copil pe canapea, lângă brad", width: 1800, height: 1200 },
    { photo: "craciun-280.jpg", alt: "Copil întinzând mâna spre globurile argintii", width: 1067, height: 1600 },
    { photo: "christmas-160.jpg", alt: "Familie cu un copil într-un decor de Crăciun", width: 1800, height: 1200 },
    { photo: "craciun-210.jpg", alt: "Fetiță într-un cărucior, lângă cadouri și globuri argintii", width: 1067, height: 1600 },
    { photo: "christmas-08.jpg", alt: "Cuplu în decorul de Crăciun cu turtă dulce și luminițe", width: 1800, height: 1200 },
    { photo: "craciun-207.jpg", alt: "Copil îmbrățișând un urs de pluș lângă luminițele de Crăciun", width: 1600, height: 1067 }
];
const christmasEditions = [
    { year: 2025, items: christmas2025 },
    {
        year: 2024,
        filmsOnly: true,
        items: [
            "3", "DC1w8u8MWu3", "DDIDCByK6p7", "DDKXqF4qkxH", "DDPv2_7o1yr", "DDR-UDsIRL_",
            "DDaBSjmoqjv", "DDcgBsHom6s", "DDhfAj1IJ24", "DD7LTAAo3Jt", "DD9p5HRIA4B", "2"
        ].map((reel) => ({ reel }))
    },
    {
        year: 2023,
        filmsOnly: true,
        items: [{ reel: "DBjWPZkopSE" }, { reel: "C0APmDhMmsC" }]
    }
];

const bookingStylesheetVersion = createHash("sha256")
    .update(await readFile(path.join(publicRoot, "css", "booking.css")))
    .digest("hex")
    .slice(0, 12);

const photographyChapters = [
    {
        slug: "weddings",
        number: "CHAPTER I",
        title: "Weddings",
        description: "Intimate celebrations and the moments in between.",
        assetFolder: "photography"
    },
    {
        slug: "portraits",
        number: "CHAPTER II",
        title: "Portraits",
        description: "Personal portraits shaped by natural light and feeling.",
        assetFolder: "photography"
    },
    {
        slug: "family",
        number: "CHAPTER III",
        title: "Family",
        description: "The people, seasons and small rituals that make a life.",
        assetFolder: "photography"
    },
    {
        slug: "events-films",
        number: "CHAPTER IV",
        title: "Events & Films",
        description: "Gatherings, movement and stories seen in motion.",
        assetFolder: "photography"
    }
];

const christmasChapter = {
    slug: "craciun",
    number: "O POVESTE DE IARNĂ",
    title: "Crăciun",
    cardTitle: "Atelierul lui Moș Crăciun",
    description: "Momente calde și amintiri de Crăciun.",
    assetFolder: "photography",
    image: "christmas/christmas-160"
};

const creationCollections = [
    {
        slug: "shop-my-closet",
        number: "THE EDIT",
        title: "Shop My Closet",
        description: "Curated clothing and accessories.",
        assetFolder: "collections"
    },
    {
        slug: "home-living",
        number: "AT HOME",
        title: "Home & Living",
        description: "Thoughtful decor and home textile essentials.",
        assetFolder: "collections"
    },
    {
        slug: "seasonal-atelier",
        number: "IN SEASON",
        title: "Seasonal Atelier",
        description: "Christmas and seasonal collections.",
        assetFolder: "collections"
    },
    {
        slug: "handmade-accessories",
        number: "MADE BY HAND",
        title: "Handmade Accessories",
        description: "Unique, delicate pieces made with care.",
        assetFolder: "collections"
    }
].map((item) => ({ ...item, comingSoon: true }));

const allItems = [...photographyChapters, ...creationCollections].map((item) => ({
    ...item,
    path: `${item.assetFolder === "photography" ? "photography" : "creations"}/${item.slug}/`
}));

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function arrowIcon(direction = "right") {
    const orientation = direction === "left" ? " arrow-icon--left" : "";
    return `<svg class="arrow-icon${orientation}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 12h15"/><path d="m13.5 6 6 6-6 6"/></svg>`;
}

function playIcon() {
    return `<svg class="play-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 6.75 9 5.25-9 5.25z"/></svg>`;
}

function safeSocialUrl(value, name) {
    if (!value) return "";
    let url;
    try {
        url = new URL(value);
    } catch {
        throw new Error(`${name} must be a valid absolute URL.`);
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error(`${name} must use http or https.`);
    }
    return url.href;
}

const socialLinks = {
    instagram: safeSocialUrl(process.env.STUDIO_SOCIAL_INSTAGRAM_URL, "STUDIO_SOCIAL_INSTAGRAM_URL"),
    pinterest: safeSocialUrl(process.env.STUDIO_SOCIAL_PINTEREST_URL, "STUDIO_SOCIAL_PINTEREST_URL")
};

function rootPrefix(depth) {
    return depth === 0 ? "./" : "../".repeat(depth);
}

function header(prefix, isHome) {
    const root = escapeHtml(prefix);
    return `
<header class="site-header${isHome ? " site-header--home" : ""}">
    <nav class="nav-shell" aria-label="Primary navigation">
        <a class="brand" href="${root}" aria-label="Creative Studio Romania home">
            <span class="brand-mark" aria-hidden="true"><img src="${root}images/brand/home/gabriela-initial.png" alt=""/></span>
            <span class="brand-name">CREATIVE STUDIO<small>ROMANIA</small></span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="Open navigation">
            <span></span><span></span>
        </button>
        <div class="nav-menu" id="primary-menu">
            <a class="nav-link" href="${root}">HOME</a>
            <details class="nav-dropdown">
                <summary>PHOTO BY M <span aria-hidden="true">⌄</span></summary>
                <div class="nav-dropdown__menu">
                    <a href="${root}photography/">All photography</a>
                    ${photographyChapters.map((item) => `<a href="${root}photography/${item.slug}/">${escapeHtml(item.title)}</a>`).join("\n                    ")}
                    <a href="${root}photography/${christmasChapter.slug}/">${escapeHtml(christmasChapter.title)}</a>
                    <a href="${root}programari/">Rezervă o ședință</a>
                </div>
            </details>
            <details class="nav-dropdown">
                <summary>THE CREATIONS BY G <span aria-hidden="true">⌄</span></summary>
                <div class="nav-dropdown__menu">
                    <a href="${root}creations/">All collections</a>
                    ${creationCollections.map((item) => `<a href="${root}creations/${item.slug}/">${escapeHtml(item.title)}</a>`).join("\n                    ")}
                </div>
            </details>
            <a class="nav-link" href="${root}about/">ABOUT</a>
            <a class="nav-link" href="${root}contact/">CONTACT</a>
            <div class="nav-actions">
                <button class="icon-button" type="button" data-search-toggle="true"
                        aria-expanded="false" aria-controls="site-search" aria-label="Open search">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>
                </button>
                <a class="icon-button" href="${root}creations/" aria-label="Browse collections">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z"></path><path d="M9 9V6a3 3 0 0 1 6 0v3"></path></svg>
                </a>
            </div>
        </div>
        <div class="search-panel" id="site-search" hidden>
            <form action="${root}search/" method="get" role="search">
                <label for="site-search-input">SEARCH THE STUDIO</label>
                <div class="search-panel__field">
                    <input id="site-search-input" type="search" name="q" placeholder="Weddings, handmade, home…" autocomplete="off"/>
                    <button type="submit" aria-label="Submit search">${arrowIcon()}</button>
                </div>
            </form>
        </div>
    </nav>
</header>`;
}

function footer(prefix) {
    const root = escapeHtml(prefix);
    const instagram = socialLinks.instagram
        ? `<a href="${escapeHtml(socialLinks.instagram)}" target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a>`
        : "";
    const pinterest = socialLinks.pinterest
        ? `<a href="${escapeHtml(socialLinks.pinterest)}" target="_blank" rel="noopener noreferrer">Pinterest <span aria-hidden="true">↗</span></a>`
        : "";
    const socialFallback = !instagram && !pinterest
        ? `<a href="${root}contact/">Social links coming soon</a>`
        : "";

    return `
<footer class="site-footer" id="studio-footer">
    <div class="footer-grid content-section">
        <div class="footer-brand">
            <a class="brand brand--footer" href="${root}" aria-label="Creative Studio Romania home">
                <span class="brand-mark" aria-hidden="true"><img src="${root}images/brand/home/gabriela-initial.png" alt=""/></span>
                <span class="brand-name">CREATIVE STUDIO<small>ROMANIA</small></span>
            </a>
            <p>Two creative worlds.<br/>One thoughtful point of view.</p>
            <span class="footer-location">ROMANIA · AVAILABLE WORLDWIDE</span>
        </div>
        <div class="footer-column">
            <p class="footer-label">EXPLORE</p>
            <nav aria-label="Footer navigation">
                <a href="${root}photography/">Photo by M</a>
                <a href="${root}programari/">Rezervă o ședință</a>
                <a href="${root}creations/">The Creations by G</a>
                <a href="${root}about/">About the studio</a>
                <a href="${root}contact/">Contact</a>
            </nav>
        </div>
        <div class="footer-column footer-social">
            <p class="footer-label">FOLLOW THE STUDIO</p>
            ${instagram}
            ${pinterest}
            ${socialFallback}
        </div>
        <div class="footer-newsletter">
            <p class="footer-label">STUDIO NOTES</p>
            <p>Occasional notes on stories, making and the things we love.</p>
            <a class="footer-newsletter__link" href="${root}contact/">ASK TO JOIN THE LIST <span aria-hidden="true">↗</span></a>
        </div>
    </div>
    <div class="footer-bottom content-section">
        <span>© ${new Date().getFullYear()} CREATIVE STUDIO ROMANIA</span>
        <span>ART. MEMORIES. CREATIONS.</span>
        <a href="${root}contact/">CONTACT THE STUDIO</a>
    </div>
</footer>`;
}

function page({ title, description, body, depth = 0, isHome = false, includeSearchData = false, language = "en", stylesheet = "", extraFontFamily = "" }) {
    const root = rootPrefix(depth);
    const homePreload = isHome
        ? `<link rel="preload" as="image" href="${root}images/brand/home/lion.jpg" fetchpriority="high"/>`
        : "";
    const dataScript = includeSearchData
        ? `<script>window.STUDIO_ITEMS=${JSON.stringify(allItems).replaceAll("<", "\\u003c")};</script>`
        : "";
    return `<!DOCTYPE html>
<html lang="${escapeHtml(language)}">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="${escapeHtml(description)}"/>
    <meta name="theme-color" content="#251913"/>
    <title>${escapeHtml(title)} | Creative Studio Romania</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500${extraFontFamily ? `&amp;family=${encodeURIComponent(extraFontFamily)}` : ""}&amp;family=Jost:wght@300;400;500;600&amp;family=Playfair+Display:ital@1&amp;display=swap"/>
    ${homePreload}
    <link rel="stylesheet" href="${root}css/studio.css?v=${stylesheetVersion}"/>
    ${stylesheet ? `<link rel="stylesheet" href="${root}css/${escapeHtml(stylesheet)}?v=${bookingStylesheetVersion}"/>` : ""}
</head>
<body data-root-prefix="${root}">
    <div class="cursor-accent" aria-hidden="true"><span>VIEW</span></div>
    ${isHome ? `<div class="preloader" hidden aria-hidden="true"><svg viewBox="0 0 120 140" aria-hidden="true"><text x="60" y="106" text-anchor="middle">G</text></svg></div>` : ""}
    ${header(root, isHome)}
    ${body}
    ${footer(root)}
    ${dataScript}
    <script src="${root}js/app.js" defer></script>
</body>
</html>
`;
}

function tile(item, prefix) {
    return `<a class="listing-tile" href="${escapeHtml(prefix + item.path)}">
    <span class="listing-tile__image">
        <img src="${escapeHtml(prefix + `images/brand/${item.assetFolder}/${item.image || item.slug}.jpg`)}" alt="${escapeHtml(item.title + " editorial cover")}" loading="lazy"/>
    </span>
    <span class="listing-tile__number">${escapeHtml(item.number)}</span>
    <span class="listing-tile__title">${escapeHtml(item.cardTitle ?? item.title)}</span>
    <span class="listing-tile__description">${escapeHtml(item.description)}</span>
    <span class="listing-tile__arrow" aria-hidden="true">${arrowIcon()}</span>
</a>`;
}

function chapterTile(item, prefix) {
    return `<a class="chapter-tile" href="${escapeHtml(prefix + item.path)}">
    <img src="${escapeHtml(prefix + `images/brand/${item.assetFolder}/${item.image || item.slug}.jpg`)}" alt="${escapeHtml(item.title)}" loading="lazy"/>
    <span class="chapter-tile__copy"><span class="chapter-tile__number">${escapeHtml(item.number)}</span>
        <span class="chapter-tile__title">${escapeHtml(item.cardTitle ?? item.title)}</span></span>
    <span class="circle-arrow" aria-hidden="true">${arrowIcon()}</span>
</a>`;
}

function listingPage({ title, eyebrow, description, items, comingSoon = false }) {
    const body = `<main class="landing-page">
    <section class="landing-intro content-section">
        <p class="eyebrow eyebrow--dark">${escapeHtml(eyebrow)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="landing-intro__summary">${escapeHtml(description)}</p>
    </section>
    <section class="listing-section content-section">
        ${comingSoon ? `<div class="coming-soon-heading"><span class="coming-soon">Coming soon</span></div>` : ""}
        <div class="listing-grid">${items.map((item) => tile(item, "../")).join("\n            ")}</div>
    </section>
</main>`;
    return body;
}

function detailPage(item, group) {
    const parentPath = group === "photography" ? "photography/" : "creations/";
    const parentLabel = group === "photography" ? "Photo by M" : "The Creations by G";
    const siblings = (group === "photography" ? [...photographyChapters, christmasChapter] : creationCollections)
        .filter((related) => related.slug !== item.slug)
        .map((related) => ({ ...related, path: `${group}/${related.slug}/` }));
    const depth = 2;
    const root = rootPrefix(depth);
    return `<main class="landing-page">
    <section class="landing-detail">
        <div class="landing-detail__image">
            <img src="${root}images/brand/${item.assetFolder}/${item.slug}.jpg" alt="${escapeHtml(item.title + " editorial cover")}" fetchpriority="high"/>
        </div>
        <div class="landing-detail__copy">
            <p class="eyebrow eyebrow--dark">${escapeHtml(item.number)}</p>
            ${item.comingSoon ? `<p class="coming-soon coming-soon--detail">Coming soon</p>` : ""}
            <h1>${escapeHtml(item.title)}</h1>
            <p>${escapeHtml(item.description)}</p>
            <a class="text-link" href="${root}${parentPath}"><span class="text-link__icon text-link__icon--leading">${arrowIcon("left")}</span> BACK TO ${escapeHtml(parentLabel.toUpperCase())}</a>
        </div>
    </section>
    <section class="detail-related content-section">
        <div class="section-heading">
            <div><p class="eyebrow eyebrow--dark">${group === "photography" ? "PHOTOGRAPHY CHAPTERS" : "THE COLLECTIONS"}</p>
                <h2>More from <em>${escapeHtml(parentLabel)}.</em></h2></div>
            <a class="text-link" href="${root}${parentPath}">VIEW ALL <span class="text-link__icon">${arrowIcon()}</span></a>
        </div>
        <div class="chapter-grid">${siblings.map((related) => chapterTile(related, root)).join("\n            ")}</div>
    </section>
</main>`;
}

function homePage() {
    const root = "./";
    const christmasFilm = `${root}videos/christmas-reel-1.mp4`;
    const christmasPoster = `${root}images/brand/photography/christmas/reels/christmas-reel-1.jpg`;
    return `<main class="home-page">
    <div class="home-veil" aria-hidden="true"><div class="home-veil__fabric"></div></div>
    <section class="home-hero" id="home" aria-labelledby="hero-title">
        <div class="hero-inner content-section">
            <nav class="hero-index" aria-label="Homepage sections">
                <a href="#home" aria-label="01 - Home">01</a>
                <a href="#studio-worlds" aria-label="02 - Explore the studio">02</a>
                <a href="#photography-chapters" aria-label="03 - Photography chapters">03</a>
                <a href="#creation-collections" aria-label="04 - Creation collections">04</a>
            </nav>
            <div class="hero-copy">
                <p class="eyebrow">AN INDEPENDENT CREATIVE HOUSE · ROMANIA</p>
                <h1 id="hero-title"><em>ART.</em><br/>MEMORIES.<br/><em>CREATIONS.</em></h1>
                <p class="hero-tagline">CAPTURING MOMENTS. CRAFTING STORIES.</p>
                <div class="hero-actions">
                    <a class="button button--gold" href="#studio-worlds">EXPLORE THE STUDIO <span class="button__icon">${arrowIcon()}</span></a>
                    <a class="button button--outline" href="${root}about/">OUR STORY</a>
                </div>
                <a class="hero-seasonal" href="${root}programari/">
                    <span><span class="hero-seasonal__label">O POVESTE DE IARNĂ</span><strong lang="en">Christmas Photo Shoot</strong></span>
                    <span class="hero-seasonal__action">REZERVĂ ACUM <span aria-hidden="true">→</span></span>
                </a>
            </div>
            <div class="hero-preview" lang="ro">
                <img class="hero-preview__poster" src="${christmasPoster}" alt="" aria-hidden="true"/>
                <video class="hero-preview__film" muted loop playsinline preload="auto" poster="${christmasPoster}" src="${christmasFilm}" aria-hidden="true"></video>
                <p class="eyebrow">ATELIERUL LUI MOȘ CRĂCIUN · 2025</p>
                <h2>Un strop de <em>magie.</em></h2>
                <p class="hero-preview__intro">Revezi decorul din 2025, în timp ce pregătim povestea de Crăciun 2026.</p>
                <div class="hero-preview__actions">
                    <button class="hero-watch" type="button" data-video-open="true" aria-label="Redă clipul de Crăciun 2025" aria-haspopup="dialog">
                        <span class="hero-watch__play" aria-hidden="true">${playIcon()}</span>
                    </button>
                    <a class="text-link" href="${root}photography/craciun/">VEZI CATALOGUL <span class="text-link__icon">${arrowIcon()}</span></a>
                </div>
            </div>
        </div>
    </section>
    <section class="worlds content-section" id="studio-worlds" aria-label="Explore the studio">
        <a class="world-panel world-panel--photo" href="${root}photography/">
            <img class="world-panel__monogram" src="${root}images/brand/home/maria-initial.png" alt="" aria-hidden="true"/>
            <span class="world-panel__title">PHOTO <em>by <img class="world-panel__title-initial" src="${root}images/brand/home/maria-initial.png" alt="M"/></em></span>
            <span class="world-panel__subtitle">Every frame tells a story.</span>
            <span class="world-panel__description">WEDDINGS · PORTRAITS · FAMILY · EVENTS · FILMS</span>
            <span class="world-panel__signature world-panel__signature--photo">
                <img src="${root}images/brand/home/maria-watermark.png" alt="Maria Ghiliman Photography"/>
            </span>
            <span class="world-panel__link">DISCOVER THE STORIES <span class="circle-arrow" aria-hidden="true">${arrowIcon()}</span></span>
        </a>
        <a class="world-panel world-panel--creations" href="${root}creations/">
            <img class="world-panel__monogram" src="${root}images/brand/home/gabriela-initial.png" alt="" aria-hidden="true"/>
            <span class="world-panel__title">THE CREATIONS <em>by <img class="world-panel__title-initial" src="${root}images/brand/home/gabriela-initial.png" alt="G"/></em></span>
            <span class="world-panel__subtitle">Handmade. Curated. Timeless.</span>
            <span class="world-panel__description">CREATIVE PIECES FOR YOU, YOUR HOME &amp; THE SEASONS.</span>
            <span class="coming-soon coming-soon--panel">Coming soon</span>
            <span class="world-panel__link">EXPLORE THE COLLECTIONS <span class="circle-arrow" aria-hidden="true">${arrowIcon()}</span></span>
        </a>
    </section>
    <section class="christmas-feature content-section" aria-labelledby="christmas-feature-title" lang="ro">
        <div class="christmas-feature__copy">
            <p class="eyebrow eyebrow--dark">PHOTO BY M · O POVESTE DE IARNĂ</p>
            <h2 id="christmas-feature-title">Magia Crăciunului, <em>în imagini.</em></h2>
            <p>Momente calde, zâmbete și amintiri de păstrat.</p>
            <a class="text-link" href="${root}photography/craciun/">DESCOPERĂ GALERIA <span class="text-link__icon">${arrowIcon()}</span></a>
        </div>
        <a class="christmas-feature__image" href="${root}photography/craciun/" aria-label="Descoperă galeria foto de Crăciun">
            <img src="${root}images/brand/photography/christmas/christmas-160.jpg" alt="" loading="lazy"/>
        </a>
    </section>
    <section class="chapters content-section" id="photography-chapters">
        <div class="section-heading">
            <div><p class="eyebrow eyebrow--dark">PHOTO BY M · PHOTOGRAPHY &amp; FILMS</p><h2>Stories in <em>chapters.</em></h2></div>
            <a class="text-link" href="${root}photography/">VIEW ALL STORIES <span class="text-link__icon">${arrowIcon()}</span></a>
        </div>
        <div class="chapter-grid">${photographyChapters.map((item) => chapterTile({ ...item, path: `photography/${item.slug}/` }, root)).join("\n            ")}</div>
    </section>
    <section class="collections content-section" id="creation-collections">
        <div class="section-heading">
            <div><p class="eyebrow eyebrow--dark">THE CREATIONS BY G · MADE WITH HEART</p><h2>Objects with <em>meaning.</em></h2></div>
            <a class="text-link" href="${root}creations/">VIEW ALL COLLECTIONS <span class="text-link__icon">${arrowIcon()}</span></a>
        </div>
        ${creationCollections.every((item) => item.comingSoon) ? `<div class="coming-soon-heading"><span class="coming-soon">Coming soon</span></div>` : ""}
        <div class="chapter-grid">${creationCollections.map((item) => chapterTile({ ...item, path: `creations/${item.slug}/` }, root)).join("\n            ")}</div>
    </section>
    <dialog class="video-dialog video-dialog--portrait" id="video-dialog" lang="ro" aria-label="Atelierul lui Moș Crăciun 2025">
        <button class="video-dialog__close" type="button" data-video-close="true" aria-label="Închide clipul">×</button>
        <video controls playsinline preload="none" poster="${christmasPoster}" src="${christmasFilm}">Browserul tău nu poate reda acest clip.</video>
    </dialog>
</main>`;
}

function christmasReel(reel, title, { caption = "Christmas memories", autoplay = false } = {}) {
    const stem = `christmas-reel-${reel}`;
    const label = escapeHtml(title);
    return `<figure class="christmas-gallery__item christmas-gallery__item--video">
                <div class="christmas-gallery__player"${autoplay ? " data-gallery-autoplay" : ""}>
                    <video class="christmas-gallery__video" controls muted playsinline preload="none" poster="../../images/brand/photography/christmas/reels/${stem}.jpg" aria-label="${label}"><source src="../../videos/${stem}.mp4" type="video/mp4"/>${label}</video>
                    <button class="christmas-gallery__control christmas-gallery__play" type="button" data-gallery-play aria-label="Redă ${label}" hidden></button>
                    <button class="christmas-gallery__control christmas-gallery__sound" type="button" data-gallery-sound aria-label="Sunet" aria-pressed="false" hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                            <path d="M11 5 6 9H3v6h3l5 4z"/>
                            <path class="christmas-gallery__sound-on" d="M15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12"/>
                            <path class="christmas-gallery__sound-off" d="m15 9 6 6m0-6-6 6"/>
                        </svg>
                    </button>
                </div>
                <figcaption class="christmas-gallery__tag" lang="en">${escapeHtml(caption)}</figcaption>
            </figure>`;
}

function christmasBookingLink() {
    return `<a class="text-link christmas-booking-link" href="../../programari/">REZERVĂ ȘEDINȚA FOTO <span class="text-link__icon">${arrowIcon()}</span></a>`;
}

function christmasEditionSection({ year, items, filmsOnly }) {
    const galleryItems = [];
    let reelNumber = 0;
    for (const { photo, alt, width, height, reel } of items) {
        if (photo) {
            galleryItems.push(`<figure class="christmas-gallery__item"><img src="../../images/brand/photography/christmas/${photo}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"/></figure>`);
        }
        if (reel) {
            galleryItems.push(christmasReel(reel, `Crăciun ${year}, videoclip ${++reelNumber}`));
        }
    }
    return `<section class="christmas-edition" id="craciun-${year}" aria-labelledby="craciun-${year}-title">
        <h2 id="craciun-${year}-title"><span><span class="christmas-edition__name">Crăciun</span> <em>${year}</em></span></h2>
        <div class="christmas-gallery__grid${filmsOnly ? " christmas-gallery__grid--films" : ""}">
            ${galleryItems.join("\n            ")}
        </div>
        ${christmasBookingLink()}
    </section>`;
}

function christmasGalleryPage() {
    return `<main class="landing-page christmas-catalog">
    <section class="christmas-announcement content-section" aria-labelledby="christmas-announcement-title">
        <div class="christmas-announcement__content">
            <div lang="en">
                <p class="eyebrow">Christmas 2026 · Coming soon</p>
                <h1 id="christmas-announcement-title">Get ready for <em>a little magic.</em></h1>
                <p class="christmas-announcement__intro">While we prepare this year’s set, take a look back at our 2025 Christmas studio.</p>
            </div>
        </div>
        ${christmasReel("1", "Decorul de Crăciun 2025", { caption: "Christmas 2025 · Behind the scenes", autoplay: true })}
        ${christmasBookingLink()}
    </section>
    <nav class="christmas-years content-section" aria-label="Alege ediția de Crăciun">
        ${[...christmasEditions].reverse().map(({ year }) => `<a href="#craciun-${year}">${year}</a>`).join("\n        ")}
    </nav>
    <div class="christmas-gallery content-section">
        ${christmasEditions.map(christmasEditionSection).join("\n        ")}
    </div>
</main>`;
}

function searchPage() {
    return `<main class="landing-page">
    <section class="landing-intro content-section">
        <p class="eyebrow eyebrow--dark" data-search-eyebrow>SEARCH THE STUDIO</p>
        <h1 data-search-title>Explore the studio</h1>
        <p class="search-query" data-search-query hidden></p>
        <p class="landing-intro__summary" data-search-summary>Explore photography chapters and creative collections.</p>
    </section>
    <section class="listing-section content-section">
        <div class="listing-grid" data-search-results aria-live="polite"></div>
        <p class="empty-search" data-search-empty hidden>No stories matched that search. Try another word or browse the studio below.</p>
        <div class="search-return">
            <a class="text-link" href="../photography/">PHOTO BY M</a>
            <a class="text-link" href="../creations/">THE CREATIONS BY G</a>
        </div>
    </section>
</main>`;
}

function bookingSessionUrl(slug, { embed = false } = {}) {
    const url = new URL(`${bookingBaseUrl}/${slug}`);
    if (embed) url.searchParams.set("embed", "true");
    url.searchParams.set("attendeePhoneNumber", "+40");
    return url.href;
}

function bookingPage() {
    const cards = bookingSessions.map((session) => {
        const url = bookingSessionUrl(session.slug, { embed: true });
        return `<a class="booking-session" href="${escapeHtml(url)}" target="booking-calendar" data-booking-session>
                <img src="../images/brand/photography/${session.image}.jpg" alt="" loading="lazy"/>
                <span class="booking-session__body"><span class="booking-session__duration">${session.duration}</span><strong>${session.title}</strong><span>${session.description}</span><span class="booking-session__action">ALEGE ȘEDINȚA <span aria-hidden="true">→</span></span></span>
            </a>`;
    }).join("\n            ");
    const fallbackLinks = bookingSessions.map((session) =>
        `<a href="${escapeHtml(bookingSessionUrl(session.slug))}" target="_blank" rel="noopener noreferrer">${session.title}</a>`
    ).join(" · ");
    return `<main class="landing-page booking-page">
    <section class="booking-section content-section" aria-labelledby="booking-title">
        <div class="booking-intro">
            <p class="eyebrow eyebrow--dark">PHOTO BY M · CREATIVE STUDIO</p>
            <h1 id="booking-title">Rezervă o <em>ședință.</em></h1>
            <p class="booking-intro__copy">Fiecare poveste merită păstrată. Alege pachetul de Crăciun și momentul potrivit pentru ședința ta foto.</p>
            <a class="booking-intro__link" href="#sedinte">ALEGE UN MOMENT <span class="booking-arrow--down" aria-hidden="true">↓</span><span class="booking-arrow--right" aria-hidden="true">→</span></a>
        </div>
        <div class="booking-sessions" id="sedinte" aria-label="Tipuri de ședințe foto">
            ${cards}
        </div>
        <div class="booking-calendar-heading">
            <div>
                <p class="eyebrow eyebrow--dark">UN MOMENT PENTRU TINE</p>
                <h2>Alege ziua <em>potrivită.</em></h2>
            </div>
            <p>Alege ședința, apoi selectează un interval disponibil în calendar.</p>
        </div>
        <div class="booking-calendar__frame" id="calendar">
            <iframe class="booking-calendar" name="booking-calendar" src="${escapeHtml(bookingSessionUrl(bookingSessions[0].slug, { embed: true }))}" title="Programări foto în Cal.com" loading="lazy"></iframe>
        </div>
        <p class="booking-fallback">Nu se afișează calendarul? Deschide pagina pentru: ${fallbackLinks}&nbsp;<span class="booking-fallback__desktop-arrow" aria-hidden="true">↗</span><svg class="booking-fallback__mobile-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M3.5 12.5 12 4M5.5 4H12v6.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></p>
    </section>
</main>
<script src="../js/booking.js" defer></script>`;
}

async function writePage(relativePath, html) {
    const file = path.join(outputRoot, relativePath);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html, "utf8");
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await cp(publicRoot, outputRoot, { recursive: true });

await writePage("index.html", page({
    title: "Creative Studio Romania",
    description: "Photo by M and The Creations by G — photography, films and handmade collections from Romania.",
    body: homePage(),
    isHome: true,
    includeSearchData: true
}));

await writePage("photography/index.html", page({
    title: "Photo by M",
    description: "Every frame tells a story. Explore the studio's photography chapters.",
    body: listingPage({
        title: "Photo by M",
        eyebrow: "PHOTOGRAPHY & FILMS",
        description: "Every frame tells a story. Explore the studio's photography chapters.",
        items: [
            ...photographyChapters.map((item) => ({ ...item, path: `photography/${item.slug}/` })),
            { ...christmasChapter, path: `photography/${christmasChapter.slug}/` }
        ]
    }),
    depth: 1
}));

await writePage("creations/index.html", page({
    title: "The Creations by G",
    description: "A collection of creative pieces for you, your home and the seasons you love.",
    body: listingPage({
        title: "The Creations by G",
        eyebrow: "HANDMADE. CURATED. TIMELESS.",
        description: "A collection of creative pieces for you, your home and the seasons you love.",
        comingSoon: creationCollections.every((item) => item.comingSoon),
        items: creationCollections.map((item) => ({ ...item, path: `creations/${item.slug}/` }))
    }),
    depth: 1
}));

for (const item of photographyChapters) {
    await writePage(`photography/${item.slug}/index.html`, page({
        title: item.title,
        description: item.description,
        body: detailPage(item, "photography"),
        depth: 2
    }));
}

await writePage("photography/craciun/index.html", page({
    title: "Galerie foto de Crăciun",
    description: "Descoperă galeria foto de Crăciun Creative Studio Romania.",
    body: christmasGalleryPage(),
    depth: 2,
    language: "ro",
    extraFontFamily: "Great Vibes"
}));

for (const item of creationCollections) {
    await writePage(`creations/${item.slug}/index.html`, page({
        title: item.title,
        description: item.description,
        body: detailPage(item, "creations"),
        depth: 2
    }));
}

await writePage("search/index.html", page({
    title: "Search the studio",
    description: "Search photography chapters and creative collections.",
    body: searchPage(),
    depth: 1,
    includeSearchData: true
}));

await writePage("programari/index.html", page({
    title: "Rezervă o ședință foto",
    description: "Programează o ședință foto la Creative Studio Romania.",
    body: bookingPage(),
    depth: 1,
    language: "ro",
    stylesheet: "booking.css"
}));

for (const section of ["about", "contact"]) {
    await writePage(`${section}/index.html`, page({
        title: "Coming in the next phase",
        description: "Creative Studio Romania — photography, films and handmade collections.",
        body: `<main><section class="closing foundation-page"><p class="eyebrow">FOUNDATION PHASE</p><h2>Module coming<br/><em>in the next phase.</em></h2><a class="button button--gold" href="../">RETURN HOME</a></section></main>`,
        depth: 1
    }));
}

await writePage("closet/index.html", `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta http-equiv="refresh" content="0;url=../creations/shop-my-closet/"/><link rel="canonical" href="../creations/shop-my-closet/"/><title>Shop My Closet | Creative Studio Romania</title></head>
<body><p>Redirecting to <a href="../creations/shop-my-closet/">Shop My Closet</a>…</p><script>window.location.replace("../creations/shop-my-closet/");</script></body>
</html>
`);

await writePage("404.html", page({
    title: "Page not found",
    description: "The page you are looking for could not be found.",
    body: `<main><section class="closing foundation-page"><p class="eyebrow">404 · PAGE NOT FOUND</p><h2>This story<br/><em>isn't here.</em></h2><a class="button button--gold" href="./">RETURN HOME</a></section></main>`
}));

console.log(`Built ${allItems.length + 9} static pages and copied site assets to dist/.`);
