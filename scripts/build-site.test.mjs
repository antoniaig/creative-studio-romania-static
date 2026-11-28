import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("builds a self-contained static site with every current route", async () => {
    const build = spawnSync(process.execPath, ["scripts/build-site.mjs"], {
        cwd: projectRoot,
        encoding: "utf8"
    });
    assert.equal(build.status, 0, build.stderr || build.stdout);

    const expectedPages = [
        "index.html",
        "photography/index.html",
        "creations/index.html",
        "photography/weddings/index.html",
        "photography/portraits/index.html",
        "photography/family/index.html",
        "photography/events-films/index.html",
        "photography/craciun/index.html",
        "creations/shop-my-closet/index.html",
        "creations/home-living/index.html",
        "creations/seasonal-atelier/index.html",
        "creations/handmade-accessories/index.html",
        "search/index.html",
        "programari/index.html",
        "about/index.html",
        "contact/index.html",
        "closet/index.html",
        "404.html",
        "css/studio.css",
        "css/booking.css",
        "js/app.js",
        "js/booking.js",
        "images/brand/home/lion.jpg",
        "images/brand/home/christmas-pexels.jpg",
        "images/brand/home/wind-veil.svg",
        "videos/studio-story.mp4"
    ];

    for (const relativePath of expectedPages) {
        await assert.doesNotReject(readFile(path.join(projectRoot, "dist", relativePath)));
    }

    const home = await readFile(path.join(projectRoot, "dist/index.html"), "utf8");
    assert.match(home, /aria-label="Homepage sections"/);
    assert.match(home, /<dialog[^>]+id="video-dialog"[^>]+>[\s\S]*?<video[^>]+src="\.\/videos\/christmas-reel-1\.mp4"/);
    assert.match(home, /class="home-veil" aria-hidden="true"/);
    assert.match(home, /class="hero-watch__play" aria-hidden="true"><svg class="play-icon"/);
    const heroPreview = home.match(/<div class="hero-preview" lang="ro"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";
    assert.match(heroPreview, /<img class="hero-preview__poster" src="\.\/images\/brand\/photography\/christmas\/reels\/christmas-reel-1\.jpg" alt="" aria-hidden="true"\/>/);
    assert.match(heroPreview, /<video class="hero-preview__film" muted loop playsinline preload="auto" poster="\.\/images\/brand\/photography\/christmas\/reels\/christmas-reel-1\.jpg" src="\.\/videos\/christmas-reel-1\.mp4"[^>]*>/);
    assert.match(heroPreview, /2025[\s\S]*?Crăciun 2026/);
    assert.match(heroPreview, /href="\.\/photography\/craciun\/">VEZI CATALOGUL/);
    assert.match(home, /<a class="hero-seasonal" href="\.\/programari\/">[\s\S]*?Christmas Photo Shoot[\s\S]*?REZERVĂ ACUM/);
    assert.match(home, /href="\.\/photography\/craciun\/"/);
    assert.match(home, /src="\.\/images\/brand\/photography\/christmas\/christmas-160\.jpg"/);
    assert.match(home, /class="circle-arrow" aria-hidden="true"><svg class="arrow-icon"/);
    assert.match(home, /class="world-panel world-panel--creations"[\s\S]*?class="coming-soon coming-soon--panel">Coming soon<\/span>/);
    assert.doesNotMatch(home, /gabriela-watermark\.png/);
    assert.match(home, /href="\.\/css\/studio\.css\?v=[a-f0-9]{12}"/);
    assert.match(home, /rel="preload" as="image" href="\.\/images\/brand\/home\/lion\.jpg" fetchpriority="high"/);
    assert.match(home, /VIEW ALL STORIES <span class="text-link__icon"><svg class="arrow-icon"/);
    assert.match(home, /VIEW ALL COLLECTIONS <span class="text-link__icon"><svg class="arrow-icon"/);
    assert.match(home, /class="coming-soon-heading"><span class="coming-soon">Coming soon<\/span><\/div>\s*<div class="chapter-grid">/);

    const collections = await readFile(path.join(projectRoot, "dist/creations/index.html"), "utf8");
    assert.match(collections, /class="coming-soon-heading"><span class="coming-soon">Coming soon<\/span><\/div>\s*<div class="listing-grid">/);
    for (const slug of ["shop-my-closet", "home-living", "seasonal-atelier", "handmade-accessories"]) {
        const collection = await readFile(path.join(projectRoot, "dist", "creations", slug, "index.html"), "utf8");
        assert.match(collection, /class="coming-soon coming-soon--detail">Coming soon<\/p>\s*<h1>/);
    }

    const search = await readFile(path.join(projectRoot, "dist/search/index.html"), "utf8");
    assert.match(search, /data-search-results/);
    assert.match(search, /window\.STUDIO_ITEMS=/);

    const app = await readFile(path.join(projectRoot, "dist/js/app.js"), "utf8");
    assert.match(app, /class="arrow-icon" viewBox="0 0 24 24"/);

    const photography = await readFile(path.join(projectRoot, "dist/photography/index.html"), "utf8");
    assert.match(photography, /class="listing-tile__arrow" aria-hidden="true"><svg class="arrow-icon"/);
    assert.match(photography, /<a class="listing-tile" href="\.\.\/photography\/craciun\/">[\s\S]*?src="\.\.\/images\/brand\/photography\/christmas\/christmas-160\.jpg"[\s\S]*?class="listing-tile__title">Atelierul lui Moș Crăciun<\/span>/);
    assert.doesNotMatch(photography, /class="coming-soon/);

    const christmas = await readFile(path.join(projectRoot, "dist/photography/craciun/index.html"), "utf8");
    assert.match(christmas, /href="\.\.\/\.\.\/programari\/"/);
    assert.equal((christmas.match(/src="\.\.\/\.\.\/images\/brand\/photography\/christmas\/gallery-/g) || []).length, 6);
    for (let i = 1; i <= 6; i++) {
        const name = `gallery-${String(i).padStart(2, "0")}.jpg`;
        assert.ok(christmas.includes(`src="../../images/brand/photography/christmas/${name}"`));
        await assert.doesNotReject(readFile(path.join(projectRoot, "dist/images/brand/photography/christmas", name)));
    }
    for (const name of [
        "christmas-pet-portrait.jpg", "christmas-pet.jpg", "christmas-baby.jpg", "christmas-160.jpg",
        "christmas-02.jpg", "christmas-05.jpg", "christmas-08.jpg",
        "christmas-06.jpg", "christmas-07.jpg",
        ...[17, 58, 94, 113, 149, 151, 207, 208, 210, 242, 280, 367, 449].map((number) => `craciun-${number}.jpg`)
    ]) {
        const src = `src="../../images/brand/photography/christmas/${name}"`;
        assert.equal(christmas.split(src).length - 1, 1, name);
        await assert.doesNotReject(readFile(path.join(projectRoot, "dist/images/brand/photography/christmas", name)));
    }
    assert.doesNotMatch(christmas, /instagram\.com\/embed\.js|instagram-media|data-instgrm-permalink/);
    const reelIds = [
        "1", "DfZ71qNoxxL", "3", "DC1w8u8MWu3", "DDIDCByK6p7", "DDKXqF4qkxH", "DDPv2_7o1yr", "DDR-UDsIRL_",
        "DDaBSjmoqjv", "DDcgBsHom6s", "DDhfAj1IJ24", "DD7LTAAo3Jt", "DD9p5HRIA4B", "2", "DBjWPZkopSE", "C0APmDhMmsC"
    ];
    assert.match(christmas, /Christmas 2026 · Coming soon[\s\S]*?Get ready for <em>a little magic\.<\/em>/);
    assert.match(christmas, /&amp;family=Great%20Vibes&amp;family=Jost/);
    assert.match(christmas, /<\/section>\s*<nav class="christmas-years content-section"[^>]*>\s*<a href="#craciun-2023">2023<\/a>\s*<a href="#craciun-2024">2024<\/a>\s*<a href="#craciun-2025">2025<\/a>\s*<\/nav>\s*<div class="christmas-gallery content-section">\s*<section class="christmas-edition" id="craciun-2025"/);
    for (const year of [2025, 2024, 2023]) {
        assert.ok(christmas.includes(`<h2 id="craciun-${year}-title"><span><span class="christmas-edition__name">Crăciun</span> <em>${year}</em></span></h2>`));
    }
    const edition2025 = christmas.match(/<section class="christmas-edition" id="craciun-2025"[\s\S]*?<\/section>/)?.[0] ?? "";
    const edition2024 = christmas.match(/<section class="christmas-edition" id="craciun-2024"[\s\S]*?<\/section>/)?.[0] ?? "";
    const edition2023 = christmas.match(/<section class="christmas-edition" id="craciun-2023"[\s\S]*?<\/section>/)?.[0] ?? "";
    assert.equal((edition2025.match(/<img\b/g) ?? []).length, 28);
    assert.doesNotMatch(edition2024, /<img\b/);
    const editionReels = (edition) => Array.from(edition.matchAll(/<source src="\.\.\/\.\.\/videos\/christmas-reel-([^"]+)\.mp4"/g), ([, id]) => id);
    assert.deepEqual(editionReels(edition2025), ["DfZ71qNoxxL"]);
    assert.deepEqual(editionReels(edition2024), reelIds.slice(2, -2));
    assert.deepEqual(editionReels(edition2023), ["DBjWPZkopSE", "C0APmDhMmsC"]);
    const announcement = christmas.match(/<section class="christmas-announcement content-section"[\s\S]*?<\/section>/)?.[0] ?? "";
    const bookingLink = /class="text-link christmas-booking-link" href="\.\.\/\.\.\/programari\/">REZERVĂ ȘEDINȚA FOTO/;
    for (const section of [announcement, edition2025, edition2024, edition2023]) {
        assert.match(section, bookingLink);
    }
    assert.deepEqual(editionReels(announcement), ["1"]);
    assert.match(announcement, /class="christmas-gallery__item christmas-gallery__item--video"[\s\S]*?<\/figure>\s*<a class="text-link christmas-booking-link"/);
    assert.match(announcement, /Christmas 2025 · Behind the scenes/);
    assert.match(announcement, /class="christmas-gallery__player" data-gallery-autoplay>/);
    assert.equal((christmas.match(/\bdata-gallery-autoplay\b/g) ?? []).length, 1);
    assert.equal((christmas.match(/Behind the scenes<\/figcaption>/g) ?? []).length, 1);
    assert.equal((christmas.match(/>Christmas memories<\/figcaption>/g) ?? []).length, reelIds.length - 1);
    assert.doesNotMatch(christmas, /christmas-01\.jpg/);
    const videos = christmas.match(/<video class="christmas-gallery__video"[^>]*>/g) ?? [];
    assert.equal(videos.length, reelIds.length);
    assert.equal((christmas.match(/\bdata-gallery-play\b/g) ?? []).length, reelIds.length);
    assert.equal((christmas.match(/\bdata-gallery-sound\b/g) ?? []).length, reelIds.length);
    for (const video of videos) {
        assert.match(video, /\bcontrols\b.*\bmuted\b.*\bpreload="none"/);
        assert.doesNotMatch(video, /\bautoplay\b/);
    }
    for (const id of reelIds) {
        const stem = `christmas-reel-${id}`;
        assert.ok(christmas.includes(`src="../../videos/${stem}.mp4"`));
        assert.ok(christmas.includes(`poster="../../images/brand/photography/christmas/reels/${stem}.jpg"`));
        await assert.doesNotReject(readFile(path.join(projectRoot, "dist/videos", `${stem}.mp4`)));
        await assert.doesNotReject(readFile(path.join(projectRoot, "dist/images/brand/photography/christmas/reels", `${stem}.jpg`)));
    }

    const css = await readFile(path.join(projectRoot, "dist/css/studio.css"), "utf8");
    assert.match(css, /@media \(max-width: 700px\) \{[\s\S]*?\.circle-arrow, \.listing-tile__arrow \{ width: auto; height: auto; border: 0;/);

    const detail = await readFile(path.join(projectRoot, "dist/photography/weddings/index.html"), "utf8");
    assert.match(detail, /href="\.\.\/\.\.\/photography\/"/);
    assert.match(detail, /<a href="\.\.\/\.\.\/photography\/craciun\/">Crăciun<\/a>/);
    assert.match(detail, /<a class="chapter-tile" href="\.\.\/\.\.\/photography\/craciun\/">\s*<img src="\.\.\/\.\.\/images\/brand\/photography\/christmas\/christmas-160\.jpg" alt="Crăciun"/);
    assert.match(detail, /class="chapter-tile__title">Atelierul lui Moș Crăciun<\/span>/);
    assert.match(detail, /href="\.\.\/\.\.\/css\/studio\.css\?v=[a-f0-9]{12}"/);
    assert.match(detail, /src="\.\.\/\.\.\/images\/brand\/photography\/weddings\.jpg"/);
    assert.match(detail, /class="text-link__icon text-link__icon--leading"><svg class="arrow-icon arrow-icon--left"/);

    const booking = await readFile(path.join(projectRoot, "dist/programari/index.html"), "utf8");
    assert.match(booking, /<html lang="ro">/);
    assert.match(booking, /src="\.\.\/images\/brand\/photography\/christmas\/christmas-pet-portrait\.jpg"[^>]*\/>[\s\S]*?<strong>Little<\/strong>/);
    assert.match(booking, /src="\.\.\/images\/brand\/photography\/christmas\/christmas-baby\.jpg"[^>]*\/>[\s\S]*?<strong>Signature<\/strong>/);
    assert.match(booking, /src="\.\.\/images\/brand\/photography\/christmas\/christmas-160\.jpg"[^>]*\/>[\s\S]*?<strong>Grand<\/strong>/);
    assert.match(booking, /<iframe[^>]+name="booking-calendar"[^>]+src="https:\/\/cal\.com\/antonia-ghiliman-p1v0nm\/craciun-little\?embed=true&amp;attendeePhoneNumber=%2B40"/);
    for (const [slug, title, duration] of [["craciun-little", "Little", "1 oră"], ["craciun-signature", "Signature", "2 ore"], ["craciun-grand", "Grand", "3 ore"]]) {
        assert.match(booking, new RegExp(`href="https://cal\\.com/antonia-ghiliman-p1v0nm/${slug}\\?embed=true&amp;attendeePhoneNumber=%2B40" target="booking-calendar"`));
        assert.match(booking, new RegExp(`href="https://cal\\.com/antonia-ghiliman-p1v0nm/${slug}\\?attendeePhoneNumber=%2B40" target="_blank"`));
        assert.match(booking, new RegExp(`${duration}</span><strong>${title}</strong>`));
    }
    assert.match(home, /href="\.\/programari\/"/);
    assert.match(detail, /href="\.\.\/\.\.\/programari\/"/);
});
