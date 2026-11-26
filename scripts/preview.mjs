import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(projectRoot, "dist");
const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".mp4": "video/mp4",
    ".png": "image/png",
    ".svg": "image/svg+xml"
};
const port = Number(process.env.PORT || 4173);

try {
    statSync(siteRoot);
} catch {
    console.error("Static site has not been built. Run `npm run build` first.");
    process.exitCode = 1;
    process.exit();
}

createServer((request, response) => {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
        response.writeHead(400).end("Bad request");
        return;
    }

    const requestedPath = path.resolve(siteRoot, `.${pathname}`);
    if (requestedPath !== siteRoot && !requestedPath.startsWith(`${siteRoot}${path.sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
    }

    let file = requestedPath;
    try {
        if (statSync(file).isDirectory()) {
            if (!pathname.endsWith("/")) {
                response.writeHead(301, { Location: `${pathname}/${new URL(request.url, "http://localhost").search}` });
                response.end();
                return;
            }
            file = path.join(file, "index.html");
        }
        if (!statSync(file).isFile()) throw new Error("Not a file");
    } catch {
        file = path.join(siteRoot, "404.html");
        response.statusCode = 404;
    }

    response.setHeader("Content-Type", mimeTypes[path.extname(file).toLowerCase()] || "application/octet-stream");
    response.setHeader("X-Content-Type-Options", "nosniff");
    createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
    console.log(`Static site available at http://127.0.0.1:${port}/`);
});
