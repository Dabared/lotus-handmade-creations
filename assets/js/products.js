/* =====================================================================
   LOTUS HANDMADE — PRODUCT CATALOGUE
   ---------------------------------------------------------------------
   Every product on the website comes from this file.
   Add, edit or remove products here — you never need to touch the
   page layouts. Full guide: README.md → "Managing products".

   ⚠️  ALL PRODUCTS BELOW ARE SAMPLE / PLACEHOLDER DATA.
       Names, prices and images are examples only. Replace them with
       your real items and photos, and remove  sample: true .

   FIELD GUIDE
   id            Unique code, never reuse.  e.g. "LHC-018"
   name          Product name shown to customers
   category      Must match one of the category "id"s in CATEGORIES
   description   One or two friendly sentences
   price         Number only, in LKR (no commas).  e.g. 3500
   image         Path to the photo. Put photos in assets/images/products/
   colours       List of colour names customers can choose
   availability  "In Stock" | "Made to Order" | "Out of Stock"
   customisation List of personalisation options (can be empty: [])
   details       Optional extra facts (size, material, care)
   featured      true = shown in "Featured" on the homepage
   bestSeller    true = shown in "Best Sellers" on the homepage
   sample        true = shows a "Sample" badge. Remove for real items.
   ===================================================================== */

window.CATEGORIES = [
  { id: "wool-dolls",   name: "Wool Dolls & Teddy Bears", page: "wool-dolls-teddy-bears.html", image: "assets/images/products/wool-doll.svg",     blurb: "Huggable dolls and teddies with sweet stitched faces." },
  { id: "crochet-toys", name: "Crochet Toys",             page: "crochet-toys.html",           image: "assets/images/products/cat.svg",           blurb: "Soft crochet birds, cats and animal friends." },
  { id: "baby",         name: "Baby Collection",          page: "baby-collection.html",        image: "assets/images/products/baby-booties.svg",  blurb: "Booties, hats, rompers and blankets in baby pink & blue." },
  { id: "home-decor",   name: "Home & Table Décor",       page: "home-table-decor.html",       image: "assets/images/products/table-doily.svg",   blurb: "Doilies, napkin rings and coasters for a beautiful table." },
  { id: "car",          name: "Car Accessories",          page: "car-accessories.html",        image: "assets/images/products/car-charm.svg",     blurb: "Mirror charms and tissue covers to brighten your ride." },
  { id: "bags",         name: "Bags & Purses",            page: "bags-purses.html",            image: "assets/images/products/tote-bag.svg",      blurb: "Everyday crochet totes and pretty coin purses." },
  { id: "accessories",  name: "Hats & Accessories",       page: "hats-accessories.html",       image: "assets/images/products/beanie.svg",        blurb: "Beanies, scrunchies and cosy wool accessories." }
];

