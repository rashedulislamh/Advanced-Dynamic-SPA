// App State
const state = {
  currentPage: "home",
  users: [],
  products: [],
  darkMode: localStorage.getItem("darkMode") === "true",
  settings: JSON.parse(localStorage.getItem("settings")) || {
    notifications: true,
    animations: true,
  },
};

// DOM Elements
const mainContent = document.getElementById("main-content");
const navButtons = document.querySelectorAll(".nav-btn");
const themeToggle = document.getElementById("themeToggle");
const toastElement = document.getElementById("toast");

// Page Templates
const pages = {
  home: `
                <section class="content-section">
                    <h2>Welcome to Our Advanced SPA</h2>
                    <p>Experience the power of modern web development with this interactive single page application.</p>
                    
                    <div class="stats">
                        <div class="stat-card">
                            <h3>Dynamic Content</h3>
                            <p>All content loads without page refreshes</p>
                        </div>
                        <div class="stat-card">
                            <h3>Real Data</h3>
                            <p>Fetched from JSONPlaceholder API</p>
                        </div>
                        <div class="stat-card">
                            <h3>Interactive UI</h3>
                            <p>With animations and feedback</p>
                        </div>
                    </div>
                    
                    <button id="demo-btn" class="btn">Try Demo Action</button>
                </section>
            `,
  users: `
                <section class="content-section">
                    <div class="section-header">
                        <h2>User Management</h2>
                        <button id="refresh-users" class="btn">🔄 Refresh</button>
                    </div>
                    <div id="users-container">
                        <div class="spinner"></div>
                    </div>
                </section>
            `,
  products: `
                <section class="content-section">
                    <h2>Product Catalog</h2>
                    <div class="filter-controls">
                        <select id="category-filter">
                            <option value="all">All Categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="jewelery">Jewelery</option>
                            <option value="men's clothing">Men's Clothing</option>
                            <option value="women's clothing">Women's Clothing</option>
                        </select>
                        <input type="text" id="search-products" placeholder="Search products...">
                    </div>
                    <div id="products-container">
                        <div class="spinner"></div>
                    </div>
                </section>
            `,
  contact: `
                <section class="content-section">
                    <h2>Contact Us</h2>
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <select id="subject" required>
                                <option value="">Select a subject</option>
                                <option value="support">Support</option>
                                <option value="feedback">Feedback</option>
                                <option value="partnership">Partnership</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">Your Message</label>
                            <textarea id="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-block">Send Message</button>
                    </form>
                </section>
            `,
  settings: `
                <section class="content-section">
                    <h2>Application Settings</h2>
                    <form id="settings-form">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="dark-mode-toggle" ${
                                  state.darkMode ? "checked" : ""
                                }>
                                Dark Mode
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="notifications-toggle" ${
                                  state.settings.notifications ? "checked" : ""
                                }>
                                Enable Notifications
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="animations-toggle" ${
                                  state.settings.animations ? "checked" : ""
                                }>
                                Enable Animations
                            </label>
                        </div>
                        <button type="submit" class="btn">Save Settings</button>
                    </form>
                </section>
            `,
};

// Initialize the app
function init() {
  // Set initial theme
  if (state.darkMode) {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  renderPage("home");
  setupEventListeners();
}

// Render the current page
function renderPage(page) {
  state.currentPage = page;
  mainContent.innerHTML = pages[page];

  // Update active nav button
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  // Load additional data if needed
  if (page === "users") {
    fetchUsers();
  } else if (page === "products") {
    fetchProducts();
  }

  // Setup page-specific event listeners
  setupPageEvents(page);
}

// Setup page-specific event listeners
function setupPageEvents(page) {
  switch (page) {
    case "home":
      document
        .getElementById("demo-btn")
        ?.addEventListener("click", showDemoToast);
      break;
    case "users":
      document
        .getElementById("refresh-users")
        ?.addEventListener("click", fetchUsers);
      break;
    case "products":
      document
        .getElementById("category-filter")
        ?.addEventListener("change", filterProducts);
      document
        .getElementById("search-products")
        ?.addEventListener("input", searchProducts);
      break;
    case "contact":
      setupContactForm();
      break;
    case "settings":
      setupSettingsForm();
      break;
  }
}

// Fetch users from API
async function fetchUsers() {
  const container = document.getElementById("users-container");
  container.innerHTML = '<div class="spinner"></div>';

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    state.users = await response.json();
    renderUsers();
    showToast("Users loaded successfully!", "success");
  } catch (error) {
    container.innerHTML = `
                    <div style="color: var(--danger-color); padding: 1rem; text-align: center;">
                        Error loading users: ${error.message}
                    </div>
                `;
    showToast("Failed to load users", "error");
  }
}

