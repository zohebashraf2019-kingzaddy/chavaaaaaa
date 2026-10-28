# Chava Márquez · Photo & Film (demo site)

Static site for Reno/Tahoe photographer & videographer Chava Márquez (@chavaaaaaa__). No build step: plain HTML, CSS and JS, ready for Vercel.

## Deploy
Import the repo in Vercel → Framework preset: **Other** → Deploy. No build command or output dir needed.

## Before going live
1. **Forms**: open `script.js` and set `CONFIG.formEndpoint` (e.g. a free Formspree form URL) so booking + contact requests go to Chava's inbox. Or set `CONFIG.email` for a mailto fallback. With both empty, requests are copied to the clipboard and the visitor is sent to Chava's Instagram DMs.
2. **Owner photo**: replace `images/owner.webp` with Chava's bio picture (portrait, roughly 4:5).
3. **TikTok link**: confirm the handle in the Contact section of `index.html`.

## Structure
- `index.html`: all sections (hero, portfolio, services, express booking, about, studio build, contact)
- `styles.css`: design system (ivory / espresso / muted gold, Cormorant Garamond + Jost)
- `script.js`: preloader, slideshow, reveals, parallax, cursor, filters, lightbox, 3-step booking, forms
- `images/`: optimized WebP portfolio images
- `video/`: compressed Studio Build video + poster
