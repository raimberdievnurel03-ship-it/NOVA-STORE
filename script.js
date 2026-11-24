// NOVA STORE — PRODUCT DATA

const products = [
  {
    id: 1,
    name: "Premium Hoodie",
    price: 2500,
    category: "clothes",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
  },
  {
    id: 2,
    name: "Classic Jacket",
    price: 4200,
    category: "clothes",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"
  },
  {
    id: 3,
    name: "Urban Sneakers",
    price: 5500,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
  },
  {
    id: 4,
    name: "Classic Shoes",
    price: 4800,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"
  },
  {
    id: 5,
    name: "Modern T-Shirt",
    price: 1800,
    category: "clothes",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
  },
  {
    id: 6,
    name: "Luxury Watch",
    price: 6500,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    id: 7,
    name: "Fashion Bag",
    price: 3500,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"
  },
  {
    id: 8,
    name: "Sport Sneakers",
    price: 3900,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600"
  }
];

let cart = [];
let favorites = [];
let currentCategory = "all";

// ELEMENTS

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");

// FORMAT PRICE

function money(price) {
  return price.toLocaleString("en-US") + " сом";
}

// SHOW PRODUCTS

function showProducts() {
  const search = searchInput.value.toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      currentCategory === "all" ||
      product.category === currentCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = "<p>Товар табылган жок.</p>";
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <button class="favorite ${favorites.includes(product.id) ? "selected" : ""}"
          onclick="toggleFavorite(${product.id})">
          ${favorites.includes(product.id) ? "♥" : "♡"}
        </button>
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${money(product.price)}</p>
        <button class="add-cart" onclick="addToCart(${product.id})">
          СЕБЕТКЕ КОШУУ +
        </button>
      </div>
    </div>
  `).join("");
}

// CATEGORY FILTER

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".category.active")
      ?.classList.remove("active");

    button.classList.add("active");
    currentCategory = button.dataset.category;

    showProducts();
  });
});

// SEARCH

searchInput.addEventListener("input", showProducts);

document.getElementById("searchBtn").addEventListener("click", () => {
  searchInput.focus();
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

// FAVORITES

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  showProducts();
}

document.getElementById("favoriteBtn").addEventListener("click", () => {
  const favoriteProducts = products.filter(product =>
    favorites.includes(product.id)
  );

  if (favoriteProducts.length === 0) {
    alert("Тандалган товарлар азырынча жок.");
    return;
  }

  currentCategory = "all";
  searchInput.value = "";

  document.querySelectorAll(".category").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === "all"
    );
  });

  productGrid.innerHTML = favoriteProducts.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${money(product.price)}</p>
        <button class="add-cart" onclick="addToCart(${product.id})">
          СЕБЕТКЕ КОШУУ +
        </button>
      </div>
    </div>
  `).join("");

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

// ADD TO CART

function addToCart(id) {
  const product = products.find(item => item.id === id);

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }

  updateCart();
}

// UPDATE CART

function updateCart() {
  const count = cart.reduce((sum, item) =>
    sum + item.quantity, 0
  );

  cartCount.textContent = count;

  const total = cart.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  document.getElementById("totalPrice").textContent =
    money(total);

  document.getElementById("cartItems").innerHTML =
    cart.length === 0
      ? "<p>Себет азырынча бош.</p>"
      : cart.map(item => `
        <div class="cart-item">
          <span>${item.name} × ${item.quantity}</span>
          <strong>${money(item.price * item.quantity)}</strong>
          <button onclick="removeFromCart(${item.id})">Өчүрүү</button>
        </div>
      `).join("");

  document.getElementById("orderBtn").disabled =
    cart.length === 0;
}

// REMOVE FROM CART

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// OPEN CART

document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cartModal").classList.add("show");
});

document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartModal").classList.remove("show");
});

// CLOSE MODAL

document.getElementById("cartModal").addEventListener("click", event => {
  if (event.target.id === "cartModal") {
    event.currentTarget.classList.remove("show");
  }
});

// WHATSAPP ORDER

const STORE_PHONE = "996504553304";

document.getElementById("orderBtn").addEventListener("click", () => {
  if (cart.length === 0) return;

  const order = cart.map(item =>
    `${item.name} x ${item.quantity} — ${money(item.price * item.quantity)}`
  ).join("\n");

  const total = cart.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  const message =
    `Саламатсызбы! NOVA STORE'дон заказ бергим келет:\n\n${order}\n\nЖалпы: ${money(total)}`;

  window.open(
    `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});

// CONTACT WHATSAPP

document.getElementById("contactWhatsapp").href =
  `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent("Саламатсызбы! NOVA STORE жөнүндө маалымат алгым келет.")}`;

// MOBILE MENU

document.getElementById("menu").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("active");
});

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav").classList.remove("active");
  });
});

// START WEBSITE

showProducts();
updateCart();

console.log("NOVA STORE иштеп жатат!");