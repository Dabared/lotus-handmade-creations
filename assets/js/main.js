/* =====================================================================
   Lotus Handmade Creations — site behaviour
   You normally do NOT need to edit this file.
   Settings  → assets/js/config.js
   Products  → assets/js/products.js
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var PRODUCTS = window.PRODUCTS || [];
  var CATEGORIES = window.CATEGORIES || [];
  var body = document.body;
  document.documentElement.classList.remove("no-js");

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || "") + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  }
  function formatPrice(n) {
    var num = Number(n);
    if (!isFinite(num)) return "Price on request";
    return (CFG.currency || "LKR") + " " + num.toLocaleString("en-LK", { maximumFractionDigits: 0 });
  }
  function catById(id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i]; return null; }
  function productById(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function productUrl(p) { return "product.html?id=" + encodeURIComponent(p.id); }

  var COLOUR_MAP = {
    maroon: "#7A2050", gold: "#F2BE3A", pink: "#F6C1D1", "baby pink": "#F6C1D1", "blush pink": "#F4B9CB",
    blue: "#BFDDF2", "light blue": "#BFDDF2", "sky blue": "#BFDDF2", lavender: "#DCD2F5", lilac: "#CFC2EE",
    mint: "#D7EBDD", "sage green": "#BFD8C3", cream: "#FBF3E4", white: "#FFFFFF", brown: "#A47C68",
    "caramel brown": "#C9926A", ginger: "#E8A25E", "natural beige": "#EAD7BD", grey: "#C9C3CF",
    mixed: "linear-gradient(135deg,#7A2050 0 33%,#F2BE3A 33% 66%,#FBF3E4 66%)",
    "pastel mix": "linear-gradient(135deg,#F6C1D1 0 33%,#BFDDF2 33% 66%,#FFFFFF 66%)"
  };
  function swatchStyle(name) {
    var key = String(name).toLowerCase();
    if (COLOUR_MAP[key]) return "background:" + COLOUR_MAP[key];
    // combos like "Maroon & Gold" or "Maroon, Gold & Pink"
    var parts = key.split(/\s*(?:&|,)\s*/).filter(function (p) { return COLOUR_MAP[p]; });
    if (parts.length > 1) {
      var step = 100 / parts.length, stops = parts.map(function (p, i) {
        return COLOUR_MAP[p] + " " + (i * step).toFixed(0) + "% " + ((i + 1) * step).toFixed(0) + "%";
      });
      return "background:linear-gradient(135deg," + stops.join(",") + ")";
    }
    return "background:#EEE";
  }

  function availabilityBadge(a) {
    var map = { "In Stock": "stock", "Made to Order": "made", "Out of Stock": "out" };
    return '<span class="badge badge--' + (map[a] || "stock") + '">' + esc(a || "In Stock") + "</span>";
  }

  /* ------------------------------------------------------------------
     Ordering: WhatsApp + Google Form
     ------------------------------------------------------------------ */
  var waNumber = String(CFG.whatsappNumber || "").replace(/\D/g, "");

  function waLink(message) {
    if (!waNumber) return null;
    return "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(message);
  }
  function orderMessage(p, qty, colour) {
    qty = qty || 1;
    var lines = [
      "Hello " + (CFG.businessName || "Lotus Handmade Creations") + "! I would like to order:",
      "",
      "Product: " + p.name,
      "Product ID: " + p.id,
      "Price: " + formatPrice(p.price) + " each",
      "Quantity: " + qty
    ];
    if (colour) lines.push("Preferred colour: " + colour);
    if (qty > 1 && isFinite(Number(p.price))) lines.push("Estimated total: " + formatPrice(Number(p.price) * qty) + " (+ delivery)");
    lines.push("", "Product link: " + absoluteUrl(productUrl(p)));
    return lines.join("\n");
  }
  function absoluteUrl(rel) {
    try { return new URL(rel, window.location.href).href; } catch (e) { return rel; }
  }
  function formLink(p, qty, colour) {
    var gf = CFG.googleForm || {};
    if (!gf.url) return null;
    var url = gf.url.replace(/\?.*$/, "");
    var f = gf.fields || {};
    var q = ["usp=pp_url"];
    if (p && f.productName) q.push(f.productName + "=" + encodeURIComponent(p.name));
    if (p && f.productId) q.push(f.productId + "=" + encodeURIComponent(p.id));
    if (f.quantity && qty) q.push(f.quantity + "=" + encodeURIComponent(qty));
    if (f.colour && colour) q.push(f.colour + "=" + encodeURIComponent(colour));
    return url + "?" + q.join("&");
  }

  /* Toast for "not connected yet" messages — honest, never fake. */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite");
      body.appendChild(t);
    }
    t.innerHTML = icon("info") + "<span>" + esc(msg) + "</span>";
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 4500);
  }
  var MSG_NO_WA = "WhatsApp ordering isn't connected yet — the shop's WhatsApp number still needs to be added.";
  var MSG_NO_FORM = waNumber
    ? "Our online order form is coming soon. Please order on WhatsApp for now."
    : "Online ordering is being set up. Please check back soon!";

  /* Global click handler for order buttons rendered anywhere */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-order]");
    if (!btn) return;
    var type = btn.getAttribute("data-order");
    var p = btn.getAttribute("data-id") ? productById(btn.getAttribute("data-id")) : null;
    var qty = 1, colour = "";
    var form = btn.closest("[data-order-form]");
    if (form) {
      var qi = $("#qty", form); if (qi) qty = Math.max(1, parseInt(qi.value, 10) || 1);
      var ci = $("input[name=colour]:checked", form); if (ci) colour = ci.value;
    }
    var url;
    if (type === "wa") {
      url = p ? waLink(orderMessage(p, qty, colour)) : waLink(btn.getAttribute("data-msg") || "Hello " + (CFG.businessName || "") + "! I have a question.");
      if (!url) { e.preventDefault(); toast(MSG_NO_WA); return; }
    } else if (type === "form") {
      url = formLink(p, qty, colour);
      if (!url) { e.preventDefault(); toast(MSG_NO_FORM); return; }
    }
    if (url) {
      e.preventDefault();
      window.open(url, "_blank", "noopener");
    }
  });

  /* ------------------------------------------------------------------
     Product card
     ------------------------------------------------------------------ */
  function productCard(p) {
    var cat = catById(p.category);
    var out = p.availability === "Out of Stock";
    var sw = (p.colours || []).slice(0, 5).map(function (c) {
      return '<span class="swatch" style="' + swatchStyle(c) + '" title="' + esc(c) + '"></span>';
    }).join("");
    return '' +
      '<article class="product-card reveal">' +
        '<a class="product-media" href="' + productUrl(p) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + ' — handmade ' + esc(cat ? cat.name.toLowerCase() : "item") + '" loading="lazy" width="400" height="400">' +
          '<span class="badges">' + (p.sample ? '<span class="badge badge--sample">Sample</span>' : "") + availabilityBadge(p.availability) + "</span>" +
        "</a>" +
        '<div class="product-body">' +
          '<div class="product-cat">' + esc(cat ? cat.name : "") + "</div>" +
          '<h3 class="product-title"><a href="' + productUrl(p) + '">' + esc(p.name) + "</a></h3>" +
          '<div class="product-price">' + formatPrice(p.price) + "</div>" +
          '<div class="swatches" aria-label="Available colours: ' + esc((p.colours || []).join(", ")) + '">' + sw + "</div>" +
          '<div class="product-actions">' +
            '<a class="btn btn--pink" href="' + productUrl(p) + '">' + (out ? "View details" : "Request Order") + "</a>" +
            (out ? "" : '<a class="btn btn--wa" href="#" data-order="wa" data-id="' + esc(p.id) + '" aria-label="Order ' + esc(p.name) + ' on WhatsApp">' + icon("message-circle") + '<span class="label">WhatsApp</span></a>') +
          "</div>" +
        "</div>" +
      "</article>";
  }

  /* ------------------------------------------------------------------
     Header: mobile drawer, active link, dropdown
     ------------------------------------------------------------------ */
  function initHeader() {
    var drawer = $("#drawer");
    var toggle = $(".menu-toggle");
    function open() { drawer.classList.add("is-open"); body.classList.add("no-scroll"); toggle.setAttribute("aria-expanded", "true"); var c = $(".drawer-close", drawer); if (c) c.focus(); }
    function close() { drawer.classList.remove("is-open"); body.classList.remove("no-scroll"); toggle.setAttribute("aria-expanded", "false"); }
    if (drawer && toggle) {
      toggle.addEventListener("click", open);
      $all("[data-close-drawer]", drawer).forEach(function (el) { el.addEventListener("click", close); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("is-open")) { close(); toggle.focus(); } });
    }
    var page = body.getAttribute("data-page");
    $all("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
    });
    // Dropdown keyboard / touch support
    $all(".has-sub > button").forEach(function (b) {
      b.addEventListener("click", function () {
        var li = b.parentNode, isOpen = li.classList.toggle("is-open");
        b.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
    document.addEventListener("click", function (e) {
      $all(".has-sub.is-open").forEach(function (li) { if (!li.contains(e.target)) { li.classList.remove("is-open"); $("button", li).setAttribute("aria-expanded", "false"); } });
    });
  }

  /* ------------------------------------------------------------------
     Config-driven bits: banner, contact, socials, year, WhatsApp float
     ------------------------------------------------------------------ */
  function initConfig() {
    if (CFG.previewMode) {
      var b = document.createElement("div");
      b.className = "preview-banner";
      b.innerHTML = icon("info") + "Preview: products, prices and reviews shown are samples and will be replaced soon.";
      var hdr = $(".site-header"); body.insertBefore(b, hdr || body.firstChild);
    }
    $all("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // Text values: <span data-config="email">
    $all("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config"), val = CFG[key];
      var wrapper = el.closest("[data-config-wrap]");
      if (!val) { if (wrapper) wrapper.hidden = true; return; }
      if (key === "email") { el.innerHTML = '<a href="mailto:' + esc(val) + '">' + esc(val) + "</a>"; }
      else if (key === "phoneDisplay") { el.innerHTML = '<a href="tel:' + esc(String(val).replace(/[^\d+]/g, "")) + '">' + esc(val) + "</a>"; }
      else el.textContent = val;
    });
    // Social links: <a data-social="instagramUrl">
    $all("[data-social]").forEach(function (a) {
      var url = CFG[a.getAttribute("data-social")];
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
      else a.hidden = true;
    });
    $all("[data-social-group]").forEach(function (g) {
      if (!$all("[data-social]", g).some(function (a) { return !a.hidden; })) g.hidden = true;
    });
    // Show / hide elements depending on whether WhatsApp/form/social are configured
    $all("[data-if]").forEach(function (el) {
      var cond = el.getAttribute("data-if"), ok = false;
      if (cond === "whatsapp") ok = !!waNumber;
      else if (cond === "no-whatsapp") ok = !waNumber;
      else if (cond === "form") ok = !!(CFG.googleForm && CFG.googleForm.url);
      else if (cond === "no-form") ok = !(CFG.googleForm && CFG.googleForm.url);
      else if (cond === "contact") ok = !!(CFG.phoneDisplay || CFG.email || waNumber || CFG.location);
      else if (cond === "no-contact") ok = !(CFG.phoneDisplay || CFG.email || waNumber || CFG.location);
      else if (cond === "instagram") ok = !!CFG.instagramUrl;
      el.hidden = !ok;
    });

    // Floating WhatsApp button
    var f = document.createElement("a");
    f.href = "#"; f.className = "wa-float"; f.setAttribute("data-order", "wa");
    f.setAttribute("data-msg", "Hello " + (CFG.businessName || "") + "! I'd like to know more about your handmade products.");
    f.setAttribute("aria-label", "Chat with us on WhatsApp");
    f.innerHTML = icon("message-circle") + '<span class="label">Chat with us</span>';
    body.appendChild(f);
  }

  /* ------------------------------------------------------------------
     Home page
     ------------------------------------------------------------------ */
  function renderCategories(el) {
    el.innerHTML = CATEGORIES.map(function (c) {
      return '<a class="cat-card reveal" href="' + esc(c.page) + '">' +
        '<img src="' + esc(c.image) + '" alt="' + esc(c.name) + '" loading="lazy" width="300" height="300">' +
        '<div class="cat-card-body"><h3>' + esc(c.name) + "</h3><p>" + esc(c.blurb) + '</p><span class="more">Shop ' + icon("arrow-right") + "</span></div></a>";
    }).join("");
  }
  function renderList(el, list, limit) {
    list = list.slice(0, limit || list.length);
    el.innerHTML = list.length ? list.map(productCard).join("") :
      '<p class="muted">No products to show yet.</p>';
  }
  function renderTestimonials(el) {
    var t = CFG.testimonials || [];
    var section = el.closest("section");
    if (!t.length) { if (section) section.hidden = true; return; }
    var stars = new Array(6).join(icon("star"));
    el.innerHTML = t.map(function (r) {
      return '<figure class="testi reveal"><div class="stars" aria-hidden="true">' + stars + "</div>" +
        "<blockquote>“" + esc(r.text) + "”</blockquote>" +
        "<figcaption>" + esc(r.name) + (r.place ? " <span>· " + esc(r.place) + "</span>" : "") +
        (r.sample ? '<span class="badge badge--sample">Sample review</span>' : "") + "</figcaption></figure>";
    }).join("");
  }
  function renderGallery(el) {
    var items = PRODUCTS.slice(0, 6);
    var href = CFG.instagramUrl;
    el.innerHTML = items.map(function (p) {
      var img = '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" width="200" height="200">';
      return href ? '<a href="' + esc(href) + '" target="_blank" rel="noopener" aria-label="See ' + esc(p.name) + ' on Instagram">' + img + "</a>"
                  : '<a href="' + productUrl(p) + '" aria-label="' + esc(p.name) + '">' + img + "</a>";
    }).join("");
  }

  /* ------------------------------------------------------------------
     Shop / category pages
     ------------------------------------------------------------------ */
  function initShop(root) {
    var fixedCat = body.getAttribute("data-category") || "";
    var params = new URLSearchParams(window.location.search);
    var state = {
      q: params.get("q") || "",
      cat: fixedCat || params.get("cat") || "all",
      sort: params.get("sort") || "featured",
      avail: params.get("avail") || "all"
    };
    var grid = $("[data-shop-grid]", root);
    var count = $("[data-shop-count]", root);
    var search = $("#shop-search", root);
    var sort = $("#shop-sort", root);
    var chips = $("[data-shop-chips]", root);

    if (chips) {
      var all = [{ id: "all", name: "All" }].concat(CATEGORIES);
      chips.innerHTML = all.map(function (c) {
        if (fixedCat) {
          var href = c.id === "all" ? "shop.html" : c.page;
          return '<a class="chip' + (c.id === state.cat ? " is-active" : "") + '" href="' + esc(href) + '"' + (c.id === state.cat ? ' aria-current="page"' : "") + ">" + esc(c.name) + "</a>";
        }
        return '<button type="button" class="chip' + (c.id === state.cat ? " is-active" : "") + '" data-cat="' + esc(c.id) + '" aria-pressed="' + (c.id === state.cat) + '">' + esc(c.name) + "</button>";
      }).join("");
      chips.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-cat]"); if (!b) return;
        state.cat = b.getAttribute("data-cat");
        $all("button[data-cat]", chips).forEach(function (x) { var on = x === b; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", on); });
        update();
      });
    }
    if (search) {
      search.value = state.q;
      var t; search.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { state.q = search.value.trim(); update(); }, 150); });
    }
    if (sort) { sort.value = state.sort; sort.addEventListener("change", function () { state.sort = sort.value; update(); }); }

    function update() {
      var q = state.q.toLowerCase();
      var list = PRODUCTS.filter(function (p) {
        if (state.cat !== "all" && p.category !== state.cat) return false;
        if (!q) return true;
        var cat = catById(p.category);
        var hay = [p.name, p.id, p.description, cat && cat.name, (p.colours || []).join(" ")].join(" ").toLowerCase();
        return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
      });
      var order = { "In Stock": 0, "Made to Order": 1, "Out of Stock": 2 };
      list.sort(function (a, b) {
        switch (state.sort) {
          case "price-asc": return a.price - b.price;
          case "price-desc": return b.price - a.price;
          case "name": return a.name.localeCompare(b.name);
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (order[a.availability] || 0) - (order[b.availability] || 0);
        }
      });
      if (count) count.textContent = list.length + (list.length === 1 ? " product" : " products");
      grid.innerHTML = list.length ? list.map(productCard).join("") :
        '<div class="empty-state" style="grid-column:1/-1">' + icon("search") + "<h3>No products found</h3><p class=\"muted\">Try another word, or ask us for a custom piece.</p>" +
        '<a class="btn btn--ghost btn--sm" href="custom-orders.html">Request a custom order</a></div>';
      initReveal(grid);
      // Keep URL shareable (shop page only)
      if (!fixedCat && window.history && history.replaceState) {
        var p = new URLSearchParams();
        if (state.q) p.set("q", state.q);
        if (state.cat !== "all") p.set("cat", state.cat);
        if (state.sort !== "featured") p.set("sort", state.sort);
        var qs = p.toString();
        history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
      }
    }
    update();
  }

  /* ------------------------------------------------------------------
     Product detail page
     ------------------------------------------------------------------ */
  function initProduct(root) {
    var id = new URLSearchParams(window.location.search).get("id");
    var p = id && productById(id);
    if (!p) {
      root.innerHTML = '<div class="empty-state">' + icon("package") + "<h1>Product not found</h1><p class=\"muted\">This item may have sold out or moved.</p>" +
        '<a class="btn btn--primary" href="shop.html">Browse all products</a></div>';
      document.title = "Product not found | " + CFG.businessName;
      return;
    }
    var cat = catById(p.category);
    var out = p.availability === "Out of Stock";
    var title = p.name + " | " + (cat ? cat.name + " | " : "") + CFG.businessName;
    document.title = title;
    setMeta("description", p.description.replace(/^Sample product\.\s*/, "") + " Handmade in Sri Lanka. " + formatPrice(p.price) + ".");
    setMeta("og:title", title, true);
    setMeta("og:description", p.description, true);
    var canonical = (CFG.siteUrl || "").replace(/\/?$/, "/") + productUrl(p);
    setMeta("og:url", canonical, true);
    var link = $('link[rel="canonical"]'); if (link) link.href = canonical;

    var crumbs = $("[data-crumbs]");
    if (crumbs) crumbs.innerHTML = '<a href="index.html">Home</a> / <a href="shop.html">Shop</a>' + (cat ? ' / <a href="' + esc(cat.page) + '">' + esc(cat.name) + "</a>" : "") + " / <span>" + esc(p.name) + "</span>";

    var colours = (p.colours || []).map(function (c, i) {
      var cid = "c" + i;
      return '<input type="radio" name="colour" id="' + cid + '" value="' + esc(c) + '"' + (i === 0 ? " checked" : "") + '>' +
        '<label for="' + cid + '"><span class="swatch" style="' + swatchStyle(c) + '"></span>' + esc(c) + "</label>";
    }).join("");
    var custom = (p.customisation || []).map(function (c) { return "<li>" + icon("check") + "<span>" + esc(c) + "</span></li>"; }).join("");
    var details = p.details ? Object.keys(p.details).map(function (k) { return "<tr><th scope=\"row\">" + esc(k) + "</th><td>" + esc(p.details[k]) + "</td></tr>"; }).join("") : "";

    root.innerHTML =
      '<div class="pd-grid">' +
        '<div class="pd-media"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" width="800" height="800">' +
          '<span class="badges">' + (p.sample ? '<span class="badge badge--sample">Sample product</span>' : "") + availabilityBadge(p.availability) + "</span></div>" +
        '<div class="pd-info" data-order-form>' +
          '<div class="product-cat">' + esc(cat ? cat.name : "") + "</div>" +
          "<h1>" + esc(p.name) + "</h1>" +
          '<div class="pd-price">' + formatPrice(p.price) + "</div>" +
          '<div class="pd-meta"><span class="product-id">Product ID: ' + esc(p.id) + "</span>" + availabilityBadge(p.availability) + "</div>" +
          '<p class="pd-desc">' + esc(p.description) + "</p>" +
          (colours ? '<fieldset class="opt-group"><legend>Choose a colour</legend><div class="colour-options">' + colours + "</div></fieldset>" : "") +
          (out ? "" :
          '<div class="opt-group"><label class="opt-label" for="qty">Quantity</label>' +
            '<div class="qty"><button type="button" data-qty="-1" aria-label="Decrease quantity">' + icon("minus") + "</button>" +
            '<input id="qty" type="number" inputmode="numeric" min="1" max="50" value="1">' +
            '<button type="button" data-qty="1" aria-label="Increase quantity">' + icon("plus") + "</button></div></div>") +
          (custom ? '<div class="opt-label">Customisation available</div><ul class="custom-list">' + custom + "</ul>" : "") +
          (out ?
            '<div class="callout">' + icon("info") + '<span>This item is currently out of stock. Message us — we can often make one to order.</span></div>' +
            '<div class="pd-actions"><a href="#" class="btn btn--wa" data-order="wa" data-id="' + esc(p.id) + '">' + icon("message-circle") + "Ask about this item</a></div>"
          :
            '<div class="pd-actions">' +
              '<a href="#" class="btn btn--primary" data-order="form" data-id="' + esc(p.id) + '">' + icon("clipboard-list") + "Request Order</a>" +
              '<a href="#" class="btn btn--wa" data-order="wa" data-id="' + esc(p.id) + '">' + icon("message-circle") + "Order on WhatsApp</a>" +
            "</div>") +
          '<div class="note-box">' + icon("truck") + "<span>" + esc(CFG.deliveryNote || "") + ' <a href="delivery-returns.html">Delivery &amp; returns</a></span></div>' +
          (details ? '<table class="spec-table"><caption class="visually-hidden">Product details</caption>' + details + "</table>" : "") +
        "</div>" +
      "</div>";

    var qty = $("#qty", root);
    $all("[data-qty]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = (parseInt(qty.value, 10) || 1) + parseInt(b.getAttribute("data-qty"), 10);
        qty.value = Math.min(50, Math.max(1, v));
      });
    });
    if (qty) qty.addEventListener("change", function () { qty.value = Math.min(50, Math.max(1, parseInt(qty.value, 10) || 1)); });

    // Related products
    var rel = $("[data-related]");
    if (rel) {
      var list = PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; });
      if (list.length < 4) list = list.concat(PRODUCTS.filter(function (x) { return x.category !== p.category && x.featured; })).slice(0, 4);
      renderList(rel, list, 4);
    }

    // Structured data for Google
    var ld = {
      "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.id,
      image: absoluteUrl(p.image), description: p.description,
      brand: { "@type": "Brand", name: CFG.businessName },
      category: cat ? cat.name : undefined,
      offers: {
        "@type": "Offer", priceCurrency: "LKR", price: String(p.price), url: canonical,
        availability: out ? "https://schema.org/OutOfStock" : (p.availability === "Made to Order" ? "https://schema.org/PreOrder" : "https://schema.org/InStock"),
        areaServed: "LK"
      }
    };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
  function setMeta(name, value, isProp) {
    var sel = isProp ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var m = $(sel); if (m) m.setAttribute("content", value);
  }

  /* ------------------------------------------------------------------
     Custom-order product dropdown (custom orders page)
     ------------------------------------------------------------------ */
  function initCustom() {
    var el = $("[data-custom-wa]");
    if (!el) return;
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var msg = "Hello " + CFG.businessName + "! I'd like to request a custom handmade order.\n\n" +
        "What I'd like: \nColours: \nSize: \nName/personalisation: \nNeeded by (date): \nDelivery city: ";
      var url = waLink(msg);
      if (!url) { toast(MSG_NO_WA); return; }
      window.open(url, "_blank", "noopener");
    });
  }

  /* ------------------------------------------------------------------
     Subtle reveal-on-scroll
     ------------------------------------------------------------------ */
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -40px 0px" }) : null;
  function initReveal(root) {
    $all(".reveal:not(.is-in)", root).forEach(function (el, i) {
      if (!io) { el.classList.add("is-in"); return; }
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  initConfig();
  initHeader();
  var el;
  if ((el = $("[data-categories]"))) renderCategories(el);
  if ((el = $("[data-featured]"))) renderList(el, PRODUCTS.filter(function (p) { return p.featured; }), 8);
  if ((el = $("[data-bestsellers]"))) renderList(el, PRODUCTS.filter(function (p) { return p.bestSeller; }), 4);
  if ((el = $("[data-testimonials]"))) renderTestimonials(el);
  if ((el = $("[data-gallery]"))) renderGallery(el);
  if ((el = $("[data-shop]"))) initShop(el);
  if ((el = $("[data-product]"))) initProduct(el);
  initCustom();
  initReveal(document);
})();
