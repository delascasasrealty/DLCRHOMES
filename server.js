const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  etag: true
}));
app.use(express.json());

// SEO: serve individual HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/buy', (req, res) => res.sendFile(path.join(__dirname, 'public', 'buy.html')));
app.get('/sell', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sell.html')));
app.get('/areas', (req, res) => res.sendFile(path.join(__dirname, 'public', 'areas.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/es', (req, res) => res.sendFile(path.join(__dirname, 'public', 'es/index.html')));

// Contact form endpoint → forward to CRM
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    // Forward to CRM
    const crmRes = await fetch('https://dlcrcrm.com/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, phone,
        source: 'dlcrhomes.com',
        type: service || 'general',
        message,
        city: 'Unknown',
        state: 'VA'
      })
    });
    const data = await crmRes.json();
    res.json({ success: true, lead: data });
  } catch (err) {
    console.error('CRM error:', err.message);
    res.json({ success: true, message: 'Thank you! We will be in touch shortly.' });
  }
});

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://dlcrhomes.com/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://dlcrhomes.com/about</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://dlcrhomes.com/buy</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://dlcrhomes.com/sell</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://dlcrhomes.com/areas</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://dlcrhomes.com/contact</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://dlcrhomes.com/es</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
</urlset>`);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: https://dlcrhomes.com/sitemap.xml`);
});

// 404
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

app.listen(PORT, () => console.log(`DLCR Homes running on port ${PORT}`));