// Render user list
function renderUsers() {
  const container = document.getElementById("users-container");
  container.innerHTML = state.users
    .map(
      (user) => `
                <div class="user-card">
                    <div class="user-avatar">${user.name.charAt(0)}</div>
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>📧 ${user.email}</p>
                        <p>🏢 ${user.company.name}</p>
                        <p>🌐 ${user.website}</p>
                    </div>
                </div>
            `
    )
    .join("");
}

// Fetch products from API
async function fetchProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = '<div class="spinner"></div>';

  try {
    const response = await fetch("https://fakestoreapi.com/products");
    state.products = await response.json();
    renderProducts();
    showToast("Products loaded successfully!", "success");
  } catch (error) {
    container.innerHTML = `
                    <div style="color: var(--danger-color); padding: 1rem; text-align: center;">
                        Error loading products: ${error.message}
                    </div>
                `;
    showToast("Failed to load products", "error");
  }
}

// Render products
function renderProducts(products = state.products) {
  const container = document.getElementById("products-container");
  container.innerHTML = products
    .map(
      (product) => `
                <div class="user-card">
                    <img src="${product.image}" alt="${
        product.title
      }" width="80" style="border-radius: 8px;">
                    <div class="user-info">
                        <h3>${product.title}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                        <p>⭐ ${product.rating.rate} (${
        product.rating.count
      } reviews)</p>
                        <p>🏷️ ${product.category}</p>
                    </div>
                </div>
            `
    )
    .join("");
}

// Filter products by category
function filterProducts() {
  const category = document.getElementById("category-filter").value;
  const filtered =
    category === "all"
      ? state.products
      : state.products.filter((p) => p.category === category);
  renderProducts(filtered);
}

// Search products
function searchProducts() {
  const searchTerm = document
    .getElementById("search-products")
    .value.toLowerCase();
  const filtered = state.products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
  );
  renderProducts(filtered);
}

// Setup contact form
function setupContactForm() {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      name: form.querySelector("#name").value,
      email: form.querySelector("#email").value,
      subject: form.querySelector("#subject").value,
      message: form.querySelector("#message").value,
      timestamp: new Date().toISOString(),
    };

    showToast("Message sent successfully!", "success");
    form.reset();

    // In a real app, you would send this to a server
    console.log("Form submitted:", formData);
  });
}

// Setup settings form
function setupSettingsForm() {
  const form = document.getElementById("settings-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    state.darkMode = document.getElementById("dark-mode-toggle").checked;
    state.settings.notifications = document.getElementById(
      "notifications-toggle"
    ).checked;
    state.settings.animations =
      document.getElementById("animations-toggle").checked;

    // Save to localStorage
    localStorage.setItem("darkMode", state.darkMode);
    localStorage.setItem("settings", JSON.stringify(state.settings));

    // Apply dark mode
    document.body.classList.toggle("dark-mode", state.darkMode);
    themeToggle.textContent = state.darkMode ? "☀️" : "🌙";

    showToast("Settings saved!", "success");
  });
}

// Show toast notification
function showToast(message, type = "") {
  if (!state.settings.notifications) return;

  toastElement.textContent = message;
  toastElement.className = `toast ${type}`;
  toastElement.classList.add("show");

  setTimeout(() => {
    toastElement.classList.remove("show");
  }, 3000);
}

// Demo function
function showDemoToast() {
  showToast("This is a demo notification!", "success");
}

// Setup theme toggle
function setupThemeToggle() {
  themeToggle.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle("dark-mode", state.darkMode);
    themeToggle.textContent = state.darkMode ? "☀️" : "🌙";
    localStorage.setItem("darkMode", state.darkMode);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderPage(button.dataset.page);
      if (state.settings.animations) {
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
          button.style.transform = "";
        }, 200);
      }
    });
  });

  // Theme toggle
  setupThemeToggle();
}

// Start the app
{
  /* document.addEventListener("DOMContentLoaded", init); */
}
