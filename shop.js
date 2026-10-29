/* Arlo Clay Studio — working cart, product options, and checkout.
   Front-end only demo logic: the cart lives in localStorage so it
   persists across the shop, product, and checkout pages. No real
   orders are placed and no payment is taken. */
(function () {
  "use strict";

  var CART_KEY = "arlo-clay-cart-v1";
  var WRAP_FEE = 4;      /* gift wrap, per cart line */
  var SHIP_FLAT = 8;     /* standard shipping */
  var FREE_OVER = 75;    /* free standard shipping threshold */

  var PRODUCTS = {
    "cobalt-bowl":    { name: "Cobalt Rim Dinner Bowl",      price: 48 },
    "peach-mugs":     { name: "Peach Clay Mug Set",          price: 36, note: "Set of 2" },
    "sage-plates":    { name: "Sage Side Plates",            price: 52, note: "Set of 4" },
    "porcelain-vase": { name: "Porcelain Bud Vase",          price: 34 },
    "ink-bowl":       { name: "Ink Serving Bowl",            price: 64 },
    "espresso-cups":  { name: "Half & Half Espresso Cups",   price: 18, note: "Set of 2" }
  };

  /* ---------- cart storage ---------- */
  function loadCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function lineKey(item) {
    return item.id + "|" + (item.variant || "") + "|" + (item.wrap ? "wrap" : "plain");
  }
  function addToCart(item) {
    var cart = loadCart(), k = lineKey(item), i;
    for (i = 0; i < cart.length; i++) {
      if (lineKey(cart[i]) === k) { cart[i].qty += item.qty; saveCart(cart); return cart; }
    }
    cart.push(item); saveCart(cart); return cart;
  }
  function lineTotal(item) {
    return item.price * item.qty + (item.wrap ? WRAP_FEE : 0);
  }
  function cartSubtotal(cart) {
    return cart.reduce(function (sum, it) { return sum + lineTotal(it); }, 0);
  }
  function cartCount(cart) {
    return cart.reduce(function (sum, it) { return sum + it.qty; }, 0);
  }
  function money(n) { return "$" + n; }

  /* ---------- nav cart count (all pages) ---------- */
  function refreshNavCount() {
    var link = document.querySelector('.nav a[href="checkout.html"]');
    if (!link) return;
    var base = link.getAttribute("data-base-label") || link.textContent.trim();
    link.setAttribute("data-base-label", base);
    var n = cartCount(loadCart());
    link.textContent = n > 0 ? base + " (" + n + ")" : base;
  }

  function announce(msg) {
    var region = document.getElementById("cart-status");
    if (region) region.textContent = msg;
  }

  /* ---------- shop page: Add to cart buttons ---------- */
  function initShop() {
    var buttons = document.querySelectorAll("[data-add-to-cart]");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-add-to-cart");
        var p = PRODUCTS[id];
        if (!p) return;
        addToCart({ id: id, name: p.name, price: p.price, qty: 1, variant: "", wrap: false });
        refreshNavCount();
        announce(p.name + " added to your cart.");
        var original = btn.getAttribute("data-label") || btn.textContent;
        btn.setAttribute("data-label", original);
        btn.textContent = "Added to cart ✓";
        btn.classList.add("added");
        window.setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("added");
        }, 1600);
      });
    });
  }

  /* ---------- product page: glaze, quantity, gift wrap ---------- */
  function initProduct() {
    var form = document.getElementById("product-form");
    if (!form) return;
    var state = { glaze: "Cobalt Rim", qty: 2, wrap: false };
    var price = PRODUCTS["cobalt-bowl"].price;
    var glazeBtns = form.querySelectorAll("[data-glaze]");
    var qtySelect = document.getElementById("qty");
    var wrapBox = document.getElementById("giftwrap");
    var restockBox = document.getElementById("restock");
    var submitBtn = document.getElementById("add-bowl-btn");
    var note = document.getElementById("total-note");
    var visual = document.getElementById("product-visual-label");

    function render() {
      Array.prototype.forEach.call(glazeBtns, function (b) {
        var on = b.getAttribute("data-glaze") === state.glaze;
        b.classList.toggle("selected", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.textContent = b.getAttribute("data-glaze") + (on ? " — selected" : "");
      });
      if (visual) {
        visual.textContent = state.glaze.toUpperCase() + " DINNER BOWL — 9 INCH";
      }
      var goods = price * state.qty;
      var allIn = goods + (state.wrap ? WRAP_FEE : 0);
      submitBtn.textContent = "Add " + state.qty + (state.qty === 1 ? " bowl" : " bowls") +
        " — " + money(allIn) + " before shipping →";
      if (note) {
        var clears = goods >= FREE_OVER;
        note.textContent =
          (state.qty === 1 ? "One bowl" : state.qty + " bowls") + " at " + money(price) +
          (state.qty === 1 ? " is " : " are ") + money(goods) +
          (state.wrap ? ", plus " + money(WRAP_FEE) + " gift wrap," : ",") +
          (clears
            ? " which clears the " + money(FREE_OVER) + " free-shipping threshold — so checkout adds no shipping for standard delivery."
            : " which is under the " + money(FREE_OVER) + " free-shipping threshold — so checkout shows the flat " + money(SHIP_FLAT) + " shipping as its own line.");
      }
    }

    Array.prototype.forEach.call(glazeBtns, function (b) {
      b.addEventListener("click", function () {
        state.glaze = b.getAttribute("data-glaze");
        render();
      });
    });
    if (qtySelect) {
      qtySelect.addEventListener("change", function () {
        state.qty = parseInt(qtySelect.value, 10) || 1;
        render();
      });
      state.qty = parseInt(qtySelect.value, 10) || 1;
    }
    if (wrapBox) {
      wrapBox.addEventListener("change", function () { state.wrap = wrapBox.checked; render(); });
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      addToCart({
        id: "cobalt-bowl", name: PRODUCTS["cobalt-bowl"].name, price: price,
        qty: state.qty, variant: state.glaze + " glaze", wrap: state.wrap
      });
      if (restockBox && restockBox.checked) {
        try { localStorage.setItem("arlo-restock-plates", "yes"); } catch (e) {}
      }
      refreshNavCount();
      window.location.href = "checkout.html";
    });
    render();
  }

  /* ---------- checkout page: cart editing, shipping, validation, confirmation ---------- */
  function initCheckout() {
    var linesEl = document.getElementById("cart-lines");
    if (!linesEl) return;
    var subtotalEl = document.getElementById("co-subtotal");
    var shippingRow = document.getElementById("co-shipping-row");
    var shippingEl = document.getElementById("co-shipping");
    var totalEl = document.getElementById("co-total");
    var shipNote = document.getElementById("ship-note");
    var placeBtn = document.getElementById("place-order-btn");
    var form = document.getElementById("checkout-form");
    var checkoutGrid = document.getElementById("checkout-grid");
    var confirmation = document.getElementById("confirmation");
    var emptyNote = document.getElementById("empty-cart-note");

    function shipMethod() {
      var checked = form.querySelector('input[name="ship"]:checked');
      return checked ? checked.value : "standard";
    }

    function shippingCost(subtotal) {
      if (shipMethod() === "pickup") return 0;
      return subtotal >= FREE_OVER ? 0 : SHIP_FLAT;
    }

    function renderCart() {
      var cart = loadCart();
      linesEl.innerHTML = "";
      if (cart.length === 0) {
        linesEl.innerHTML = '<div class="row"><span>Your basket is empty.</span><strong>' +
          money(0) + "</strong></div>";
        if (emptyNote) emptyNote.hidden = false;
        placeBtn.disabled = true;
        placeBtn.textContent = "Place sample order";
      } else {
        if (emptyNote) emptyNote.hidden = true;
        placeBtn.disabled = false;
        cart.forEach(function (item, idx) {
          var row = document.createElement("div");
          row.className = "cart-line";
          var label = item.name + (item.variant ? " — " + item.variant : "") +
            (item.wrap ? " (gift wrap +" + money(WRAP_FEE) + ")" : "");
          row.innerHTML =
            '<div class="cart-line-main"><span>' + label + "</span><strong>" +
            money(lineTotal(item)) + "</strong></div>" +
            '<div class="cart-line-ctrl"><label>Qty ' +
            '<select class="qty" data-idx="' + idx + '" aria-label="Quantity for ' + item.name + '">' +
            [1, 2, 3, 4, 5, 6].map(function (n) {
              return '<option value="' + n + '"' + (n === item.qty ? " selected" : "") + ">" + n + "</option>";
            }).join("") + "</select></label>" +
            '<button type="button" class="link-btn" data-remove="' + idx + '">Remove</button></div>';
          linesEl.appendChild(row);
        });
      }
      var subtotal = cartSubtotal(cart);
      var shipping = cart.length === 0 ? 0 : shippingCost(subtotal);
      subtotalEl.textContent = money(subtotal);
      shippingEl.textContent = shipping === 0
        ? (shipMethod() === "pickup" ? "Free — studio pickup" : "Free — over " + money(FREE_OVER))
        : money(shipping);
      var total = subtotal + shipping;
      totalEl.textContent = money(total);
      if (shipNote) {
        shipNote.textContent = cart.length === 0
          ? "Add a piece from the shop and the lines will add up here, in the open."
          : shipMethod() === "pickup"
            ? "Studio pickup chosen — no shipping line. Your pieces will be ready in a sample 2 days."
            : subtotal >= FREE_OVER
              ? "This basket is " + money(subtotal) + " before shipping, so standard shipping is free — over the " + money(FREE_OVER) + " threshold stated on the shop and product pages."
              : "This basket is " + money(subtotal) + " before shipping, so the flat " + money(SHIP_FLAT) + " applies — orders over " + money(FREE_OVER) + " ship free, as stated on the shop and product pages.";
      }
      if (!placeBtn.disabled) {
        placeBtn.textContent = "Place sample order — " + money(total) + " total";
      }
      refreshNavCount();
    }

    linesEl.addEventListener("change", function (ev) {
      var sel = ev.target.closest ? ev.target.closest("select.qty") : null;
      if (!sel) return;
      var cart = loadCart();
      var idx = parseInt(sel.getAttribute("data-idx"), 10);
      if (cart[idx]) { cart[idx].qty = parseInt(sel.value, 10); saveCart(cart); renderCart(); }
    });
    linesEl.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest("[data-remove]") : null;
      if (!btn) return;
      var cart = loadCart();
      cart.splice(parseInt(btn.getAttribute("data-remove"), 10), 1);
      saveCart(cart); renderCart();
    });
    Array.prototype.forEach.call(form.querySelectorAll('input[name="ship"]'), function (r) {
      r.addEventListener("change", renderCart);
    });

    /* ----- validation ----- */
    function setError(input, errId, bad) {
      var err = document.getElementById(errId);
      if (err) err.classList.toggle("show", bad);
      input.classList.toggle("invalid", bad);
      input.setAttribute("aria-invalid", bad ? "true" : "false");
      return !bad;
    }
    function validate() {
      var name = document.getElementById("name");
      var email = document.getElementById("email");
      var addr = document.getElementById("addr");
      var city = document.getElementById("city");
      var zip = document.getElementById("zip");
      var ok = true;
      ok = setError(name, "err-name", name.value.trim().length < 2) && ok;
      ok = setError(email, "err-email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) && ok;
      ok = setError(addr, "err-addr", addr.value.trim().length < 4) && ok;
      ok = setError(city, "err-city", city.value.trim().length < 2) && ok;
      ok = setError(zip, "err-zip", !/^\d{5}(-\d{4})?$/.test(zip.value.trim())) && ok;
      return ok;
    }
    ["name", "email", "addr", "city", "zip"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", function () {
        var err = document.getElementById("err-" + id);
        if (err && err.classList.contains("show")) validate();
      });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (loadCart().length === 0) return;
      if (!validate()) {
        var firstBad = form.querySelector("input.invalid");
        if (firstBad) firstBad.focus();
        return;
      }
      var cart = loadCart();
      var subtotal = cartSubtotal(cart);
      var total = subtotal + shippingCost(subtotal);
      var orderNo = "ARLO-" + Date.now().toString(36).toUpperCase().slice(-8);
      var email = document.getElementById("email").value.trim();
      document.getElementById("conf-order").textContent = orderNo;
      document.getElementById("conf-total").textContent = money(total);
      document.getElementById("conf-email").textContent = email;
      document.getElementById("conf-items").textContent =
        cart.map(function (it) {
          return it.name + (it.variant ? " (" + it.variant + ")" : "") + " × " + it.qty;
        }).join("; ");
      saveCart([]);
      checkoutGrid.hidden = true;
      confirmation.hidden = false;
      confirmation.setAttribute("tabindex", "-1");
      confirmation.focus();
      refreshNavCount();
    });

    renderCart();
  }

  document.addEventListener("DOMContentLoaded", function () {
    refreshNavCount();
    initShop();
    initProduct();
    initCheckout();
  });
})();
