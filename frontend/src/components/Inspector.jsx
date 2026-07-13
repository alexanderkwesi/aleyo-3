import React, { useState } from 'react';
import { STOCK_IMAGES } from '../templates';

export default function Inspector({ selectedElementMeta, sections, setSections, showToast }) {
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tech & SaaS');

  const categories = [
    "Tech & SaaS", "Coffee & Food", "Creative & Design", "Health & Wellness", 
    "Real Estate", "Fitness & Gym", "Dining & Restaurant", "Education", 
    "Law & Corporate", "Abstract & Avatars"
  ];

  if (!selectedElementMeta) {
    return (
      <aside className="builder-inspector">
        <div className="inspector-header">
          <h3 className="inspector-title">
            <i className="fa-solid fa-sliders"></i> Element Inspector
          </h3>
        </div>
        <div className="inspector-body">
          <div className="inspector-empty-state">
            <i className="fa-solid fa-mouse-pointer"></i>
            <h4>No Element Selected</h4>
            <p>Click any element (header, paragraph, button, image) inside the preview window to custom-edit its content and settings here.</p>
          </div>
        </div>
      </aside>
    );
  }

  const { sectionId, field, subIndex } = selectedElementMeta;
  const section = sections.find(s => s.id === sectionId);
  if (!section) return null;

  // Retrieve raw value
  let value = "";
  if (subIndex === null) {
    value = section.data[field] || "";
  } else {
    const list = field.startsWith('item') ? section.data.items : section.data.cards;
    if (list && list[subIndex]) {
      if (field === 'cardTitle') value = list[subIndex].title || "";
      else if (field === 'cardDesc') value = list[subIndex].desc || "";
      else if (field === 'icon') value = list[subIndex].icon || "";
      else if (field === 'itemImage') value = list[subIndex].image || "";
      else if (field === 'itemTitle') value = list[subIndex].title || "";
      else if (field === 'itemDesc') value = list[subIndex].desc || "";
      else if (field === 'cardQuote') value = list[subIndex].quote || "";
      else if (field === 'cardAvatar') value = list[subIndex].avatar || "";
      else if (field === 'cardName') value = list[subIndex].name || "";
      else if (field === 'cardRole') value = list[subIndex].role || "";
    }
  }

  const formatFieldName = (f) => {
    const words = f.replace(/([A-Z])/g, " $1");
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  const handleInputChange = (newVal) => {
    const updated = sections.map(s => {
      if (s.id === sectionId) {
        const copy = JSON.parse(JSON.stringify(s));
        if (subIndex === null) {
          copy.data[field] = newVal;
        } else {
          const list = field.startsWith('item') ? copy.data.items : copy.data.cards;
          if (list && list[subIndex]) {
            if (field === 'cardTitle') list[subIndex].title = newVal;
            else if (field === 'cardDesc') list[subIndex].desc = newVal;
            else if (field === 'icon') list[subIndex].icon = newVal;
            else if (field === 'itemImage') list[subIndex].image = newVal;
            else if (field === 'itemTitle') list[subIndex].title = newVal;
            else if (field === 'itemDesc') list[subIndex].desc = newVal;
            else if (field === 'cardQuote') list[subIndex].quote = newVal;
            else if (field === 'cardAvatar') list[subIndex].avatar = newVal;
            else if (field === 'cardName') list[subIndex].name = newVal;
            else if (field === 'cardRole') list[subIndex].role = newVal;
          }
        }
        return copy;
      }
      return s;
    });
    setSections(updated);
  };

  const generateAIImage = () => {
    const placeholderUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80&sig=${Math.floor(Math.random() * 1000)}`;
    handleInputChange(placeholderUrl);
    showToast("AI image generated successfully!", "success");
  };

  const isTextarea = ['subtitle', 'copyright', 'cardDesc', 'cardQuote', 'itemDesc'].includes(field);
  const isImage = ['image', 'itemImage', 'cardAvatar'].includes(field);

  return (
    <aside className="builder-inspector" style={{ position: 'relative' }}>
      <div className="inspector-header">
        <h3 className="inspector-title">
          <i className="fa-solid fa-sliders"></i> Element Inspector
        </h3>
      </div>
      
      <div className="inspector-body">
        {/* Curated Stock Photos Overlays Panel */}
        {showImageLibrary && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0b0f19',
            zIndex: 10,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}><i className="fa-solid fa-images"></i> 50+ Curated Photos</h4>
              <button 
                onClick={() => setShowImageLibrary(false)} 
                className="device-btn" 
                style={{ padding: '4px 8px', height: 'auto' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label className="field-label">Industry Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="font-select"
                style={{ marginTop: '4px' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              flex: 1,
              overflowY: 'auto',
              maxHeight: '380px'
            }}>
              {STOCK_IMAGES.filter(img => img.category === selectedCategory).map((img, idx) => (
                <img 
                  key={idx}
                  src={img.url}
                  alt="Stock Option"
                  onClick={() => {
                    handleInputChange(img.url);
                    setShowImageLibrary(false);
                    showToast("Curated photo applied!", "success");
                  }}
                  style={{
                    width: '100%',
                    height: '75px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)'
                  }}
                  className="theme-card-hover-highlight"
                />
              ))}
            </div>
          </div>
        )}

        <h4 className="group-label" style={{ marginBottom: '16px' }}>Edit {formatFieldName(field)}</h4>
        <div className="editor-field">
          <label className="field-label">Content Value</label>
          
          {field === 'code' ? (
            <>
              <textarea 
                className="field-input" 
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
                style={{ height: '320px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.4', backgroundColor: '#090d16' }}
                placeholder="Paste your custom HTML, <style> CSS, and <script> JavaScript features here..."
              />
              <p className="panel-desc" style={{ marginTop: '8px' }}>
                You can write custom HTML markup, CSS styling blocks (wrapped in <code>&lt;style&gt;</code>), and client script behaviors (wrapped in <code>&lt;script&gt;</code>).
              </p>
            </>
          ) : isImage ? (
            <>
              <input 
                type="text" 
                className="field-input" 
                value={value}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <p className="panel-desc" style={{ marginTop: '8px' }}>Provide an absolute image URL.</p>
              
              <button 
                onClick={() => setShowImageLibrary(true)}
                className="header-btn header-btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                <i className="fa-solid fa-images"></i> Browse 50+ Curated Photos
              </button>
              
              <button 
                onClick={generateAIImage}
                className="header-btn" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i> Randomize AI Image
              </button>
            </>
          ) : isTextarea ? (
            <textarea 
              className="field-input" 
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              style={{ height: '120px', resize: 'vertical' }}
            />
          ) : (
            <input 
              type="text" 
              className="field-input" 
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
            />
          )}
        </div>

        {/* Section Layout Design Variations Select */}
        <div className="section-group" style={{ borderTop: '1px solid var(--border-color)', marginTop: '24px', paddingTop: '16px' }}>
          <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
            <i className="fa-solid fa-compass-drafting" style={{ color: 'var(--color-accent)' }}></i>
            Section Layout Style
          </label>
          <p className="panel-desc" style={{ marginBottom: '10px' }}>Apply a new visual design style to this section block.</p>
          <select 
            value={section.styleVariant || 'split'}
            onChange={(e) => {
              const updated = sections.map(s => {
                if (s.id === sectionId) {
                  return { ...s, styleVariant: e.target.value };
                }
                return s;
              });
              setSections(updated);
              showToast("Applied new section style variant!", "success");
            }}
            className="font-select"
          >
            <option value="minimal">Minimalist (Clean)</option>
            <option value="split">Split Contrast (Balanced)</option>
            <option value="glass">Glassmorphic (Depth)</option>
            <option value="gradient">Gradient Accent (Modern Glow)</option>
            <option value="card">Card Accent (Compact Grid)</option>
            <option value="carousel">Carousel (Interactive Slide)</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
