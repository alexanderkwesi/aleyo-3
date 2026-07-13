import React, { useEffect, useRef } from 'react';
import { THEMES, FONTS } from '../templates';

export default function Canvas({
  projectName,
  theme,
  font,
  sections,
  previewMode,
  selectedElementMeta,
  setSelectedElementMeta,
  deviceView
}) {
  const iframeRef = useRef(null);

  useEffect(() => {
    updateIframeContent();
  }, [sections, theme, font, previewMode, selectedElementMeta]);

  const updateIframeContent = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const themeObj = THEMES[theme] || THEMES.royal;
    const fontObj = FONTS[font] || FONTS.outfit;

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/preview-styles.css">
  
  <style>
    ${fontObj.import}
    :root {
      --primary-color: ${themeObj.primary};
      --primary-hover: ${themeObj.primaryHover};
      --secondary-color: ${themeObj.secondary};
      --bg-color: ${themeObj.bg};
      --text-color: ${themeObj.text};
      --text-muted: ${themeObj.textMuted};
      --card-bg: ${themeObj.cardBg};
      --card-border: ${themeObj.cardBorder};
      --border-radius: ${themeObj.borderRadius};
      --font-family: ${fontObj.value};
    }
  </style>
</head>
<body class="${previewMode ? 'preview-mode' : 'editor-mode'}">
    `;

    sections.forEach(section => {
      html += generateSectionHTML(section);
    });

    html += `
  <script>
    // Handle responsive header toggles
    document.querySelectorAll('.nav-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const links = btn.nextElementSibling;
        if (links.style.display === 'flex') {
          links.style.display = 'none';
        } else {
          links.style.display = 'flex';
          links.style.flexDirection = 'column';
          links.style.position = 'absolute';
          links.style.top = '100%';
          links.style.left = '0';
          links.style.width = '100%';
          links.style.backgroundColor = 'var(--bg-color)';
          links.style.padding = '20px';
          links.style.borderBottom = '1px solid var(--card-border)';
        }
      });
    });

    // Slider Carousel Logic
    window.slideCarousel = (sectionId, direction) => {
      const track = document.getElementById('track-' + sectionId);
      if (!track) return;
      const slides = track.children;
      if (slides.length === 0) return;
      
      let currentIdx = parseInt(track.dataset.currentIdx || '0');
      currentIdx += direction;
      
      if (currentIdx < 0) currentIdx = slides.length - 1;
      else if (currentIdx >= slides.length) currentIdx = 0;
      
      track.dataset.currentIdx = currentIdx;
      const offset = currentIdx * -100;
      track.style.transform = 'translateX(' + offset + '%)';
    };

    // In edit mode, intercept default actions (links, forms)
    if (document.body.classList.contains('editor-mode')) {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', (e) => {
          if (el.classList.contains('carousel-arrow') || el.closest('.carousel-arrow')) {
            return; // Allow sliding in editor
          }
          if (!el.hasAttribute('data-editable')) {
            e.preventDefault();
          }
        });
      });
      document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
      });
    }
  </script>
