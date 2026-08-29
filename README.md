# D' Pleasure Shakes | Website

Static site for D' Pleasure Shakes, Chabahil, Kathmandu.
Pure HTML / CSS / JavaScript — no build step, no dependencies.

## Structure

```
/index.html            Home
/menu/index.html       Menu      →  /menu/
/about/index.html      About     →  /about/
/contact/index.html    Contact   →  /contact/
/404.html              Not-found page (served automatically by GitHub Pages / Vercel)
/css/style.css         All styles (design tokens at the top)
/js/script.js          All behavior (cart drawer, WhatsApp checkout, animations)
/images/               Brand assets + founder photos
```

## Run locally

Any static server from this folder works:

```
python -m http.server 8080
```
Hosting LInk:

https://dpleasure-shakes.vercel.app/

https://sujalpokhrel8585.github.io/dpleasure-shakes/

Then open http://localhost:8080

## Orders

The cart drawer collects items client-side (localStorage) and hands the
order to WhatsApp at +977 9815059360 with the itemized message pre-filled.
No backend required. To change the number, edit `WHATSAPP_NUMBER` in
`js/script.js`.

## Deploy

### GitHub Pages
1. Push this repo to GitHub.
2. Repo → Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. `.nojekyll` is already included, so the clean folder URLs serve as-is.
4. Done: `https://<username>.github.io/<repo-name>/`

> Project-site note: if the site lives under `/repo-name/`, update the
> root-absolute links inside `404.html` (e.g. `/menu/` → `/repo-name/menu/`).
> All other pages use relative links and need nothing.

### Vercel
Import the repo at vercel.com — no configuration needed, it detects the
static site and honors `404.html` automatically.

## Editing content

- Menu items and prices: `menu/index.html` cards + the `CATALOG` map in `js/script.js`
- Opening hours / contact info: each page's footer + contact page info cards
- Colors / fonts: the `:root` tokens at the top of `css/style.css`
