// Category images for each button
const categoryImages = {
    starters: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    drinks: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad04?auto=format&fit=crop&w=400&q=80",
    desserts: "https://media.istockphoto.com/id/1922618743/photo/assorted-of-scoops-ice-cream-colorful-set-of-ice-cream-of-different-flavours-side-view-of-ice.webp?a=1&b=1&s=612x612&w=0&k=20&c=hoOCdvvboaoJkWLpLjMIWN4PXYxuH13drHVSjzagVpo=",
    snacks: "https://media.istockphoto.com/id/1156059928/photo/indian-tea-time-snacks-in-group.webp?a=1&b=1&s=612x612&w=0&k=20&c=PPaUpIHV1xQYq--AbzHNzEifcp483Yu_EK8hGn7QbFI=",
    main: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFzdGF8ZW58MHx8MHx8fDA%3D"
};

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.menu-btn');
    const photoDiv = document.getElementById('category-photo');
    const items = document.querySelectorAll('.menu-item');

    // Show starters photo by default
    photoDiv.innerHTML = `<img src="${categoryImages['starters']}" alt="starters photo">`;
    buttons[0].classList.add('active-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(b => b.classList.remove('active-btn'));
            // Add active class to clicked button
            btn.classList.add('active-btn');
            // Show corresponding photo
            const cat = btn.getAttribute('data-category');
            photoDiv.innerHTML = `<img src="${categoryImages[cat]}" alt="${cat} photo">`;
        });
    });

    // Category Filtering
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            this.classList.add('active');
            const cat = this.dataset.category;
            // Show/hide menu items
            items.forEach(item => {
                if (cat === 'all' || item.dataset.category === cat) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Search Filtering
    document.getElementById('searchInput').addEventListener('input', function() {
        const val = this.value.toLowerCase();
        items.forEach(item => {
            const text = item.innerText.toLowerCase();
            item.style.display = text.includes(val) ? '' : 'none';
        });
    });

    // Modal Popup for menu item details
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const closeModal = document.querySelector('.close-modal');
    const modalCalories = document.getElementById('modal-calories');
    const modalIngredients = document.getElementById('modal-ingredients');
    const modalChef = document.getElementById('modal-chef');
    const modalRating = document.getElementById('modal-rating');

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent modal on Add to Cart button click
            if (e.target.classList.contains('add-cart-btn')) return;
            modal.style.display = 'flex';
            modalImg.src = item.getAttribute('data-img');
            modalTitle.textContent = item.getAttribute('data-name');
            modalDesc.textContent = item.getAttribute('data-desc');
            modalPrice.textContent = "₹" + item.getAttribute('data-price');
            modalCalories.textContent = item.getAttribute('data-calories') || '';
            modalIngredients.textContent = item.getAttribute('data-ingredients') ? "Ingredients: " + item.getAttribute('data-ingredients') : '';
            modalChef.textContent = item.getAttribute('data-chef') ? "Chef: " + item.getAttribute('data-chef') : '';
            modalRating.textContent = item.getAttribute('data-rating') ? "★ " + item.getAttribute('data-rating') : '';
        });
    });
    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

    // Add to Cart functionality with price, total, GST
    const cartList = document.getElementById('cart-list');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartGST = document.getElementById('cart-gst');
    const cartTotal = document.getElementById('cart-total');
    let cart = [];

    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = btn.closest('.menu-item');
            const name = item.getAttribute('data-name');
            const price = parseFloat(item.getAttribute('data-price'));
            // If item already in cart, increase quantity
            const existing = cart.find(i => i.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }
            renderCart();
            showToast(`${name} added to cart!`);
        });
    });

    function renderCart() {
        cartList.innerHTML = '';
        let subtotal = 0;
        if (cart.length === 0) {
            cartList.innerHTML = '<li>Your cart is empty.</li>';
        }
        cart.forEach((item, i) => {
            subtotal += item.price * item.qty;
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} 
                <button class="qty-btn" data-index="${i}" data-action="dec">-</button>
                x${item.qty}
                <button class="qty-btn" data-index="${i}" data-action="inc">+</button>
                - ₹${item.price * item.qty}
                <button class="cart-remove" data-index="${i}">✕</button>
            `;
            cartList.appendChild(li);
        });
        // Quantity controls
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.onclick = function() {
                const idx = this.dataset.index;
                const action = this.dataset.action;
                if (action === 'inc') cart[idx].qty++;
                if (action === 'dec' && cart[idx].qty > 1) cart[idx].qty--;
                renderCart();
            };
        });
        // Remove item
        document.querySelectorAll('.cart-remove').forEach(btn => {
            btn.onclick = function() {
                cart.splice(this.dataset.index, 1);
                renderCart();
            };
        });
        // Calculate GST and total
        const gst = Math.round(subtotal * 0.05);
        const total = subtotal + gst;
        cartSubtotal.textContent = `₹${subtotal}`;
        cartGST.textContent = `₹${gst}`;
        cartTotal.textContent = `₹${total}`;
    }

    // Simple Carousel for featured dishes
    const carouselImages = [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80",
        "https://media.istockphoto.com/id/1922618743/photo/assorted-of-scoops-ice-cream-colorful-set-of-ice-cream-of-different-flavours-side-view-of-ice.webp?a=1&b=1&s=612x612&w=0&k=20&c=hoOCdvvboaoJkWLpLjMIWN4PXYxuH13drHVSjzagVpo=",
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&auto=format&fit=crop&q=60"
    ];
    let carouselIndex = 0;
    const carouselImg = document.getElementById('carousel-img');
    document.getElementById('carousel-left').onclick = () => {
        carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
        carouselImg.src = carouselImages[carouselIndex];
    };
    document.getElementById('carousel-right').onclick = () => {
        carouselIndex = (carouselIndex + 1) % carouselImages.length;
        carouselImg.src = carouselImages[carouselIndex];
    };

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1500);
    }

    // Loader functions
    const loader = document.getElementById('loader');
    function showLoader() { loader.style.display = 'block'; }
    function hideLoader() { loader.style.display = 'none'; }
    // Call showLoader() before loading images, hideLoader() after

    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            btn.classList.toggle('active');
            // Optionally, save to localStorage
        };
    });

    const backToTop = document.getElementById('backToTop');
    window.onscroll = () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    };
    backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('placeOrderBtn').onclick = function() {
        if (cart.length === 0) {
            showToast('Cart is empty!');
            return;
        }
        alert('Thank you for your order!\nTotal: ' + cartTotal.textContent);
        cart = [];
        renderCart();
    };
});