</body>
</html>
    `;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Bind interaction triggers inside iframe once DOM finishes writing
    iframe.onload = () => {
      bindIframeClicks();
    };
    // Trigger immediately in case onload was already fired
    bindIframeClicks();
  };

  const bindIframeClicks = () => {
    const iframe = iframeRef.current;
    if (!iframe || previewMode) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Bind click events on elements marked with data-editable
    doc.querySelectorAll('[data-editable]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const sectionId = el.getAttribute('data-section-id');
        const field = el.getAttribute('data-field');
        const subIndex = el.getAttribute('data-sub-idx');

        // Call parent state setter
        setSelectedElementMeta({
          sectionId,
          field,
          subIndex: subIndex !== null ? parseInt(subIndex) : null
        });
      });
    });

    // Clear highlights
    doc.querySelectorAll('[data-editable]').forEach(x => x.classList.remove('active-element'));

    // Highlight selected item in state
    if (selectedElementMeta) {
      const { sectionId, field, subIndex } = selectedElementMeta;
      let selector = `[data-section-id="${sectionId}"][data-field="${field}"]`;
      if (subIndex !== null) {
        selector += `[data-sub-idx="${subIndex}"]`;
      }
      const activeEl = doc.querySelector(selector);
      if (activeEl) {
        activeEl.classList.add('active-element');
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const generateSectionHTML = (section) => {
    const id = section.id;
    const data = section.data;

    const wrapCarousel = (sec, innerHtml) => {
      if (sec.styleVariant === 'carousel') {
        return `
          <div class="carousel-container">
            <button class="carousel-arrow prev" onclick="slideCarousel('${sec.id}', -1)"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="carousel-viewport">
              <div class="carousel-track" id="track-${sec.id}" data-current-idx="0">
                ${innerHtml}
              </div>
            </div>
            <button class="carousel-arrow next" onclick="slideCarousel('${sec.id}', 1)"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        `;
      }
      return innerHtml;
    };

    switch (section.type) {
      case 'header':
        return `
          <header class="header-section section-container ${section.styleVariant || 'split'}-variant" id="${id}">
            <div class="container">
              <a href="#" class="logo" data-editable="true" data-section-id="${id}" data-field="logo">
                <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary-color);"></i>
                <span>${data.logo || 'Aleyo'}</span>
              </a>
              <button class="nav-toggle"><i class="fa-solid fa-bars"></i></button>
              <ul class="nav-links">
                <li><a href="#features" data-editable="true" data-section-id="${id}" data-field="link1">${data.link1 || 'Features'}</a></li>
                <li><a href="#gallery" data-editable="true" data-section-id="${id}" data-field="link2">${data.link2 || 'Gallery'}</a></li>
                <li><a href="#testimonials" data-editable="true" data-section-id="${id}" data-field="link3">${data.link3 || 'Testimonials'}</a></li>
                <li><a href="#contact" data-editable="true" data-section-id="${id}" data-field="link4">${data.link4 || 'Contact'}</a></li>
                <li><a href="#contact" class="btn btn-primary" data-editable="true" data-section-id="${id}" data-field="ctaText" style="padding: 8px 18px; font-size: 0.9rem;">${data.ctaText || 'Get Started'}</a></li>
              </ul>
            </div>
          </header>
        `;

      case 'hero':
        return `
          <section class="hero-section section-container ${section.styleVariant || 'split'}-variant" id="${id}">
            <div class="container">
              <div class="hero-content">
                <h1 data-editable="true" data-section-id="${id}" data-field="title">${data.title || 'Landing Platform'}</h1>
                <p data-editable="true" data-section-id="${id}" data-field="subtitle">${data.subtitle || 'Build something gorgeous in seconds.'}</p>
                <div class="hero-actions">
                  <a href="#contact" class="btn btn-primary" data-editable="true" data-section-id="${id}" data-field="cta1">${data.cta1 || 'Start Now'}</a>
                  <a href="#features" class="btn btn-secondary" data-editable="true" data-section-id="${id}" data-field="cta2">${data.cta2 || 'Learn More'}</a>
                </div>
              </div>
              <div class="hero-image">
                <img src="${data.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}" alt="Hero visuals" data-editable="true" data-section-id="${id}" data-field="image">
              </div>
            </div>
          </section>
        `;

      case 'features':
        const cardsHtml = data.cards?.map((card, idx) => `
          <div class="feature-card">
            <div class="feature-icon" data-editable="true" data-section-id="${id}" data-field="icon" data-sub-idx="${idx}">${card.icon || '⚡'}</div>
            <h3 data-editable="true" data-section-id="${id}" data-field="cardTitle" data-sub-idx="${idx}">${card.title || 'Benefit Title'}</h3>
            <p data-editable="true" data-section-id="${id}" data-field="cardDesc" data-sub-idx="${idx}">${card.desc || 'Details and description about this point.'}</p>
          </div>
        `).join('') || '';

        return `
          <section class="features-section section-container ${section.styleVariant || 'split'}-variant" id="features">
            <div class="container">
              <div class="section-header">
                <h2 data-editable="true" data-section-id="${id}" data-field="title">${data.title || 'Our Features'}</h2>
                <p data-editable="true" data-section-id="${id}" data-field="subtitle">${data.subtitle || 'Learn why our solution fits you best.'}</p>
              </div>
              <div class="features-grid">
                ${wrapCarousel(section, cardsHtml)}
              </div>
            </div>
          </section>
        `;

      case 'gallery':
        const itemsHtml = data.items?.map((item, idx) => `
          <div class="gallery-item">
            <img src="${item.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'}" alt="Showcase Work" data-editable="true" data-section-id="${id}" data-field="itemImage" data-sub-idx="${idx}">
            <div class="gallery-overlay">
              <div class="gallery-info">
                <h4 data-editable="true" data-section-id="${id}" data-field="itemTitle" data-sub-idx="${idx}">${item.title || 'Project Name'}</h4>
                <p data-editable="true" data-section-id="${id}" data-field="itemDesc" data-sub-idx="${idx}">${item.desc || 'Short description'}</p>
              </div>
            </div>
          </div>
        `).join('') || '';

        return `
          <section class="gallery-section section-container ${section.styleVariant || 'split'}-variant" id="gallery">
            <div class="container">
              <div class="section-header">
                <h2 data-editable="true" data-section-id="${id}" data-field="title">${data.title || 'Our Work Showcase'}</h2>
                <p data-editable="true" data-section-id="${id}" data-field="subtitle">${data.subtitle || 'Take a visual glance at our premium productions.'}</p>
              </div>
              <div class="gallery-grid">
                ${wrapCarousel(section, itemsHtml)}
              </div>
            </div>
          </section>
        `;

      case 'testimonials':
        const tCardsHtml = data.cards?.map((card, idx) => `
          <div class="testimonial-card">
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <p class="testimonial-quote" data-editable="true" data-section-id="${id}" data-field="cardQuote" data-sub-idx="${idx}">"${card.quote || 'Outstanding platform!'}"</p>
            <div class="testimonial-user">
              <img src="${card.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" class="testimonial-avatar" alt="Avatar" data-editable="true" data-section-id="${id}" data-field="cardAvatar" data-sub-idx="${idx}">
              <div class="testimonial-details">
                <h4 data-editable="true" data-section-id="${id}" data-field="cardName" data-sub-idx="${idx}">${card.name || 'User Name'}</h4>
                <span data-editable="true" data-section-id="${id}" data-field="cardRole" data-sub-idx="${idx}">${card.role || 'Designation'}</span>
              </div>
            </div>
          </div>
        `).join('') || '';

        return `
          <section class="testimonials-section section-container ${section.styleVariant || 'split'}-variant" id="testimonials">
            <div class="container">
              <div class="section-header">
                <h2 data-editable="true" data-section-id="${id}" data-field="title">${data.title || 'What People Say'}</h2>
                <p data-editable="true" data-section-id="${id}" data-field="subtitle">${data.subtitle || 'Read organic reviews directly from our client portfolio.'}</p>
              </div>
              <div class="testimonials-grid">
                ${wrapCarousel(section, tCardsHtml)}
              </div>
            </div>
          </section>
        `;

      case 'contact':
        return `
          <section class="contact-section section-container ${section.styleVariant || 'split'}-variant" id="contact">
            <div class="container">
              <div class="contact-grid">
                <div class="contact-info">
                  <h3 data-editable="true" data-section-id="${id}" data-field="title">${data.title || 'Connect With Us'}</h3>
                  <p data-editable="true" data-section-id="${id}" data-field="subtitle">${data.subtitle || 'Leave a message, or use our direct communication lines.'}</p>
                  <ul class="contact-details">
                    <li><i class="fa-solid fa-envelope"></i> <span data-editable="true" data-section-id="${id}" data-field="email">${data.email || 'hello@site.com'}</span></li>
                    <li><i class="fa-solid fa-phone"></i> <span data-editable="true" data-section-id="${id}" data-field="phone">${data.phone || '+1 (555) 123-4567'}</span></li>
                    <li><i class="fa-solid fa-map-pin"></i> <span data-editable="true" data-section-id="${id}" data-field="address">${data.address || 'Springfield, US'}</span></li>
                  </ul>
                </div>
                <div class="contact-form">
                  <form>
                    <div class="form-group">
                      <label>Full Name</label>
                      <input type="text" class="form-control" placeholder="Jane Doe" required>
                    </div>
                    <div class="form-group">
                      <label>Email Address</label>
                      <input type="email" class="form-control" placeholder="jane@example.com" required>
                    </div>
                    <div class="form-group">
                      <label>Your Message</label>
                      <textarea class="form-control" placeholder="Tell us about your project..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        `;

      case 'footer':
        return `
          <footer class="footer-section section-container ${section.styleVariant || 'split'}-variant" id="${id}">
            <div class="container">
              <span class="copyright" data-editable="true" data-section-id="${id}" data-field="copyright">${data.copyright || '© 2026 Site. All rights reserved.'}</span>
              <ul class="footer-links">
                <li><a href="#" data-editable="true" data-section-id="${id}" data-field="link1">${data.link1 || 'Privacy'}</a></li>
                <li><a href="#" data-editable="true" data-section-id="${id}" data-field="link2">${data.link2 || 'Terms'}</a></li>
              </ul>
            </div>
          </footer>
        `;
      case 'code':
        return `
          <section class="custom-code-section" id="${id}" data-editable="true" data-section-id="${id}" data-field="code" style="padding: 60px 24px;">
            <div class="container">
              ${data.code || '<!-- Paste your custom HTML, CSS, JS features here -->'}
            </div>
          </section>
        `;
      default:
        return '';
    }
  };

  const getDeviceClass = () => {
    if (deviceView === 'tablet') return 'device-tablet';
    if (deviceView === 'mobile') return 'device-mobile';
    return '';
  };

  return (
    <main className="builder-canvas-container">
      <div className={`canvas-frame-wrapper ${getDeviceClass()}`} id="canvas-wrapper">
        <div className="canvas-browser-bar">
          <div className="browser-dots">
            <span className="browser-dot red"></span>
            <span className="browser-dot yellow"></span>
            <span className="browser-dot green"></span>
          </div>
          <div className="browser-address">
            <i className="fa-solid fa-lock" style={{ marginRight: '6px', fontSize: '0.65rem' }}></i>
            https://<span>your-ai-website.com</span>
          </div>
        </div>
        <iframe 
          ref={iframeRef} 
          id="preview-frame" 
          className="canvas-iframe"
          title="Preview Viewport"
        ></iframe>
      </div>
    </main>
  );
}
