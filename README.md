# Lotus Handmade Creations 🌸

*Made with Love, Crafted by Hand.*

A mobile-first catalogue website for a Sri Lankan handmade wool & crochet business. It is a **static site** (HTML, CSS, vanilla JavaScript) — no server, no database, no paid hosting. Orders come in through **WhatsApp** and **Google Forms**. Hosted free on **GitHub Pages**.

---

## Contents

1. [What's included](#1-whats-included)
2. [Folder structure](#2-folder-structure)
3. [Before you launch — checklist](#3-before-you-launch--checklist)
4. [Settings (config.js)](#4-settings-configjs)
5. [WhatsApp setup](#5-whatsapp-setup)
6. [Google Forms setup](#6-google-forms-setup)
7. [Managing products](#7-managing-products)
8. [Product photos](#8-product-photos)
9. [Publishing on GitHub Pages](#9-publishing-on-github-pages)
10. [SEO after launch](#10-seo-after-launch)
11. [Troubleshooting](#11-troubleshooting)
12. [Testing that was done](#12-testing-that-was-done)

---

## 1. What's included

| Page | File |
|---|---|
| Home | `index.html` |
| Shop All (search, category filter, price sort) | `shop.html` |
| Wool Dolls & Teddy Bears | `wool-dolls-teddy-bears.html` |
| Crochet Toys | `crochet-toys.html` |
| Bags & Purses | `bags-purses.html` |
| Baby Collection | `baby-collection.html` |
| Hats & Accessories | `hats-accessories.html` |
| Product detail (one page serves every product) | `product.html?id=LHC-001` |
| Custom Handmade Orders | `custom-orders.html` |
| About Us | `about.html` |
| Contact Us | `contact.html` |
| Privacy Policy | `privacy-policy.html` |
| Delivery & Returns Policy | `delivery-returns.html` |
| Not-found page | `404.html` |

Features: sticky header with shop dropdown and mobile menu, hero, categories, featured & best-seller sections, "Why handmade", custom-order band, testimonials, Instagram gallery, WhatsApp CTA, floating WhatsApp button, product colour/quantity selection, prefilled WhatsApp messages, prefilled Google Form links, Open Graph previews, product structured data (Google rich results), sitemap and robots file.

**Honesty by design:** anything not yet configured (WhatsApp number, form, phone, email, social pages) is either hidden or shows a friendly "not connected yet" message. Nothing fake is ever displayed. Sample products and reviews carry a visible **Sample** badge, and a preview banner appears at the top until you switch it off.

---

## 2. Folder structure

```
lotus-handmade-creations/
├── index.html … (all pages, listed above)
├── 404.html
├── sitemap.xml
├── robots.txt
├── favicon.svg / favicon-32.png
├── .nojekyll                  ← tells GitHub Pages to serve files as-is
├── README.md
└── assets/
    ├── css/styles.css         ← all styling (brand colours at the top)
    ├── js/
    │   ├── config.js          ← ✏️ YOUR SETTINGS (WhatsApp, form, contacts, socials)
    │   ├── products.js        ← ✏️ YOUR PRODUCTS & CATEGORIES
    │   ├── main.js            ← site behaviour (no need to edit)
    │   └── icons.js           ← Lucide icons bundled (no need to edit)
    └── images/
        ├── brand/             ← logo, social share image, app icon
        └── products/          ← product photos (sample illustrations for now)
```

All links are **relative** (no leading `/`), so the site works correctly inside a GitHub repository subfolder such as `username.github.io/lotus-handmade-creations/`.

---

## 3. Before you launch — checklist

- [ ] Add your WhatsApp number in `assets/js/config.js` → test a product's WhatsApp button
- [ ] Create the Google Form, paste its link and entry IDs into `config.js` → test a Request Order button
- [ ] Add phone / email / location / hours (only what you want public)
- [ ] Add your real Instagram and Facebook links (leave `""` if you don't have them)
- [ ] Replace sample products in `assets/js/products.js` with real ones and real photos, and remove `sample: true`
- [ ] Replace sample testimonials with real customer reviews (with permission) — or delete them to hide the section
- [ ] Personalise the About page story (`about.html`, look for the `OWNER:` note)
- [ ] Read and adjust the Delivery & Returns and Privacy pages to match how you actually work
- [ ] Set `previewMode: false` in `config.js`
- [ ] Replace `YOUR-GITHUB-USERNAME` everywhere (see section 9, step 5)

---

## 4. Settings (config.js)

Open `assets/js/config.js`. Every setting has a comment. Text must stay inside the quotes.

```js
whatsappNumber: "94771234567",
phoneDisplay: "077 123 4567",
email: "hello@example.lk",
location: "Kandy, Sri Lanka",
businessHours: "Mon – Sat, 9.00 am – 6.00 pm",
instagramUrl: "https://www.instagram.com/yourpage",
facebookUrl: "https://www.facebook.com/yourpage",
previewMode: false,
```

Leave any value as `""` to hide it.

---

## 5. WhatsApp setup

1. Take your number, e.g. `077 123 4567`.
2. Remove the first `0`, add `94` (Sri Lanka country code), remove spaces → `94771234567`.
3. Put it in `config.js`: `whatsappNumber: "94771234567",`
4. Save, publish, then tap any **WhatsApp** button on your phone.

The customer's message is filled in automatically, for example:

```
Hello Lotus Handmade Creations! I would like to order:

Product: Happy Octopus Buddy
Product ID: LHC-003
Price: LKR 2,500 each
Quantity: 3
Preferred colour: Mint
Estimated total: LKR 7,500 (+ delivery)

Product link: https://…/product.html?id=LHC-003
```

> Tip: use a **WhatsApp Business** number so you can add a catalogue, quick replies and away messages.

---

## 6. Google Forms setup

### 6.1 Create the form

Go to <https://forms.google.com> → **Blank form**, title it *Lotus Handmade Creations – Order Request*, and add these questions:

| Question | Type | Required |
|---|---|---|
| Customer Name | Short answer | ✅ |
| Mobile Number | Short answer | ✅ |
| WhatsApp Number | Short answer | |
| Product Name | Short answer | ✅ |
| Product ID | Short answer | |
| Quantity | Short answer (Settings → Response validation → Number) | ✅ |
| Preferred Colour | Short answer | |
| Delivery Address | Paragraph | ✅ |
| Additional Instructions | Paragraph | |

Use **Short answer** for Product Name, Product ID, Quantity and Preferred Colour — that's what lets the website fill them in automatically.

Optional: **Responses → Link to Sheets** to collect orders in a Google Sheet, and turn on **Get email notifications for new responses** (Responses → ⋮ menu).

### 6.2 Connect the form to the website

1. Click **Send** → link icon 🔗 → copy the link. Use the full link ending in `/viewform` (not the shortened forms.gle link).
2. Paste it into `config.js`:
   ```js
   googleForm: {
     url: "https://docs.google.com/forms/d/e/1FAIpQL…/viewform",
   ```

That's enough for the buttons to work. To have the product filled in automatically, also do 6.3.

### 6.3 Get the entry IDs (auto-fill product details)

1. In the form editor click **⋮ (More) → Get pre-filled link**.
2. Type dummy answers: Product Name `NAME`, Product ID `ID`, Quantity `1`, Preferred Colour `COLOUR`.
3. Click **Get link → Copy link**. It looks like:
   ```
   …/viewform?usp=pp_url&entry.123456789=NAME&entry.987654321=ID&entry.555555555=1&entry.444444444=COLOUR
   ```
4. Copy each `entry.xxxxx` into `config.js`:
   ```js
   fields: {
     productName: "entry.123456789",
     productId:   "entry.987654321",
     quantity:    "entry.555555555",
     colour:      "entry.444444444"
   }
   ```

### 6.4 Test it (important)

Open a product page, choose a colour and quantity, click **Request Order**. The form should open with Product Name, ID, Quantity and Colour filled in. Submit one test order and check it appears under **Responses**. Until you've done this test, treat the form as not connected.

While `url` is empty, the site **does not pretend** a form exists — customers see a short message pointing them to WhatsApp instead.

---

## 7. Managing products

All products live in **`assets/js/products.js`**. The page layouts read from this file, so you never edit HTML to change products.

### Add a product

Copy an existing block (from `{` to `},`), paste it below, and change the values:

```js
  {
    id: "LHC-013",                         // unique — never reuse an ID
    name: "Mini Giraffe Rattle",
    category: "baby",                      // must match a category id
    description: "A soft crochet giraffe with a gentle rattle inside.",
    price: 2200,                           // number only, no commas or "LKR"
    image: "assets/images/products/giraffe-rattle.jpg",
    colours: ["Yellow", "Mint"],
    availability: "In Stock",              // "In Stock" | "Made to Order" | "Out of Stock"
    customisation: ["Name tag"],           // or [] for none
    details: { Size: "Approx. 15 cm", Material: "Milk-cotton yarn", Care: "Hand wash" },
    featured: false,                       // true = Featured on homepage
    bestSeller: false                      // true = Best Sellers on homepage
  },
```

Remember the comma `,` after the closing `}` of each product.

### Common edits

| To… | Change |
|---|---|
| Rename a product | `name` |
| Change a price | `price` (e.g. `4500`) |
| Replace the image | `image` path (see section 8) |
| Change the description | `description` |
| Mark sold out | `availability: "Out of Stock"` |
| Feature on homepage | `featured: true` (up to 8 shown) |
| Show as best seller | `bestSeller: true` (up to 4 shown) |
| Remove "Sample" badge | delete `sample: true` |
| Delete a product | delete its whole `{ … },` block |

### Add a category

1. Add a line to `CATEGORIES` in `products.js`, e.g.
   `{ id: "home-decor", name: "Home Décor", page: "home-decor.html", image: "assets/images/products/xyz.jpg", blurb: "Coasters, baskets and more." },`
2. Copy `bags-purses.html` to `home-decor.html`.
3. In the new file change `data-category="bags"` to `data-category="home-decor"` and update the `<title>`, description, heading and text.
4. Add the page to the menus (header, mobile menu and footer) in each HTML file, and to `sitemap.xml`.

The category filter chips on the shop page pick up new categories automatically.

### Colour swatches

Common colour names (Pink, Lavender, Mint, Cream, White, Brown, Sky Blue, Grey, Lilac…) get a matching dot automatically. Other names still work as choices; they just show a neutral dot. You can add more in `main.js` → `COLOUR_MAP`.

### Check your edit

A missing comma or quote stops the products from loading. If the shop is suddenly empty, open the browser console (F12 → Console) — the error shows the line number in `products.js`.

---

## 8. Product photos

- Put photos in `assets/images/products/`. Use lowercase names with hyphens, no spaces: `pink-bunny-doll.jpg`.
- **Square photos (1:1)** look best, around **1000 × 1000 px**.
- Keep each file **under 200 KB**. Compress free at <https://squoosh.app> (choose WebP or MozJPEG, quality ~75).
- Natural daylight, plain cream/white background, and the product filling most of the frame give a consistent boutique look.
- File names are case-sensitive on GitHub Pages: `Bear.JPG` ≠ `bear.jpg`.
- The current `.svg` images are placeholder illustrations marked "SAMPLE IMAGE" — replace them.

---

## 9. Publishing on GitHub Pages

### Step 1 — Create a GitHub account
Sign up at <https://github.com> (free).

### Step 2 — Create the repository
1. Click **+ → New repository**.
2. Name: `lotus-handmade-creations`
3. Choose **Public** (required for free GitHub Pages).
4. Click **Create repository**.

### Step 3 — Upload the files
**Easiest (browser):** on the new repository page click **uploading an existing file**, then drag in **everything inside** the `lotus-handmade-creations` folder (the HTML files, the `assets` folder, `sitemap.xml`, `robots.txt`, etc.) — not the folder itself. `index.html` must be at the top level of the repository. Click **Commit changes**.

> Hidden file `.nojekyll`: if your computer hides it and it doesn't upload, create it on GitHub with **Add file → Create new file**, name `.nojekyll`, leave it empty, commit.

**Or with Git:**
```bash
cd lotus-handmade-creations
git init
git add .
git commit -m "Launch Lotus Handmade Creations website"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/lotus-handmade-creations.git
git push -u origin main
```

### Step 4 — Turn on GitHub Pages
1. Repository → **Settings → Pages**.
2. **Source:** *Deploy from a branch*. **Branch:** `main`, folder `/ (root)`. **Save**.
3. Wait 1–3 minutes, refresh — the address appears:
   `https://YOUR-GITHUB-USERNAME.github.io/lotus-handmade-creations/`

### Step 5 — Set your real web address
Replace `YOUR-GITHUB-USERNAME` with your GitHub username in every file (used for search engines and social previews):

- **VS Code:** Edit → Replace in Files (Ctrl+Shift+H) → find `YOUR-GITHUB-USERNAME` → replace all.
- **On GitHub:** edit `config.js`, `sitemap.xml`, `robots.txt` and the `<head>` of each HTML file.

If you named the repository differently, also replace `lotus-handmade-creations` in those URLs.

### Updating the site later
Edit the file on GitHub (pencil ✏️ icon) → **Commit changes**. The live site updates in about a minute. Press **Ctrl+F5** (or clear cache on phone) to see changes.

### Optional: your own domain (e.g. lotushandmade.lk)
Settings → Pages → **Custom domain**, then add the DNS records GitHub shows at your domain provider. Afterwards change the base URL everywhere (step 5) to your domain.

---

## 10. SEO after launch

1. **Google Search Console** (<https://search.google.com/search-console>): add your site URL, verify with the HTML-tag method (paste the tag into `index.html` `<head>`), then submit `sitemap.xml`.
2. **Google Business Profile** (<https://business.google.com>): create a free profile — the biggest boost for "handmade gifts Sri Lanka" style local searches. Use the same name, phone and website everywhere.
3. When you add products, add their links to `sitemap.xml` (copy an existing `<url>` line).
4. Share product links on Instagram, Facebook and WhatsApp Status — the social preview image appears automatically.
5. Write descriptive product names and descriptions with words customers search for (e.g. "crochet teddy bear", "newborn gift", "baby blanket").

Already built in: unique page titles and descriptions, Open Graph/Twitter cards, canonical links, `Store` structured data for the business, `Product` structured data (price in LKR, availability) on each product page, image alt text, `sitemap.xml`, `robots.txt`, `lang="en-LK"`.

---

## 11. Troubleshooting

| Problem | Fix |
|---|---|
| Site shows 404 after enabling Pages | Wait 2–3 minutes. Check `index.html` is at the top level of the repo, not inside a subfolder. |
| Page loads without styling | The `assets` folder wasn't uploaded, or was uploaded inside another folder. The repo should show `assets/` next to `index.html`. |
| Images don't show | File name or folder in `products.js` doesn't exactly match (case-sensitive). |
| Shop shows no products | A typo in `products.js` (missing comma/quote). Open F12 → Console to find the line. |
| WhatsApp button shows "not connected yet" | `whatsappNumber` is empty in `config.js`. |
| WhatsApp opens but says invalid number | Use `94…` format with no `+`, spaces or leading `0`. |
| Request Order says "coming soon" | `googleForm.url` is empty in `config.js`. |
| Form opens but nothing is pre-filled | Entry IDs missing or wrong — redo section 6.3. Questions must be **Short answer**. |
| Changes don't appear | Hard refresh (Ctrl+F5). GitHub Pages can take a minute to update. |
| Social preview shows old image | Re-scrape at <https://developers.facebook.com/tools/debug/> |
| Icons missing | Make sure `assets/js/icons.js` is uploaded. |

Opening `index.html` directly from your computer (double-click) works for previewing. For a closer match to GitHub Pages, run a local server in the folder: `python -m http.server` then visit <http://localhost:8000>.

---

## 12. Testing that was done

Tested in Chrome at mobile (390 px), tablet (820 px) and desktop (1366 px), served from a subdirectory (`/lotus-handmade-creations/`) to match GitHub Pages:

- All 16 page URLs load with no script errors, no missing files and no horizontal scrolling
- Mobile menu opens/closes (incl. Escape key); desktop Shop dropdown
- Search, category chips, price/name sorting, shareable `?q=&cat=` links, category pages
- Product detail, colour selection, quantity stepper, related products, not-found product, structured data
- WhatsApp message contents (product, ID, price, quantity, colour, total) with a test number
- Google Form prefilled URL with test entry IDs
- "Not connected" messages when WhatsApp/form are empty; empty contact fields hidden

**Still to test after you configure:** your real WhatsApp number on a phone, and a real Google Form submission (section 6.4).

---

### Credits
Icons: [Lucide](https://lucide.dev) (ISC licence). Fonts: Baloo 2 and Nunito via Google Fonts (Open Font License).
