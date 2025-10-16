// cart.js - Handles cart page logic
// Author: GitHub Copilot

document.addEventListener('DOMContentLoaded', function () {
    renderCart();
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSummaryDiv = document.getElementById('cart-summary');
    if (!cart.length) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        cartSummaryDiv.innerHTML = '';
        updateCartCount();
        return;
    }
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imageURL}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.qty}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
    `).join('');
    cartSummaryDiv.innerHTML = `<strong>Total: $${cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)}</strong>`;
    // Remove handlers
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function () {
            removeFromCart(this.getAttribute('data-id'));
        });
    });
    updateCartCount();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    setCart(cart);
    renderCart();
}

// Update cart badge in navbar
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

// WhatsApp Checkout Handler with playful message and cart details
document.addEventListener('DOMContentLoaded', function () {
    var checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            var cart = getCart();
            if (!cart.length) {
                alert('Your cart is empty!');
                return;
            }
            // Build cart summary
            var lines = cart.map(function(item, idx) {
                return (idx+1) + '. ' + item.name + ' x' + item.qty + ' = ₹' + (item.price * item.qty).toFixed(2);
            });
            var total = cart.reduce(function(sum, item) {
                return sum + (item.price * item.qty);
            }, 0);
            var message = "🛍 *Welcome To Shopping_indi110*\n\n" +
                "🙏 Thank you for contacting *Shopping India 110*! Please let us know how we can help you.\n\n" +
                "💬 We are glad to serve our customers with full satisfaction. Please share your requirements.\n\n" +
                "🟢 *Want to confirm your order here on WhatsApp instead? Just hit send!*\n\n" +
                "🛒 *Order Details:*\n" +
                lines.join('\n') +
                "\n--------------------\n" +
                "*Total: ₹" + total.toFixed(2) + "*";
            // 🟢 Custom message end
            var phone = '919004802391';
            var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
            window.open(url, '_blank');
        });
    }
});