window.PRODUCTS = [
  /* ---------- Wool Dolls & Teddy Bears ---------- */
  {
    id: "LHC-001", name: "Little Lotus Wool Doll", category: "wool-dolls",
    description: "Sample product. A sweet handmade wool doll in a maroon dress with a gold flower, long plaits and a little bow.",
    price: 4500, image: "assets/images/products/wool-doll.svg",
    colours: ["Maroon", "Pink", "Light Blue"], availability: "Made to Order",
    customisation: ["Dress colour", "Hair colour", "Name tag"],
    details: { Size: "Approx. 30 cm tall", Material: "Soft acrylic & cotton yarn", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: true, sample: true
  },
  {
    id: "LHC-002", name: "Classic Wool Teddy Bear", category: "wool-dolls",
    description: "Sample product. A cuddly teddy bear with a maroon bow and a little heart — a timeless birthday or baby-shower gift.",
    price: 3800, image: "assets/images/products/teddy-bear.svg",
    colours: ["Caramel Brown", "Cream", "Pink"], availability: "In Stock",
    customisation: ["Name embroidered on the foot", "Bow colour"],
    details: { Size: "Approx. 25 cm tall", Material: "Soft acrylic wool", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: true, sample: true
  },

  /* ---------- Crochet Toys ---------- */
  {
    id: "LHC-003", name: "Crochet Sky Bird", category: "crochet-toys",
    description: "Sample product. A round, happy little bird with a pink wing and golden beak — light and squishy for small hands.",
    price: 2200, image: "assets/images/products/bird.svg",
    colours: ["Light Blue", "Pink", "Gold"], availability: "In Stock",
    customisation: ["Body colour"],
    details: { Size: "Approx. 14 cm", Material: "Milk-cotton yarn", Care: "Hand wash" },
    featured: true, bestSeller: false, sample: true
  },
  {
    id: "LHC-004", name: "Crochet Kitty Cat", category: "crochet-toys",
    description: "Sample product. A sitting kitty with a maroon collar and golden bell, whiskers and a curly tail.",
    price: 3200, image: "assets/images/products/cat.svg",
    colours: ["Grey", "White", "Ginger"], availability: "Made to Order",
    customisation: ["Fur colour", "Collar colour"],
    details: { Size: "Approx. 20 cm", Material: "Cotton-blend yarn", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: true, sample: true
  },

  /* ---------- Baby Collection ---------- */
  {
    id: "LHC-005", name: "Baby Booties Pair", category: "baby",
    description: "Sample product. Soft knitted booties with cosy cuffs and tiny bows, for warm little feet.",
    price: 1900, image: "assets/images/products/baby-booties.svg",
    colours: ["Baby Pink", "Light Blue", "White"], availability: "In Stock",
    customisation: ["Size 0–3 / 3–6 / 6–12 months", "Bow colour"],
    details: { Size: "0–12 months", Material: "Baby-safe soft yarn", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: true, sample: true
  },
  {
    id: "LHC-006", name: "Baby Bear-Ear Hat", category: "baby",
    description: "Sample product. A snug knitted baby hat with little bear ears and a crochet flower.",
    price: 1800, image: "assets/images/products/baby-hat.svg",
    colours: ["Light Blue", "Baby Pink", "White"], availability: "In Stock",
    customisation: ["Size 0–6 / 6–12 months", "Flower colour"],
    details: { Size: "0–12 months", Material: "Baby-safe soft yarn", Care: "Hand wash" },
    featured: false, bestSeller: true, sample: true
  },
  {
    id: "LHC-007", name: "Baby Knitted Romper", category: "baby",
    description: "Sample product. A soft knitted romper with a white collar and golden buttons — perfect for photos and special days.",
    price: 5200, image: "assets/images/products/baby-romper.svg",
    colours: ["Baby Pink", "Light Blue", "White"], availability: "Made to Order",
    customisation: ["Size 0–3 / 3–6 / 6–12 months", "Baby's name embroidered"],
    details: { Size: "0–12 months", Material: "Baby-safe cotton yarn", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: false, sample: true
  },
  {
    id: "LHC-008", name: "Pink & Blue Baby Blanket", category: "baby",
    description: "Sample product. A cosy granny-square blanket in baby pink, light blue and white — a keepsake newborn gift.",
    price: 8500, image: "assets/images/products/baby-blanket.svg",
    colours: ["Pink & Blue", "Pink & White", "Blue & White"], availability: "Made to Order",
    customisation: ["Colour combination", "Baby's name embroidered"],
    details: { Size: "Approx. 75 × 90 cm", Material: "Baby-safe acrylic", Care: "Gentle machine wash, cool" },
    featured: false, bestSeller: false, sample: true
  },

  /* ---------- Home & Table Décor ---------- */
  {
    id: "LHC-009", name: "Lace Table Doily", category: "home-decor",
    description: "Sample product. A round crochet lace doily in cream with gold and maroon details — beautiful on a dining or side table.",
    price: 3500, image: "assets/images/products/table-doily.svg",
    colours: ["Cream & Gold", "White", "Maroon & Gold"], availability: "Made to Order",
    customisation: ["Size: 30 / 45 / 60 cm", "Colour combination"],
    details: { Size: "30 – 60 cm diameter", Material: "Mercerised cotton thread", Care: "Hand wash, press gently" },
    featured: true, bestSeller: true, sample: true
  },
  {
    id: "LHC-010", name: "Flower Napkin Rings (Set of 6)", category: "home-decor",
    description: "Sample product. Crochet napkin rings with little flowers to dress up your serviettes for family dinners and parties.",
    price: 2400, image: "assets/images/products/napkin-rings.svg",
    colours: ["Maroon & Gold", "Gold & Maroon", "White & Gold"], availability: "In Stock",
    customisation: ["Set of 4 / 6 / 8", "Colours to match your table"],
    details: { Size: "Approx. 5 cm ring", Material: "Cotton yarn", Care: "Hand wash" },
    featured: false, bestSeller: true, sample: true
  },
  {
    id: "LHC-011", name: "Crochet Coaster Set", category: "home-decor",
    description: "Sample product. A set of round crochet coasters in maroon, gold and cream to protect your table in style.",
    price: 1800, image: "assets/images/products/coasters.svg",
    colours: ["Maroon & Gold", "Cream", "Mixed"], availability: "In Stock",
    customisation: ["Set of 4 / 6", "Colour mix"],
    details: { Size: "Approx. 10 cm each", Material: "Cotton yarn", Care: "Hand wash" },
    featured: false, bestSeller: false, sample: true
  },

  /* ---------- Car Accessories ---------- */
  {
    id: "LHC-012", name: "Car Mirror Flower Charm", category: "car",
    description: "Sample product. A crochet flower charm with beads and a tassel to hang from your car's rear-view mirror.",
    price: 1500, image: "assets/images/products/car-charm.svg",
    colours: ["Maroon & Gold", "Pink & White", "Light Blue & White"], availability: "In Stock",
    customisation: ["Flower colour", "Add initial bead"],
    details: { Size: "Approx. 22 cm drop", Material: "Cotton yarn & wooden beads", Care: "Spot clean" },
    featured: true, bestSeller: true, sample: true
  },
  {
    id: "LHC-013", name: "Car Tissue Box Cover", category: "car",
    description: "Sample product. A crochet tissue box cover in maroon with gold stripes and a flower — neat and pretty on the dashboard or back seat.",
    price: 2800, image: "assets/images/products/car-tissue-cover.svg",
    colours: ["Maroon & Gold", "Cream & Gold"], availability: "Made to Order",
    customisation: ["Colour", "Made to fit your tissue box size"],
    details: { Size: "Fits standard tissue boxes", Material: "Acrylic yarn", Care: "Hand wash" },
    featured: false, bestSeller: false, sample: true
  },

  /* ---------- Bags & Purses ---------- */
  {
    id: "LHC-014", name: "Lotus Crochet Tote Bag", category: "bags",
    description: "Sample product. A sturdy maroon tote with a golden lotus motif, roomy enough for books, shopping or a day out.",
    price: 5500, image: "assets/images/products/tote-bag.svg",
    colours: ["Maroon & Gold", "Cream & Gold"], availability: "In Stock",
    customisation: ["Motif colour", "Fabric lining"],
    details: { Size: "Approx. 35 × 38 cm", Material: "Cotton cord yarn", Care: "Spot clean" },
    featured: false, bestSeller: true, sample: true
  },
  {
    id: "LHC-015", name: "Flower Coin Purse", category: "bags",
    description: "Sample product. A small kiss-clasp purse in soft pink with a maroon crochet flower.",
    price: 1800, image: "assets/images/products/coin-purse.svg",
    colours: ["Pink", "Light Blue", "Cream"], availability: "In Stock",
    customisation: ["Purse colour", "Flower colour"],
    details: { Size: "Approx. 12 × 10 cm", Material: "Cotton yarn, metal clasp", Care: "Spot clean" },
    featured: false, bestSeller: false, sample: true
  },

  /* ---------- Hats & Accessories ---------- */
  {
    id: "LHC-016", name: "Maroon Pom-Pom Beanie", category: "accessories",
    description: "Sample product. A ribbed maroon beanie with a golden pom-pom, ideal for hill-country trips and chilly mornings.",
    price: 2700, image: "assets/images/products/beanie.svg",
    colours: ["Maroon", "Cream", "Light Blue", "Pink"], availability: "In Stock",
    customisation: ["Kids / Adult size", "Pom-pom colour"],
    details: { Size: "Kids & adult sizes", Material: "Soft acrylic wool", Care: "Hand wash" },
    featured: false, bestSeller: false, sample: true
  },
  {
    id: "LHC-017", name: "Crochet Scrunchie Set", category: "accessories",
    description: "Sample product. Three soft crochet scrunchies in maroon, gold and pink — gentle on hair.",
    price: 1200, image: "assets/images/products/scrunchies.svg",
    colours: ["Maroon, Gold & Pink", "Pastel Mix"], availability: "Out of Stock",
    customisation: ["Choose your 3 colours"],
    details: { Size: "One size", Material: "Cotton yarn, soft elastic", Care: "Hand wash" },
    featured: false, bestSeller: false, sample: true
  }
];
