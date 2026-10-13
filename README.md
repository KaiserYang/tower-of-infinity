# Tower of Infinity · KSR Origin

Official bilingual static website, prepared for `https://kaiseryang.github.io/tower-of-infinity-privacy/`. This task does not push or deploy. The root `index.html` is now the homepage, as requested. The original Privacy Policy is preserved byte-for-byte in `privacy-original.html`; `app-ads.txt` stays unmodified.

## Architecture and files

Dependency-free Node generator (`scripts/build.mjs`), shared templates, structured EN/ES translations (`content.mjs`), responsive CSS (`web/site.css`), small interaction script (`web/site.js`), configuration (`site.config.json`), automated checks (`scripts/check.mjs`), base-aware local preview (`scripts/preview.mjs`) and a manual GitHub Pages workflow. No backend, tracking scripts or remote fonts.

| Route under repository base | Content |
| --- | --- |
| `/` | Official English homepage |
| `/privacy-original.html` | Original published Privacy Policy, unchanged |
| `/home/` | Language-aware landing-page entry |
| `/en/`, `/es/` | Localized landing pages |
| `/support/`, `/privacy/` | Language-aware support and new policy entries |
| `/en/support/`, `/es/support/` | Localized support |
| `/en/privacy/`, `/es/privacy/` | Localized policy and explicit review notice |

Every page contains usable HTML without JavaScript. EN/ES links switch to the equivalent page and preserve fragments. A selection is saved locally when possible. Explicit locale URLs take precedence; neutral entries select the saved language, else Spanish for a Spanish browser, else English. Storage failures are handled. Canonical/hreflang and localized sharing metadata are built into HTML.

## Build, tests and preview

Requires Node 20.11+ (recommended 22), no package installation:

```powershell
npm.cmd run build
npm.cmd test
node scripts/check-http.mjs
node scripts/preview.mjs
```

On Bash use `npm run build` / `npm test`. Open `http://localhost:8000/tower-of-infinity-privacy/home/`. Preview serves `dist/` at the real configured base. Rebuild after changes. Automated checks cover routes, local links/assets/fragments, legal/ad preservation, translation parity, support email, language negotiation and storage fallback. They do not prove visual quality or legal compliance.

## Images and stores

See `assets/README.md` for expected filenames. The supplied artwork is integrated: loading-screen hero, King Slime and six promotional posters. Full-resolution JPEG derivatives reduce the seven large originals from about 30 MB to about 6 MB; original PNGs are preserved. Only configured assets are deployed. Supply authentic WebP files, update names in `site.config.json` if needed, and rebuild. Gallery images preserve portrait aspect ratio and embedded text, lazy-load and use captions identifying promotional artwork. Hero has high fetch priority. Social-image tags are emitted only when the authentic hero exists. The SVG favicon is a UI crown, not an official logo. Spanish captions are translated; embedded English poster text requires official Spanish artwork variants.

Set verified `googlePlayUrl` (`https://play.google.com/store/apps/details?id=...`) and `appStoreUrl` (`https://apps.apple.com/...`) in `site.config.json`. HTTPS and provider hosts are validated. Empty values disable buttons with localized pending/coming-soon states. Confirm the listing matches the game and developer before enabling. Edit both dictionaries in `content.mjs` together. No exact skin count is claimed from promotional art.

## Homepage and privacy URLs

Per the corrected requirement, the homepage is now at the root. The generator updates the repository's index.html and dist/index.html together on each build. Edit content.mjs and shared templates rather than the generated entry point.

The complete original policy was moved to privacy-original.html unchanged. The bilingual current policy is at /privacy/, /en/privacy/ and /es/privacy/. Footer links use the localized policies; those pages link to the original archive.

Before any authorized production deployment, update store privacy links to https://kaiseryang.github.io/tower-of-infinity-privacy/privacy/ and confirm that endpoint is publicly available. The old root will now show the homepage after deployment. No store configuration or production deployment was performed by this change.

rootHomepageEnabled is now true. Setting it false restores the original policy at the built root without modifying the archive.

## GitHub Pages deployment

Existing repository has no build workflow. The new `.github/workflows/pages.yml` uses **manual `workflow_dispatch` only**, so pushes do not trigger production deployment.

After review and explicit authorization: push changes using normal credentials; choose GitHub Actions in repository Settings → Pages (preserve any custom domain); manually run “Build and deploy GitHub Pages” on the intended branch. It builds, tests and deploys `dist/`. Confirm root homepage, `/privacy/`, `/privacy-original.html`, localized pages, support and `app-ads.txt` after deployment. No GitHub settings were modified in this task.

The base is `/tower-of-infinity-privacy/`; nested routes have real index files and `.nojekyll` is generated. `sitemap.xml` is generated; project-level `robots.txt` cannot control the domain root crawler policy, so submit the sitemap directly when needed.

## Before production

- [x] Integrate authentic hero, King Slime and six promotional images with lighter derivatives and intrinsic dimensions.
- [ ] Supply a standalone original logo and any official Spanish artwork variants; verify visual layout in browser.
- [ ] Confirm store URLs, shipped features and randomized reward descriptions.
- [ ] Complete Android/iOS privacy review and approve equivalent translations.
- [ ] Run build/checks after final edits.
- [ ] Real-browser checks at 320 px, mobile, tablet and desktop: overflow, readable contrast, keyboard focus, gallery controls, reduced motion and language persistence.
- [ ] Check console/network, screen-reader output and Lighthouse with final images.
- [ ] Verify contact/provider/refund links.
- [ ] Authorize push/deployment and follow the migration sequence.

See `PRIVACY-REVIEW.md` for unverified processing, retention, consent, international transfers, StoreKit, recovery and inherited claims. The July 2026 policy date has not been silently replaced.
