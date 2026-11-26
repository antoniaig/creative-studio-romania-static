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
        "about/index.html",
        "contact/index.html",
        "closet/index.html",
        "404.html",
        "css/studio.css",
        "js/app.js",
        "images/brand/home/lion.jpg",
        "videos/studio-story.mp4"
    ];

    for (const relativePath of expectedPages) {
        await assert.doesNotReject(readFile(path.join(projectRoot, "dist", relativePath)));
    }

    const home = await readFile(path.join(projectRoot, "dist/index.html"), "utf8");
    assert.match(home, /aria-label="Homepage sections"/);
    assert.match(home, /id="video-dialog"/);

    const search = await readFile(path.join(projectRoot, "dist/search/index.html"), "utf8");
    assert.match(search, /data-search-results/);
    assert.match(search, /window\.STUDIO_ITEMS=/);

    const detail = await readFile(path.join(projectRoot, "dist/photography/weddings/index.html"), "utf8");
    assert.match(detail, /href="\.\.\/\.\.\/photography\/"/);
    assert.match(detail, /src="\.\.\/\.\.\/images\/brand\/photography\/weddings\.jpg"/);
});
