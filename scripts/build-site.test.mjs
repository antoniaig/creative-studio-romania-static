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
    assert.match(home, /id="video-dialog"/);
    assert.match(home, /class="home-veil" aria-hidden="true"/);
    assert.match(home, /class="hero-watch__play" aria-hidden="true"><svg class="play-icon"/);
    assert.match(home, /<a class="hero-seasonal" href="\.\/programari\/">[\s\S]*?Christmas Photo Shoot[\s\S]*?REZERVĂ ACUM/);
    assert.match(home, /class="circle-arrow" aria-hidden="true"><svg class="arrow-icon"/);
    assert.match(home, /class="world-panel__signature-name" aria-hidden="true">GABRIELA<\/span>/);
    assert.match(home, /href="\.\/css\/studio\.css\?v=[a-f0-9]{12}"/);
    assert.match(home, /rel="preload" as="image" href="\.\/images\/brand\/home\/lion\.jpg" fetchpriority="high"/);
    assert.match(home, /VIEW ALL STORIES <span class="text-link__icon"><svg class="arrow-icon"/);
    assert.match(home, /VIEW ALL COLLECTIONS <span class="text-link__icon"><svg class="arrow-icon"/);

    const search = await readFile(path.join(projectRoot, "dist/search/index.html"), "utf8");
    assert.match(search, /data-search-results/);
    assert.match(search, /window\.STUDIO_ITEMS=/);

    const app = await readFile(path.join(projectRoot, "dist/js/app.js"), "utf8");
    assert.match(app, /class="arrow-icon" viewBox="0 0 24 24"/);

    const photography = await readFile(path.join(projectRoot, "dist/photography/index.html"), "utf8");
    assert.match(photography, /class="listing-tile__arrow" aria-hidden="true"><svg class="arrow-icon"/);

    const css = await readFile(path.join(projectRoot, "dist/css/studio.css"), "utf8");
    assert.match(css, /@media \(max-width: 700px\) \{[\s\S]*?\.circle-arrow, \.listing-tile__arrow \{ width: auto; height: auto; border: 0;/);

    const detail = await readFile(path.join(projectRoot, "dist/photography/weddings/index.html"), "utf8");
    assert.match(detail, /href="\.\.\/\.\.\/photography\/"/);
    assert.match(detail, /href="\.\.\/\.\.\/css\/studio\.css\?v=[a-f0-9]{12}"/);
    assert.match(detail, /src="\.\.\/\.\.\/images\/brand\/photography\/weddings\.jpg"/);
    assert.match(detail, /class="text-link__icon text-link__icon--leading"><svg class="arrow-icon arrow-icon--left"/);

    const booking = await readFile(path.join(projectRoot, "dist/programari/index.html"), "utf8");
    assert.match(booking, /<html lang="ro">/);
    assert.match(booking, /<iframe[^>]+name="booking-calendar"[^>]+src="https:\/\/cal\.com\/antonia-ghiliman-p1v0nm\/sedinta-foto-portret\?embed=true"/);
    for (const slug of ["sedinta-foto-portret", "sedinta-foto-cuplu", "sedinta-foto-familie"]) {
        assert.match(booking, new RegExp(`href="https://cal\\.com/antonia-ghiliman-p1v0nm/${slug}\\?embed=true" target="booking-calendar"`));
        assert.match(booking, new RegExp(`href="https://cal\\.com/antonia-ghiliman-p1v0nm/${slug}" target="_blank"`));
    }
    assert.match(home, /href="\.\/programari\/"/);
    assert.match(detail, /href="\.\.\/\.\.\/programari\/"/);
});
