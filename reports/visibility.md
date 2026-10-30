# Visibility and publishing

## Canonical addresses

- Repository: https://github.com/houtanrocky/iranian-banks-react-icons
- Showcase: https://houtanrocky.github.io/iranian-banks-react-icons/
- Sitemap: https://houtanrocky.github.io/iranian-banks-react-icons/sitemap.xml

The old `houtan-rocky` username was incorrect. All package metadata, badges, documentation, social tags, and issue links use `houtanrocky`.

## Implemented

- A static, prerendered showcase with the complete catalog, usage examples, FAQs, and links to npm and GitHub. Content is available before JavaScript runs. English and Persian names are searchable after hydration.
- Descriptive title and description, a canonical URL, Open Graph and Twitter cards with a 1200 × 630 PNG, WebSite/SoftwareSourceCode JSON-LD, a sitemap, and an SVG favicon. Structured data describes the project; it does not imply a search engine rich result.
- Separate lazy-loaded SVGs with explicit dimensions. The initial JavaScript bundle is approximately 216 KB / 68 KB gzip, compared with the previous 1,292 KB / 457 KB gzip. These are build measurements, excluding HTML, CSS, and SVG downloads.
- README installation examples for all three packages, accurate 59-provider/117-variant counts, accessible usage, an icon list, a Persian introduction, badges, contribution guidance, and a social preview asset.
- Correct npm repository/homepage/bugs fields and focused keywords. Package changes are queued in a patch changeset; npm metadata updates when the packages are released.
- Bug and icon-request issue forms, a pull request template, dependency update configuration, and automated rendering, compatibility, package, SEO, and accessibility checks.

## GitHub configuration

Use the repository About description:

> SVG icons for 59 Iranian banks and payment providers. 117 color/mono variants for React, Vue 3 and plain SVG, with TypeScript and tree shaking.

Set the About website to the showcase URL. Relevant topics include `iranian-bank-icons`, `persian`, `iran`, `react`, `vue`, `svg`, `icons`, `typescript`, `fintech`, and `payment`.

In **Settings → Pages**, choose **GitHub Actions**. The Pages workflow deploys after CI succeeds on `main`, or via a manual workflow dispatch. It builds with the pnpm version pinned in `package.json` and uploads `apps/docs/dist`. GitHub Pages may restrict the `github-pages` environment to the default branch; preserve that deployment policy for normal releases.

Upload `.github/social-preview.png` in **Settings → General → Social preview**. GitHub's repository social preview upload has no supported REST endpoint in the tooling used here; the site's Open Graph image is configured separately and automatically built.

## After publication

1. Verify the live page and sitemap, and use Google Search Console or Bing Webmaster Tools if you own the appropriate site property. Submit the sitemap URL. Search-engine verification and indexing require the owner's account; no ranking or indexing date can be guaranteed.
2. For a project site, `robots.txt` under `/iranian-banks-react-icons/` is informational. Crawlers use `https://houtanrocky.github.io/robots.txt` at the host root. Do not assume a project-local robots file controls the entire GitHub Pages host.
3. Merge the source pull request to make the improved README, issue forms, and workflows the repository default. Publishing the showcase does not publish npm packages.
4. Configure npm trusted publishing and enable the changeset-driven release workflow to ship package fixes and corrected npm metadata. See [the release guide](releases.md); version updates are committed automatically after successful CI on `main`.
5. Share the useful catalog or a concrete integration example in relevant communities when appropriate. This work does not post announcements, solicit stars, or message other people.

The optional `llms.txt` provides a concise project reference for tools that request it; it is not a search ranking mechanism.

References: [Vite GitHub Pages deployment](https://vite.dev/guide/static-deploy), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Google robots.txt location rules](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt).
