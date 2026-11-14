# Hockey 101

A 17-slide hockey introduction for a party, built with Svelte 5, Tailwind CSS 4, and Vite. About 15–20 minutes with audience participation. Uses NHL rules; other competitions differ.

## Run locally

```sh
npm install
npm run dev
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

## Host on your server

```sh
npm run build
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

Run `npm run preview` to inspect the production build before uploading. Rebuild and upload `dist/` after editing.

## Verification

```sh
npm run check
npm run build
npx playwright test
```

Browser tests start their own local Vite server. First run may require `npx playwright install chromium`.

## Sources and assets

Rules: [NHL Video Rulebook](https://www.nhl.com/info/video-rulebook), including the official 2026–27 rulebook. Simplified examples are identified in notes; this is a spectator guide, not an exhaustive referee manual.

- `toronto-montreal.jpg`: [NHL faceoff](https://commons.wikimedia.org/wiki/File:NHL_faceoff.jpg), Eternalsleeper, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), cropped in layouts.
- `vancouver-edmonton.jpg`: [Face off](https://commons.wikimedia.org/wiki/File:Face_off.jpg), Anders Elkjaer Johansen, public domain, cropped in layouts.
- Inter: Rasmus Andersson, SIL Open Font License; see `public/fonts/LICENSE.txt`.

Historic photos illustrate general gameplay and are not evidence of a specific violation. Rink diagrams are editable HTML/CSS instructional schematics. Independent project, not affiliated with the NHL.
