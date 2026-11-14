# Hockey 101

A 17-slide hockey introduction for a party, built with Svelte 5, Tailwind CSS 4, and Vite. About 15–20 minutes with audience participation. Uses NHL rules; other competitions differ.

## Run locally

```sh
bun install
bun run dev
```

Open http://localhost:5173. For a party, use your browser’s fullscreen mode or the deck’s Fullscreen button.

## Present

- Left / Right arrows, Page Up / Down, or Space: navigate
- Home / End: first / last slide
- N: toggle speaker notes (visible on the presentation screen)
- O: slide overview
- F: fullscreen
- Escape: close notes or overview
- Swipe horizontally on a phone to navigate

Offside and icing have interactive examples. The quiz includes three scenarios and revealable answers. Each slide has a URL hash, e.g. `#7` opens offside. All photos and fonts are local, so presenting needs no third-party requests. External source links require internet.

## Edit

Change slide copy, order, and speaker notes in `src/slides.js`. Layouts and interactions live in `src/App.svelte`; rink diagrams in `src/Rink.svelte`; styling in `src/style.css`. Keep photo credits and license information when publishing.

## Deploy to Cloudflare

The static site is configured in `wrangler.jsonc` for `https://hockey.michaelbonner.dev`.

```sh
bunx wrangler login
bun run deploy
```

Wrangler builds and uploads `dist/`, then binds the custom domain. The authenticated Cloudflare account must manage the `michaelbonner.dev` zone. Cloudflare manages the domain's DNS record and HTTPS certificate. Subsequent `bun run deploy` runs publish updated slides manually. Automatic builds are configured separately in Cloudflare Workers Builds as described below.

## Automatic production and preview builds

Connect `michaelbonner/hockey-101` in the Worker's **Settings → Builds → Connect → GitHub**. Authorize the Cloudflare GitHub App for this repository, then use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `bun run check && bun run build` |
| Production deploy command | `npx wrangler deploy` |
| Preview / non-production branch builds | Enabled |
| Preview command | `npx wrangler preview` |
| Build API token | Create/select a Cloudflare-managed build token in the dashboard |
| Build variable | `BUN_VERSION` = `1.4.4` (the default Bun in the build image cannot read `bun.lock`) |

Once connected, pushes to `main` update `https://hockey.michaelbonner.dev`. Other branches create or update isolated Worker Previews; Cloudflare's GitHub integration posts preview links to associated pull requests. Preview builds use `wrangler preview`, which does not deploy to the production custom domain. The production `preview_urls: false` setting disables production version URLs; it does not replace the separate Workers Builds Preview setting.

Check deployment results in Cloudflare's Builds tab and GitHub checks. `bun run build:ci` runs the same checks locally. To publish a preview manually from a feature branch, use `bun run deploy:preview` (the current branch names the preview).

## Host on your server

```sh
bun run build
```

Upload **the contents of `dist/`** to any static web server (Nginx, Caddy, Apache, etc.). No Node process, database, environment variables, or server-side rendering is required. Vite uses relative asset URLs, so this also works under a subdirectory such as `/hockey/`. No SPA fallback is necessary because slide URLs use hashes.

Example Caddy configuration:

```caddyfile
hockey.example.com {
    root * /var/www/hockey
    file_server
    encode gzip
}
```

Run `bun run preview` to inspect the production build before uploading. Rebuild and upload `dist/` after editing.

## Verification

```sh
bun run check
bun run build
bunx playwright test
```

Browser tests start their own local Vite server. First run may require `bunx playwright install chromium`.

## Sources and assets

Rules: [NHL Video Rulebook](https://www.nhl.com/info/video-rulebook), including the official 2026–27 rulebook. Simplified examples are identified in notes; this is a spectator guide, not an exhaustive referee manual.

- `utah-st-louis-faceoff.jpg`: [Utah–St. Louis preseason face-off, September 22, 2024](https://commons.wikimedia.org/wiki/File:NHL-Utah-STL-DesMoines2024.jpg), Jar-Lar, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- `utah-seattle-net.jpg`: [McBain, Vejmelka, and Sergachev, December 30, 2024](https://commons.wikimedia.org/wiki/File:McBain,_Vejmelka,_and_Sergachev_-_December_2024.jpg), Jenn G, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/).
- Both photos show the Utah Hockey Club before the Mammoth rebrand. Images are resized to 1920 pixels and cropped in layouts; photo adaptations remain under their respective ShareAlike licenses.
- Inter: Rasmus Andersson, SIL Open Font License; see `public/fonts/LICENSE.txt`.

Historic photos illustrate general gameplay and are not evidence of a specific violation. Rink diagrams are editable HTML/CSS instructional schematics. Independent project, not affiliated with the NHL.
