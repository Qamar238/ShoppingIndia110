// main.js - Handles product loading, cart badge, and contact form validation
// Author: GitHub Copilot

// Utility: Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Utility: Update cart count badge
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}
// Utility: Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Utility: Update cart count badge
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

// 👇 Ye part paste karo iske neeche
function renderCategories(products) {
    // Unique categories nikalo
    const categories = [...new Set(products.map(p => p.category))];

    // Har category ke liye ek representative image chahiye
    // Yahan hum first product ki image us category ke liye use kar rahe hain
    const categoryData = categories.map(cat => {
        const firstProduct = products.find(p => p.category === cat);
        return {
            name: cat,
            image: firstProduct ? firstProduct.imageURL : 'assets/default.jpg'
        };
    });

    // Home categories section
    const homeCat = document.querySelector('.categories-list');
    const navCat = document.querySelector('.category-dropdown');

    if (homeCat) {
        homeCat.innerHTML = categoryData.map(cat => `
            <div class="category-card">
                <a href="products.html?category=${cat.name}">
                    <img src="${cat.image}" alt="${cat.name}">
                    <h3>${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</h3>
                </a>
            </div>
        `).join('');
    }

    // Navbar category dropdown
    if (navCat) {
        navCat.innerHTML = categoryData.map(cat => `
            <li><a href="products.html?category=${cat.name}">
                ${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </a></li>
        `).join('');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Mobile navbar toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navCategory = document.querySelector('.nav-category');
    if (navToggle && navLinks) {
        // Initially hide nav links on mobile
        if (window.innerWidth <= 900) {
            navLinks.classList.remove('open');
        }
        
        navToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });

        // Handle category dropdown on mobile
        if (navCategory) {
            navCategory.addEventListener('click', function(e) {
                if (window.innerWidth <= 900) {
                    this.classList.toggle('open');
                    e.preventDefault();
                }
            });
        }
    }
    updateCartCount();
    // Home: Load featured products
    if (document.getElementById('featured-products')) {
        fetch('assets/data/products.json')
            .then(res => res.json())
            .then(products => {
                // Show first 4 as featured
                const featured = products.slice(0, 4);
                const container = document.getElementById('featured-products');
                container.innerHTML = featured.map(productCardHTML).join('');
                addProductCardListeners();
                renderCategories(products);
            });
    }
    // Products: Load all products with category filter
  if (document.getElementById('products-list')) {
    fetch('assets/data/products.json')
        .then(res => res.json())
        .then(products => {
            // 🔹 Category render function call (ye line new add karni hai)
            renderCategories(products);

            // Get category from URL
            const urlParams = new URLSearchParams(window.location.search);
            let selectedCategory = urlParams.get('category') || 'all';

            function renderProducts(category) {
                let filtered = (category === 'all') ? products : products.filter(p => p.category === category);
                const container = document.getElementById('products-list');
                container.innerHTML = filtered.map(productCardHTML).join('');
                addProductCardListeners();
            }

            // Initial render
            renderProducts(selectedCategory);

            // Filter buttons
            document.querySelectorAll('.category-filter button').forEach(btn => {
                btn.addEventListener('click', function () {
                    const cat = this.getAttribute('data-category');
                    renderProducts(cat);
                });
            });
        });
}

    // Product detail: Load dummy data from query param (simulate)
    if (document.getElementById('product-detail')) {
        // For demo, just show a random product
        fetch('assets/data/products.json')
            .then(res => res.json())
            .then(products => {
                const urlParams = new URLSearchParams(window.location.search);
                const productId = urlParams.get('id');
                const product = products.find(p => String(p.id) === String(productId));

                document.getElementById('product-detail').innerHTML = productDetailHTML(product);
                document.querySelector('.btn-add-cart').addEventListener('click', function () {
                    addToCart(product.id);
                });
            });
    }
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let valid = true;
            // Name
            const name = document.getElementById('name');
            const nameError = document.getElementById('name-error');
            if (!name.value.trim()) {
                nameError.textContent = 'Name is required.';
                valid = false;
            } else {
                nameError.textContent = '';
            }
            // Email
            const email = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            if (!/^\S+@\S+\.\S+$/.test(email.value)) {
                emailError.textContent = 'Enter a valid email.';
                valid = false;
            } else {
                emailError.textContent = '';
            }
            // Message
            const message = document.getElementById('message');
            const messageError = document.getElementById('message-error');
            if (!message.value.trim()) {
                messageError.textContent = 'Message is required.';
                valid = false;
            } else {
                messageError.textContent = '';
            }
            // Success
            const formSuccess = document.getElementById('form-success');
            if (valid) {
                formSuccess.textContent = 'Thank you! Your message has been sent (demo).';
                contactForm.reset();
            } else {
                formSuccess.textContent = '';
            }
        });
    }
});

// Render product card HTML
function productCardHTML(product) {
    return `<div class="product-card" data-id="${product.id}">
        <a href="product.html?id=${product.id}"><img src="${product.imageURL}" alt="${product.name}"></a>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="btn btn-gold btn-add-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    </div>`;
}
// Render product detail HTML
function productDetailHTML(product) {
    return `<img src="${product.imageURL}" alt="${product.name}">
        <div class="product-detail-content">
            <h2>${product.name}</h2>
            <div class="price">$${product.price.toFixed(2)}</div>
            <p>${product.description}</p>
            <button class="btn btn-gold btn-add-cart">Add to Cart</button>
        </div>`;
}
// Add to cart handler
function addToCart(productId) {
    fetch('assets/data/products.json')
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) return;
            let cart = getCart();
            const idx = cart.findIndex(item => item.id == productId);
            if (idx > -1) {
                cart[idx].qty += 1;
            } else {
                cart.push({ id: product.id, name: product.name, price: product.price, imageURL: product.imageURL, qty: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        });
}
// Add listeners to product cards
function addProductCardListeners() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            addToCart(id);
        });
    });
}
