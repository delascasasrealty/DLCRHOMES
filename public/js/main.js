// ===== DLCR Homes â Main JS =====

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('mainNav');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

// Search tab switching
document.querySelectorAll('.search-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Search bar action
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');
if (searchBtn && searchInput) {
  const doSearch = () => {
    const q = searchInput.value.trim();
    const type = document.querySelector('.search-tab.active')?.dataset.type || 'buy';
    if (q) {
      // For now redirect to a search-friendly URL
      window.location.href = `/areas?q=${encodeURIComponent(q)}&type=${type}`;
    }
  };
  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

// Fade-in on scroll (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(contactForm));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        contactForm.innerHTML = `
          <div style="text-align:center;padding:40px 0;">
            <div style="font-size:48px;margin-bottom:16px;">â</div>
            <h3 style="color:var(--black);margin-bottom:8px;">Thank You!</h3>
            <p style="color:var(--gray-600);">One of our agents will be in contact shortly.</p>
          </div>`;
      }
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;
      alert('Something went wrong. Please call us at (571) 444-8780.');
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
