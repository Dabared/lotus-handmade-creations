/* =====================================================================
   LOTUS HANDMADE CREATIONS — PRODUCT CATALOGUE
   ---------------------------------------------------------------------
   Every product on the website comes from this file.
   Add, edit or remove products here — you never need to touch the
   page layouts. Full guide: README.md → "Managing products".

   ⚠️  ALL PRODUCTS BELOW ARE SAMPLE / PLACEHOLDER DATA.
       Names, prices and images are examples only. Replace them with
       your real items, and set  sample: false  (or delete the line).

   FIELD GUIDE
   id            Unique code, never reuse.  e.g. "LHC-013"
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
  { id: "wool-dolls",  name: "Wool Dolls & Teddy Bears", page: "wool-dolls-teddy-bears.html", image: "assets/images/products/teddy-bear.svg",   blurb: "Huggable friends with sweet stitched faces." },
  { id: "crochet-toys",name: "Crochet Toys",             page: "crochet-toys.html",           image: "assets/images/products/octopus.svg",      blurb: "Soft amigurumi animals for little hands." },
  { id: "bags",        name: "Bags & Purses",            page: "bags-purses.html",            image: "assets/images/products/tote-bag.svg",     blurb: "Everyday totes and pretty coin purses." },
  { id: "baby",        name: "Baby Collection",          page: "baby-collection.html",        image: "assets/images/products/baby-blanket.svg", blurb: "Gentle blankets, booties and newborn gifts." },
  { id: "accessories", name: "Hats & Accessories",       page: "hats-accessories.html",       image: "assets/images/products/beanie.svg",       blurb: "Beanies, scarves and hair accessories." }
];

window.PRODUCTS = [
  {
    id: "LHC-001",
    name: "Classic Wool Teddy Bear",
    category: "wool-dolls",
    description: "Sample product. A soft, cuddly teddy bear with a stitched smile and a little bow tie — a timeless birthday or baby-shower gift.",
    price: 3800,
    image: "assets/images/products/teddy-bear.svg",
    colours: ["Caramel Brown", "Cream", "Blush Pink"],
    availability: "In Stock",
    customisation: ["Name embroidered on the foot", "Choice of bow colour"],
    details: { Size: "Approx. 25 cm tall", Material: "Soft acrylic wool", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: true, sample: true
  },
  {
    id: "LHC-002",
    name: "Lavender Bunny Doll",
    category: "wool-dolls",
    description: "Sample product. A gentle bunny doll in a lavender dress with long floppy ears — perfect for bedtime cuddles.",
    price: 4200,
    image: "assets/images/products/bunny-doll.svg",
    colours: ["Lavender", "Mint", "Pink"],
    availability: "Made to Order",
    customisation: ["Dress colour", "Name tag"],
    details: { Size: "Approx. 30 cm tall incl. ears", Material: "Cotton-blend yarn", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: false, sample: true
  },
  {
    id: "LHC-003",
    name: "Happy Octopus Buddy",
    category: "crochet-toys",
    description: "Sample product. A cheerful crochet octopus with curly legs. Light, squishy and loved by toddlers.",
    price: 2500,
    image: "assets/images/products/octopus.svg",
    colours: ["Pink", "Lavender", "Mint", "Sky Blue"],
    availability: "In Stock",
    customisation: ["Choice of colour"],
    details: { Size: "Approx. 15 cm", Material: "Milk-cotton yarn", Care: "Hand wash" },
    featured: true, bestSeller: true, sample: true
  },
  {
    id: "LHC-004",
    name: "Little Blue Whale",
    category: "crochet-toys",
    description: "Sample product. A round, smiley whale with a little water spout — a calm, ocean-themed nursery friend.",
    price: 2900,
    image: "assets/images/products/whale.svg",
    colours: ["Sky Blue", "Mint", "Lavender"],
    availability: "In Stock",
    customisation: ["Choice of colour"],
    details: { Size: "Approx. 18 cm long", Material: "Milk-cotton yarn", Care: "Hand wash" },
    featured: false, bestSeller: true, sample: true
  },
  {
    id: "LHC-005",
    name: "Sleepy Elephant Plush",
    category: "crochet-toys",
    description: "Sample product. A sweet lilac elephant with big pink ears and a curled trunk.",
    price: 3600,
    image: "assets/images/products/elephant.svg",
    colours: ["Lilac", "Grey", "Pink"],
    availability: "Made to Order",
    customisation: ["Choice of colour", "Name on ear"],
    details: { Size: "Approx. 22 cm", Material: "Cotton-blend yarn", Care: "Hand wash, dry flat" },
    featured: true, bestSeller: false, sample: true
  },
  {
    id: "LHC-006",
    name: "Lotus Crochet Tote Bag",
    category: "bags",
    description: "Sample product. A sturdy everyday tote with a crocheted lotus motif. Roomy enough for books, shopping or a day out.",
    price: 5500,
    image: "assets/images/products/tote-bag.svg",
    colours: ["Natural Beige", "Blush Pink", "Sage Green"],
    availability: "In Stock",
    customisation: ["Motif colour", "Fabric lining"],
    details: { Size: "Approx. 35 × 38 cm", Material: "Cotton cord yarn", Care: "Spot clean" },
    featured: true, bestSeller: true, sample: true
  },
  {
    id: "LHC-007",
    name: "Bobble Coin Purse",
    category: "bags",
    description: "Sample product. A small kiss-clasp purse with bobble stitch texture — a lovely little gift.",
    price: 1800,
    image: "assets/images/products/coin-purse.svg",
    colours: ["Pink", "Lavender", "Mint", "Cream"],
    availability: "In Stock",
    customisation: ["Choice of colour"],
    details: { Size: "Approx. 12 × 10 cm", Material: "Cotton yarn, metal clasp", Care: "Spot clean" },
    featured: false, bestSeller: true, sample: true
  },
  {
    id: "LHC-008",
    name: "Newborn Booties",
    category: "baby",
    description: "Sample product. Soft, warm booties for tiny feet, finished with little pom-poms.",
    price: 1900,
    image: "assets/images/products/baby-booties.svg",
    colours: ["White", "Mint", "Pink", "Lavender"],
    availability: "In Stock",
    customisation: ["Size 0–3 / 3–6 / 6–12 months", "Pom-pom colour"],
    details: { Size: "0–12 months", Material: "Baby-safe soft yarn", Care: "Hand wash, dry flat" },
    featured: false, bestSeller: true, sample: true
  },
  {
    id: "LHC-009",
    name: "Pastel Granny-Square Baby Blanket",
    category: "baby",
    description: "Sample product. A cosy patchwork blanket in soft pastels — a keepsake gift for a new arrival.",
    price: 8500,
    image: "assets/images/products/baby-blanket.svg",
    colours: ["Pastel Mix", "Pink & Cream", "Mint & Cream"],
    availability: "Made to Order",
    customisation: ["Colour combination", "Baby's name embroidered"],
    details: { Size: "Approx. 75 × 90 cm", Material: "Baby-safe acrylic", Care: "Gentle machine wash, cool" },
    featured: true, bestSeller: false, sample: true
  },
  {
    id: "LHC-010",
    name: "Pom-Pom Beanie",
    category: "accessories",
    description: "Sample product. A ribbed beanie with a fluffy pom-pom, ideal for hill-country trips and chilly mornings.",
    price: 2700,
    image: "assets/images/products/beanie.svg",
    colours: ["Pink", "Lavender", "Cream", "Brown"],
    availability: "In Stock",
    customisation: ["Kids / Adult size", "Pom-pom colour"],
    details: { Size: "Kids & adult sizes", Material: "Soft acrylic wool", Care: "Hand wash" },
    featured: false, bestSeller: false, sample: true
  },
  {
    id: "LHC-011",
    name: "Striped Wool Scarf",
    category: "accessories",
    description: "Sample product. A light, soft scarf with pastel stripes and fringed ends.",
    price: 3200,
    image: "assets/images/products/scarf.svg",
    colours: ["Mint & Pink", "Lavender & Cream"],
    availability: "Out of Stock",
    customisation: ["Stripe colours", "Length"],
    details: { Size: "Approx. 150 cm long", Material: "Soft acrylic wool", Care: "Hand wash, dry flat" },
    featured: false, bestSeller: false, sample: true
  },
  {
    id: "LHC-012",
    name: "Flower Headband & Scrunchie Set",
    category: "accessories",
    description: "Sample product. A soft headband with a crochet flower plus a matching scrunchie.",
    price: 1500,
    image: "assets/images/products/headband.svg",
    colours: ["Lavender", "Pink", "Mint"],
    availability: "In Stock",
    customisation: ["Flower colour"],
    details: { Size: "Kids & adult sizes", Material: "Cotton yarn", Care: "Hand wash" },
    featured: true, bestSeller: false, sample: true
  }
];
