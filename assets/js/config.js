/* =====================================================================
   LOTUS HANDMADE CREATIONS — SITE SETTINGS
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to connect your real contact
   details, WhatsApp number, Google Form and social media pages.
   Leave a value as "" (empty) and that link/button is hidden or shows
   a friendly "not connected yet" message — nothing fake is ever shown.
   ===================================================================== */

window.SITE_CONFIG = {

  businessName: "Lotus Handmade Creations",
  tagline: "Made with Love, Crafted by Hand.",
  currency: "LKR",

  /* Full public address of the website, ending with a slash.
     Example: "https://yourname.github.io/lotus-handmade-creations/"  */
  siteUrl: "https://dabared.github.io/lotus-handmade-creations/",

  /* ---------------- WhatsApp ----------------
     International format, digits only, no "+" or spaces.
     Sri Lanka example: 0771234567  ->  "94771234567"            */
  whatsappNumber: "94773465559",

  /* ---------------- Contact details (shown on Contact page & footer) --- */
  phoneDisplay: "",          // e.g. "077 123 4567"
  email: "",                 // e.g. "hello@yourdomain.lk"
  location: "",              // e.g. "Kandy, Sri Lanka" (city only is fine)
  businessHours: "",         // e.g. "Mon – Sat, 9.00 am – 6.00 pm"

  /* ---------------- Social media (leave "" to hide) ---------------- */
  instagramUrl: "",          // e.g. "https://www.instagram.com/yourpage"
  instagramHandle: "",       // e.g. "@yourpage"
  facebookUrl: "",           // e.g. "https://www.facebook.com/yourpage"

  /* ---------------- Google Form order system ----------------
     1. Paste your form's share link into "url"
        (the one ending in /viewform).
     2. OPTIONAL but recommended: paste the entry IDs so the form opens
        with the product already filled in. See README → "Google Forms".
     While "url" is empty the site will NOT pretend a form exists —
     customers are offered WhatsApp instead.                         */
  googleForm: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLScwnf3M8jMhvvuXynKGYHvugWokTB6K0y_PUCUB9AnEeyD09Q/viewform",
    fields: {
      productName: "entry.113237028",
      productId: "entry.1453302926",
      quantity: "entry.1113560969",
      colour: "entry.767190822"
    }
  },

  /* PRODUCTS FROM GOOGLE SHEET
     The website reads products live from this Google Sheet:
     https://docs.google.com/spreadsheets/d/17TqoXr_RrKNYZe5-tk_8WixAieV2ijPcil2Tix1qEZ8/edit
     Edit the "Products" tab and refresh the site — no code changes.
     The sheet must be shared "Anyone with the link → Viewer".
     Set id to "" to use assets/js/products.js instead.
     (products.js is also the automatic backup if the sheet can't load.) */
  productSheet: {
    id: "17TqoXr_RrKNYZe5-tk_8WixAieV2ijPcil2Tix1qEZ8",
    tab: "Products"
  },

  /* Delivery note used on product pages and policies. Edit freely. */
  deliveryNote: "Island-wide delivery across Sri Lanka. Delivery charges are confirmed with you before your order is finalised.",

  /* PREVIEW MODE
     true  = shows a small banner saying products & reviews are samples.
     Set to false once you have replaced the sample products and
     testimonials with your real ones.                               */
  previewMode: true,

  /* ---------------- Testimonials ----------------
     Replace with REAL customer reviews (with their permission).
     While sample: true, each card is clearly labelled "Sample review". */
  testimonials: [
    { name: "Sample Customer", place: "Colombo", text: "Replace this with a real customer review. Short, warm quotes about gifting and quality work best.", sample: true },
    { name: "Sample Customer", place: "Kandy",   text: "A second sample review. Ask happy customers if you may share their words and first name here.", sample: true },
    { name: "Sample Customer", place: "Galle",   text: "A third sample review. Delete any you don't need — the section adjusts automatically.", sample: true }
  ]
};
