import React, { useState, useEffect, useRef } from 'react';
import { THEMES, FONTS } from '../templates';

// Categorize themes for cleaner 50+ browsing layout
const THEME_CATEGORIES = {
  classic: {
    name: "Classic & Light",
    keys: ["classic", "nordic", "clean", "platinum", "sky", "navy", "sage"]
  },
  dark: {
    name: "Dark & Tech",
    keys: ["royal", "neon", "sleek", "luxury", "plum", "wave", "moss", "cobalt", "electric", "bronze", "titanium", "deepspace"]
  },
  warm: {
    name: "Warm & Earthy",
    keys: ["sunset", "forest", "amber", "autumn", "dune", "coffee", "solar", "copper", "velvet", "peach", "lemon", "olive", "clay", "pumpkin"]
  },
  pastel: {
    name: "Playful & Soft",
    keys: ["lavender", "breeze", "rose", "orchid", "coral", "emerald", "mint", "lilac", "mustard", "raspberry", "grape", "banana", "rosegold", "iceblue"]
  }
};

export default function Sidebar({
  theme,
  setTheme,
  industry,
  setIndustry,
  font,
  setFont,
  sections,
  setSections,
  addNewSection,
  deleteSection,
  moveSection,
  projectName,
  setProjectName,
  selectedSectionId,
  setSelectedElementMeta,
  chatHistory,
  sendChatMessage,
  isChatLoading,
  loadProjectList,
  projectsList,
  loadProject,
  deleteProject,
  startNewProject,
  localPath,
  setLocalPath,
  exportFormat,
  setExportFormat,
  writeLocalProject
}) {
  const [activeTab, setActiveTab] = useState('ai');
  const [userInput, setUserInput] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('dark');

  const chatEndRef = useRef(null);

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Fetch 500+ templates list from backend on mount
  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error("Error loading templates list", err));
  }, []);

  const handleSendChat = () => {
    if (!userInput.trim() || isChatLoading) return;
    sendChatMessage(userInput);
    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  const loadTemplate = (tplId) => {
    fetch(`/api/template/${tplId}`)
      .then(res => res.json())
      .then(data => {
        setProjectName(data.projectName);
        setTheme(data.theme);
        setFont(data.font);
        setSections(data.sections);
        setIndustry(data.industry || 'agency');
      })
      .catch(err => console.error("Error loading template preset", err));
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'header': return 'fa-heading';
      case 'hero': return 'fa-image';
      case 'features': return 'fa-table-columns';
      case 'gallery': return 'fa-images';
      case 'testimonials': return 'fa-comments';
      case 'contact': return 'fa-envelope-open-text';
      case 'footer': return 'fa-window-minimize';
      case 'code': return 'fa-code';
      default: return 'fa-layer-group';
    }
  };

  // Filter templates list based on search input
  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(templateSearch.toLowerCase()) || 
    t.industry.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.theme.toLowerCase().includes(templateSearch.toLowerCase())
  ).slice(0, 15);

  const INDUSTRIES = {
    saas: "Apex SaaS & Cloud",
    coffee: "Artisanal Cafe & Roast",
    portfolio: "Creative Designer Portfolio",
    agency: "Vektor Digital Agency",
    restaurant: "Osteria Italian Restaurant",
    clinic: "Zenith Medical & Wellness",
    realestate: "Horizon Luxury Properties",
    fitness: "Iron Pulse Gym & Fitness",
    education: "Scholar Online Academy",
    law: "Justice & Partners Law Firm"
  };

  const suggestions = [
    "Generate a real estate website",
    "Change theme to Rose Gold Elegant",
    "Set hero style to glassmorphic",
    "Change features style to minimal",
    "Write as React project to C:/Users/user/Documents/MySite",
    "Add contact section"
  ];

  return (
    <aside className="builder-sidebar">
      <div className="sidebar-tabs">
        <button 
          className={`sidebar-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <i className="fa-solid fa-robot"></i>
          <span>AI Agent</span>
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          <i className="fa-solid fa-layer-group"></i>
          <span>Sections</span>
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          <i className="fa-solid fa-bars-staggered"></i>
          <span>Layout</span>
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          <i className="fa-solid fa-palette"></i>
          <span>Themes</span>
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('projects');
            loadProjectList();
          }}
        >
          <i className="fa-solid fa-folder-open"></i>
          <span>Projects</span>
        </button>
      </div>

      <div className="sidebar-content" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* AI AGENT PANEL (CHAT INTERFACE) */}
        {activeTab === 'ai' && (
          <div className="sidebar-panel active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 className="panel-title"><i className="fa-solid fa-circle-nodes"></i> Aleyo Building Agent</h3>
            <p className="panel-desc">Chat with the agent to generate complete websites, change layouts, alter color schemes, or update copy instantly.</p>
            
            {/* Chat Messages Log */}
            <div style={{
              flex: 1,
              minHeight: '250px',
              maxHeight: '380px',
              backgroundColor: '#020617',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '12px'
            }}>
              {chatHistory.map((chat, idx) => (
                <div 
                  key={idx}
                  style={{
                    alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    backgroundColor: chat.sender === 'user' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    borderTopRightRadius: chat.sender === 'user' ? '2px' : '12px',
                    borderTopLeftRadius: chat.sender === 'user' ? '12px' : '2px',
                    fontSize: '0.8rem',
                    lineHeight: '1.4'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.7rem', color: chat.sender === 'user' ? '#ddd' : 'var(--color-accent)', marginBottom: '3px' }}>
                    {chat.sender === 'user' ? 'You' : 'Aleyo Agent'}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: chat.text.replace(/\n/g, '<br/>') }}></div>
                </div>
              ))}
              
              {isChatLoading && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
                  <i className="fa-solid fa-spinner spinning" style={{ color: 'var(--color-accent)' }}></i> Agent is writing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask agent to change something..."
                className="field-input"
                style={{ flex: 1 }}
                disabled={isChatLoading}
              />
              <button 
                onClick={handleSendChat}
                className="header-btn header-btn-primary"
                style={{ padding: '0 16px' }}
                disabled={isChatLoading}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>

            {/* Suggestion Shortcuts */}
            <div className="section-group">
              <div className="group-label">Try Asking the Agent</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (!isChatLoading) {
                        sendChatMessage(s);
                      }
                    }}
                    className="header-btn"
                    style={{ fontSize: '0.7rem', justifyContent: 'flex-start', padding: '6px 10px', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Database */}
            <div className="section-group" style={{ marginTop: '16px' }}>
              <div className="group-label">Or Select from 500+ Curated Presets</div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={templateSearch}
                  onChange={(e) => {
                    setTemplateSearch(e.target.value);
                    setShowTemplates(true);
                  }}
                  onFocus={() => setShowTemplates(true)}
                  placeholder="Search templates (e.g. coffee, classic)..."
                  className="field-input"
                  style={{ marginBottom: '8px' }}
                />
                
                {showTemplates && templateSearch && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '40px', 
                    left: 0, 
                    right: 0, 
                    backgroundColor: '#0b0f19', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    zIndex: 20, 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-premium)'
                  }}>
                    {filteredTemplates.length > 0 ? (
                      filteredTemplates.map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => {
                            loadTemplate(t.id);
                            setShowTemplates(false);
                            setTemplateSearch('');
                          }}
                          style={{ 
                            padding: '10px 14px', 
                            cursor: 'pointer', 
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            fontSize: '0.8rem'
                          }}
                          className="theme-card-hover-highlight"
                        >
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{t.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{INDUSTRIES[t.industry]} | {t.theme} | {t.font}</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '10px 14px', fontSize: '0.8rem', color: 'var(--text-dark)' }}>No templates found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADD SECTIONS PANEL */}
        {activeTab === 'sections' && (
          <div className="sidebar-panel active">
            <h3 className="panel-title"><i className="fa-solid fa-square-plus"></i> Add Sections</h3>
            <p className="panel-desc">Click a layout component card below to append it to the viewport footer. Reorder elements in the "Layout" tab.</p>
            
            <div className="section-group">
              <div className="group-label">Component library</div>
              {['header', 'hero', 'features', 'gallery', 'testimonials', 'contact', 'footer', 'code'].map(type => (
                <div key={type} className="section-item-card" onClick={() => addNewSection(type)}>
                  <div className="section-card-info">
                    <h4 style={{ textTransform: 'capitalize' }}>{type === 'code' ? 'Custom Code' : type} block</h4>
                    <p>{type === 'code' ? 'Insert custom HTML, CSS, and JS code features' : `Append a pre-built ${type} section`}</p>
                  </div>
                  <button className="btn-add-section"><i className="fa-solid fa-plus"></i></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LAYOUT STRUCTURE PANEL */}
        {activeTab === 'layout' && (
          <div className="sidebar-panel active">
            <h3 className="panel-title"><i className="fa-solid fa-list-check"></i> Page Structure</h3>
            <p className="panel-desc">Manage components making up the canvas. Rearrange blocks up or down, or delete empty layout sections.</p>
            
            <div className="layer-list">
              {sections.length === 0 ? (
                <div className="inspector-empty-state" style={{ padding: '12px 0' }}>
                  <p>No active sections. Click "Sections" to add elements.</p>
                </div>
              ) : (
                sections.map((section, idx) => (
                  <div 
                    key={section.id} 
                    className={`layer-card ${selectedSectionId === section.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedElementMeta({ sectionId: section.id, field: 'title', subIndex: null });
                      const iframe = document.getElementById('preview-frame');
                      if (iframe) {
                        const target = iframe.contentDocument?.getElementById(section.id);
                        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  >
                    <div className="layer-info">
                      <i className={`fa-solid ${getSectionIcon(section.type)} layer-icon`}></i>
                      <div>
                        <span className="layer-title" style={{ textTransform: 'capitalize' }}>{section.type}</span>
                        <div className="layer-type">{section.id}</div>
                      </div>
                    </div>
                    <div className="layer-actions">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSection(section.id, -1); }}
                        disabled={idx === 0}
                        className="layer-action-btn move-up"
                        title="Move Up"
                      >
                        <i className="fa-solid fa-chevron-up"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSection(section.id, 1); }}
                        disabled={idx === sections.length - 1}
                        className="layer-action-btn move-down"
                        title="Move Down"
                      >
                        <i className="fa-solid fa-chevron-down"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                        className="layer-action-btn delete"
                        title="Delete Section"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* THEMES CUSTOMIZER PANEL */}
        {activeTab === 'theme' && (
          <div className="sidebar-panel active" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 className="panel-title"><i className="fa-solid fa-swatchbook"></i> Curator Themes</h3>
              <p className="panel-desc">Select from our massive catalog of 50+ balanced color palettes across 4 categories.</p>
            </div>
            
            {/* Category Select Toggles */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              {Object.keys(THEME_CATEGORIES).map(catKey => (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`device-btn ${selectedCategory === catKey ? 'active' : ''}`}
                  style={{ flex: 1, fontSize: '0.65rem', padding: '6px 0', height: 'auto', fontWeight: 'bold' }}
                >
                  {THEME_CATEGORIES[catKey].name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Categorized Theme Grid */}
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '350px', paddingRight: '4px' }}>
              <div className="theme-grid">
                {THEME_CATEGORIES[selectedCategory].keys.map(key => {
                  const tObj = THEMES[key];
                  if (!tObj) return null;
                  return (
                    <div 
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`theme-card ${theme === key ? 'active' : ''}`}
                      style={{ padding: '8px' }}
                    >
                      <div className="theme-card-title" style={{ fontSize: '0.7rem', marginBottom: '6px' }}>{tObj.name}</div>
                      <div className="theme-card-colors">
                        <span className="theme-dot" style={{ backgroundColor: tObj.primary, width: '10px', height: '10px' }}></span>
                        <span className="theme-dot" style={{ backgroundColor: tObj.secondary, width: '10px', height: '10px' }}></span>
                        <span className="theme-dot" style={{ backgroundColor: tObj.bg, width: '10px', height: '10px' }}></span>
                        <span className="theme-dot" style={{ backgroundColor: tObj.cardBg, width: '10px', height: '10px' }}></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div className="group-label">Global Typography</div>
              <select 
                value={font} 
                onChange={(e) => setFont(e.target.value)} 
                className="font-select"
              >
                {Object.keys(FONTS).map(key => (
                  <option key={key} value={key}>{FONTS[key].name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* PROJECTS PANEL */}
        {activeTab === 'projects' && (
          <div className="sidebar-panel active">
            <h3 className="panel-title"><i className="fa-solid fa-box-archive"></i> Projects</h3>
            <p className="panel-desc">Saves are persistently routed through the Python server into the `projects/` directory.</p>
            
            <div className="section-group">
              <div className="group-label">Local Workspace Router</div>
              
              <div className="editor-field" style={{ marginBottom: '12px' }}>
                <label className="field-label">Target Local Drive Path</label>
                <input 
                  type="text"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  placeholder="E.g., C:/Users/user/Documents/MySite"
                  className="field-input"
                />
              </div>

              <div className="editor-field" style={{ marginBottom: '12px' }}>
                <label className="field-label">Language / Framework</label>
                <select 
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="font-select"
                >
                  <option value="html">Single Page HTML</option>
                  <option value="react">React + Vite App</option>
                  <option value="nextjs">Next.js App</option>
                  <option value="fastapi">Python FastAPI</option>
                  <option value="php">PHP Webpage</option>
                </select>
              </div>

              <button 
                onClick={writeLocalProject}
                className="header-btn header-btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}
              >
                <i className="fa-solid fa-code"></i> Compile & Write to Local Drive
              </button>
            </div>

            <div className="section-group">
              <button 
                onClick={startNewProject}
                className="header-btn header-btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}
              >
                <i className="fa-solid fa-plus"></i> Start New Project
              </button>
              
              <div id="projects-list-container">
                {projectsList.length === 0 ? (
                  <div className="inspector-empty-state" style={{ padding: '12px 0' }}>
                    <p>No saved projects on server.</p>
                  </div>
                ) : (
                  projectsList.map(p => (
                    <div 
                      key={p.filename} 
                      className="project-card"
                      onClick={() => loadProject(p.filename)}
                    >
                      <div className="project-details">
                        <h4>{p.projectName}</h4>
                        <p>Theme: {THEMES[p.theme]?.name || p.theme} | {new Date(p.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteProject(p.filename); }}
                        className="btn-delete-project"
                        title="Delete Project"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
