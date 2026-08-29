# D' Pleasure Shakes | Official Website

A premium, hand-blended soda fountain experience built for the web.
This is a high-performance, fully responsive static website built with pure HTML, CSS, and JavaScript. No build steps, no frameworks, no dependencies.

## Live Links

- **Vercel (Primary):** https://dpleasure-shakes.vercel.app/
- **GitHub Pages (Mirror):** https://sujalpokhrel8585.github.io/dpleasure-shakes/

---

## Project Structure

- `/index.html` : Home page
- `/404.html` : Custom 404 page (Auto-adapts to Vercel & GitHub Pages)
- `/_redirects` : Vercel routing rule for 404 fallback
- `/vercel.json` : Vercel configuration
- `/.nojekyll` : Bypasses Jekyll processing on GitHub Pages
- `/robots.txt` : SEO crawler instructions
- `/sitemap.xml` : SEO sitemap
- `/site.webmanifest` : PWA manifest for mobile installation
- `/about/index.html` : About page (Clean URL: /about/)
- `/contact/index.html` : Contact page (Clean URL: /contact/)
- `/menu/index.html` : Menu page (Clean URL: /menu/)
- `/css/style.css` : All styles, design tokens, and animations
- `/js/script.js` : Cart logic, WhatsApp checkout, UI interactions
- `/images/` : Brand assets, photos, and icons

---

## Local Development

Since this is a pure static site, you can run it using any local server.

**Option 1: Python (Built-in)**
Open your terminal in the project root and run:
`python -m http.server 8080`
Then open http://localhost:8080 in your browser.

**Option 2: VS Code Live Server**
If you use Visual Studio Code, install the "Live Server" extension, right-click `index.html`, and select "Open with Live Server".

---

## Deployment Guide

This project is configured to deploy seamlessly to both Vercel and GitHub Pages simultaneously.

### Deploying to Vercel (Recommended for Speed)

1. Import the repository at vercel.com.
2. Set Framework Preset to `Other`.
3. Leave Build and Output settings blank.
4. Click Deploy.
   _(Note: Vercel automatically uses the `_redirects` file to serve the custom `404.html` for missing routes.)_

### Deploying to GitHub Pages

1. Push the code to your GitHub repository.
2. Go to Settings > Pages.
3. Set Source to "Deploy from a branch", select branch `main`, and folder `/ (root)`.
4. Click Save.
   _(Note: The `.nojekyll` file is included to ensure GitHub Pages serves the clean folder URLs correctly.)_

### The Universal 404 Page

The `404.html` page features a dynamic base-path injection script.

- On Vercel (root domain), it resolves assets from `/`.
- On GitHub Pages (subdirectory `/repo-name/`), it automatically detects the path and prepends the repo name to all CSS, JS, and navigation links.
  _You never need to manually update paths in the 404 file when switching hosts._

---

## Orders & WhatsApp Checkout

The site features a fully client-side shopping cart.

- Items are saved in the browser's localStorage.
- When the user checks out, it generates a pre-filled WhatsApp message and sends it to the business number.
- No backend or database is required.

To change the business phone number, open `js/script.js` and update this variable:
`const WHATSAPP_NUMBER = '9779815059360';`

---

## Editing Content

- **Menu Items & Prices:** Visual cards in `menu/index.html` + the `CATALOG` object at the top of `js/script.js`.
- **Opening Hours & Contact Info:** Located in the `<footer>` of every page and the info cards on the Contact page.
- **Colors, Fonts & Spacing:** All design tokens (CSS variables) are located at the very top of `css/style.css` under the `:root` selector.
- **Images:** Replace files in the `/images/` directory. Ensure you maintain the same file names or update the `src` attributes in the HTML.

---

## Key Features

- **Mobile-First Responsive:** Flawless experience from iPhone SE to 4K desktops.
- **Custom Animations:** Scroll reveals, hover states, marquee tickers, and floating elements.
- **Accessibility (a11y):** Semantic HTML5, ARIA labels, keyboard navigation support, and prefers-reduced-motion respect.
- **SEO Optimized:** Meta tags, Open Graph tags, Twitter cards, sitemap, and robots.txt included.
- **Zero Dependencies:** Loads instantly with no external JavaScript libraries.

---

Built with love by Sujal Pokhrel  
© 2026 D’ Pleasure Shakes. All rights reserved.
