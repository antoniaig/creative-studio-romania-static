# Creative Studio Romania

A static photography and creative studio website. The published site is plain
HTML, CSS, images, video and browser-side JavaScript; it does not need Java,
Spring Boot, a database, or a server-side runtime.

## Build and preview

Node.js 18 or newer is only needed to build or preview the site locally:

```powershell
npm run build
npm run dev
```

Open <http://127.0.0.1:4173>. The build writes the complete deployable website
to `dist/`. Run `npm test` to build the site and verify its generated pages and
assets.

## Hosting

### GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys the site when
changes are pushed to `main`. In the repository settings, set **Pages → Build
and deployment → Source** to **GitHub Actions**. The account/repository plan
must allow Pages for a private repository; otherwise use Vercel or make the
repository public.

Optional repository Actions variables:

- `STUDIO_SOCIAL_INSTAGRAM_URL`
- `STUDIO_SOCIAL_PINTEREST_URL`

If supplied, these public URLs appear as links in the footer.

### Vercel

Import the repository into Vercel. `vercel.json` configures `npm run build` and
the `dist` output directory. Set the same optional social URLs as environment
variables in the Vercel project settings, then redeploy.

## Content and assets

- `scripts/build-site.mjs` generates the homepage, photography and collection
  pages, search page, informational placeholders, redirects and 404 page.
- `public/` contains the CSS, browser JavaScript, images and video copied into
  the static build.
- Photography chapters and collections are currently maintained in the build
  script. Search runs entirely in the visitor's browser.
- The newsletter link directs visitors to Contact; subscription storage and
  delivery are not implemented.

Homepage and listing imagery includes temporary, low-resolution reference
crops. Replace them with the studio's original, licensed high-resolution
photographs before launch.
