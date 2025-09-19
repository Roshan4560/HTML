// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Contact form submission alert
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        contactForm.reset();
    });
}

// Highlight nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav a');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Reveal animations on scroll
const animatedEls = document.querySelectorAll('.animated');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
animatedEls.forEach(el => observer.observe(el));

// Image gallery/carousel for menu items
document.querySelectorAll('.menu-gallery').forEach(gallery => {
    const images = Array.from(gallery.querySelectorAll('.gallery-img'));
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    let current = images.findIndex(img => img.classList.contains('active'));
    if (current === -1) current = 0;

    function showImage(idx) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === idx);
        });
    }

    // If there are no navigation buttons or only one image, skip
    if (!prevBtn || !nextBtn || images.length < 2) return;

    prevBtn.addEventListener('click', () => {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
    });

    nextBtn.addEventListener('click', () => {
        current = (current + 1) % images.length;
        showImage(current);
    });

    // Ensure only the first image is visible on load
    showImage(current);
});

// Hamburger menu toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !expanded);
        nav.classList.toggle('open');
    });
    // Close nav on link click (mobile)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Live opening hours
const openingHoursDiv = document.getElementById('opening-hours');
function updateOpeningHours() {
    // Example: Open 10:00 - 22:00 every day
    const now = new Date();
    const hour = now.getHours();
    const open = hour >= 10 && hour < 22;
    if (openingHoursDiv) {
        openingHoursDiv.textContent = open
            ? "We are OPEN! Today: 10:00 AM - 10:00 PM"
            : "Sorry, we are CLOSED now. Open daily 10:00 AM - 10:00 PM";
        openingHoursDiv.classList.toggle('closed', !open);
    }
}
updateOpeningHours();
setInterval(updateOpeningHours, 60000);

// Review submission form (instant display)
const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');
if (reviewForm && reviewsList) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reviewer').value.trim();
        const text = document.getElementById('review-text').value.trim();
        if (name && text) {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            reviewDiv.innerHTML = `<p>"${text}"</p><span>- ${name}</span>`;
            reviewsList.prepend(reviewDiv);
            reviewForm.reset();
            reviewForm.querySelector('input, textarea').focus();

            // Show thank you toast
            const toast = document.createElement('div');
            toast.textContent = "Thank you for your review!";
            toast.style.cssText = "position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#ff8800;color:#fff;padding:1em 2em;border-radius:8px;z-index:9999;";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Menu filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            menuItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // Optional: Gallery navigation for menu items
    document.querySelectorAll('.menu-gallery').forEach(gallery => {
        const imgs = gallery.querySelectorAll('.gallery-img');
        let current = 0;
        function showImg(idx) {
            imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
        }
        gallery.querySelector('.gallery-prev').addEventListener('click', () => {
            current = (current - 1 + imgs.length) % imgs.length;
            showImg(current);
        });
        gallery.querySelector('.gallery-next').addEventListener('click', () => {
            current = (current + 1) % imgs.length;
            showImg(current);
        });
    });

    // Horizontal scroll for specials row (optional)
    const specialsRow = document.querySelector('.specials-row');
    if (specialsRow) {
        // Add left/right buttons dynamically if you want
        // Or let users scroll with mouse/touch
    }
});

window.addEventListener('load', () => {
  document.getElementById('loader').style.display = 'none';
});

// Dark mode toggle
document.getElementById('dark-mode-toggle').onclick = function() {
  document.body.classList.toggle('dark-mode');
};

// Add to Restaurant.js
document.querySelectorAll('.special-item img').forEach(img => {
  img.style.cursor = 'pointer';
  img.onclick = function() {
    const modal = document.createElement('div');
    modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;";
    modal.innerHTML = `<img src="${img.src}" style="max-width:90vw;max-height:90vh;border-radius:12px;"><span style="position:absolute;top:30px;right:40px;font-size:2rem;color:#fff;cursor:pointer;">&times;</span>`;
    modal.onclick = () => modal.remove();
    document.body.appendChild(modal);
  };
});

// Add to Restaurant.js
document.querySelectorAll('.specials-scroll-left, .specials-scroll-right').forEach(btn => {
  btn.addEventListener('click', function() {
    const row = this.parentElement.querySelector('.specials-row');
    row.scrollBy({ left: this.classList.contains('specials-scroll-left') ? -300 : 300, behavior: 'smooth' });
  });
});

// Add to Restaurant.js
const hoursDiv = document.getElementById('opening-hours');
const now = new Date();
const open = 10, close = 22; // 10am-10pm
const status = (now.getHours() >= open && now.getHours() < close) ? "Open Now" : "Closed";
hoursDiv.innerHTML = `<strong>Hours:</strong> 10:00 - 22:00 &nbsp; <span style="color:${status==='Open Now'?'green':'red'}">${status}</span>`;

// Search functionality in header
document.getElementById('header-search-form').addEventListener('submit', function(e) {
    e.preventDefault();
});
document.getElementById('header-search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.menu-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
    });
});