import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';
import { DEFAULT_PROJECT, THEMES, FONTS } from './templates';
import './App.css';

export default function App() {
  const [projectName, setProjectName] = useState(DEFAULT_PROJECT.projectName);
  const [theme, setTheme] = useState(DEFAULT_PROJECT.theme);
  const [font, setFont] = useState(DEFAULT_PROJECT.font);
  const [sections, setSections] = useState(DEFAULT_PROJECT.sections);
  const [industry, setIndustry] = useState('agency');
  
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedElementMeta, setSelectedElementMeta] = useState(null);
  const [deviceView, setDeviceView] = useState('desktop');

  // Conversational Agent Chat States
  const [chatHistory, setChatHistory] = useState([
    { 
      sender: 'agent', 
      text: "Hello! I am your Aleyo Website Building Agent.\n\nTell me what kind of site you want to generate (e.g. *'generate a coffee shop website'*), or ask me to change layouts (e.g., *'add contact section'*), edit style properties, or customize fonts!" 
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Projects list loaded from FastAPI
  const [projectsList, setProjectsList] = useState([]);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Workspace Path & Language states
  const [localPath, setLocalPath] = useState("C:/Users/user/Documents/Aleyo_Site");
  const [exportFormat, setExportFormat] = useState("react");

  // AI Website Builder Wizard States
  const [showAIWizard, setShowAIWizard] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiIndustry, setAiIndustry] = useState("saas");
  const [aiTheme, setAiTheme] = useState("royal");
  const [aiFont, setAiFont] = useState("outfit");
  const [aiSections, setAiSections] = useState(['header', 'hero', 'features', 'gallery', 'testimonials', 'contact', 'footer']);
  const [isWizardLoading, setIsWizardLoading] = useState(false);

  // Load projects list from server on mount
  useEffect(() => {
    loadProjectList();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // ----------------------------------------------------
  // PYTHON BACKEND API CALLS
  // ----------------------------------------------------

  const loadProjectList = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (e) {
      console.error("Error loading projects list from server", e);
    }
  };

  const saveProject = async () => {
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, theme, font, sections, industry })
      });
      if (res.ok) {
        showToast("Project saved securely on server disk!", "success");
        loadProjectList();
      } else {
        throw new Error();
      }
    } catch (e) {
      showToast("Error saving project to server.", "danger");
    }
  };

  const loadProject = async (filename) => {
    try {
      const res = await fetch(`/api/load/${filename}`);
      if (res.ok) {
        const data = await res.json();
        setProjectName(data.projectName);
        setTheme(data.theme);
        setFont(data.font);
        setSections(data.sections);
        setIndustry(data.industry || 'agency');
        setSelectedElementMeta(null);
        showToast(`Loaded: "${data.projectName}"`, "success");
      }
    } catch (e) {
      showToast("Error loading project file.", "danger");
    }
  };

  const deleteProject = async (filename) => {
    try {
      const res = await fetch(`/api/projects/${filename}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Project deleted.", "success");
        loadProjectList();
      }
    } catch (e) {
      showToast("Error deleting project.", "danger");
    }
  };

  const writeLocalProject = async () => {
    showToast("Compiling codebase...", "success");
    try {
      const res = await fetch('/api/write-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, theme, font, sections, localPath, exportFormat })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Written to local drive successfully!`, "success");
        setChatHistory(prev => [...prev, {
          sender: 'agent',
          text: `I have compiled your website into a <strong>${exportFormat.toUpperCase()}</strong> structure and saved all files to: <code>${data.localPath}</code>.<br/><br/>**Files written:**<br/>` + data.writtenFiles.map(f => `- <code>${f}</code>`).join('<br/>')
        }]);
      } else {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }
    } catch (e) {
      showToast(e.message || "Failed to write files.", "danger");
      setChatHistory(prev => [...prev, {
        sender: 'agent',
        text: `Failed to write codebase: ${e.message || e}`
      }]);
    }
  };

  const startNewProject = () => {
    if (window.confirm("Start a new project? Unsaved changes will be cleared.")) {
      setProjectName(DEFAULT_PROJECT.projectName);
      setTheme(DEFAULT_PROJECT.theme);
      setFont(DEFAULT_PROJECT.font);
      setSections(DEFAULT_PROJECT.sections);
      setSelectedElementMeta(null);
      setChatHistory([
        { sender: 'agent', text: "Workspace cleared. What kind of website shall we build next?" }
      ]);
      showToast("Started new workspace.", "success");
    }
  };

  const sendChatMessage = async (userMessage) => {
    setIsChatLoading(true);
    // Append user message
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setSelectedElementMeta(null);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          currentState: { projectName, theme, font, sections, industry }
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Update states dynamically returned by the agent
        setProjectName(data.updatedState.projectName);
        setTheme(data.updatedState.theme);
        setFont(data.updatedState.font);
        setSections(data.updatedState.sections);
        setIndustry(data.updatedState.industry || 'agency');
        
        // Append agent response
        setChatHistory(prev => [...prev, { sender: 'agent', text: data.reply }]);
        showToast("Agent applied modifications!", "success");
      } else {
        throw new Error();
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { sender: 'agent', text: "Sorry, I had trouble communicating with my Python processing modules. Please verify the backend is running." }]);
      showToast("Agent communication failed.", "danger");
    } finally {
      setIsChatLoading(false);
    }
  };

  // ----------------------------------------------------
  // SECTION EDITING & REARRANGEMENTS
  // ----------------------------------------------------

  const addNewSection = async (type) => {
    try {
      const res = await fetch(`/api/default-section?type=${type}&industry=${industry}`);
      if (res.ok) {
        const newSection = await res.json();
        setSections(prev => [...prev, newSection]);
        showToast(`Appended themed ${type} component.`, "success");
      } else {
        throw new Error();
      }
    } catch (e) {
      const id = `${type}_${Date.now()}`;
      let defaultData = { logo: 'Aleyo Studio', title: 'Designed for Impact', copyright: '© 2026 Site' };
      setSections(prev => [...prev, { id, type, data: defaultData }]);
      showToast(`Appended fallback ${type} component.`, "success");
    }
  };

  const triggerAIGenerate = async () => {
    if (aiSections.length === 0) {
      showToast("Please choose at least one layout element to generate.", "danger");
      return;
    }
    setIsWizardLoading(true);
    try {
      const res = await fetch('/api/agent/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          industry: aiIndustry,
          theme: aiTheme,
          font: aiFont,
          sections: aiSections
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProjectName(data.projectName);
        setTheme(data.theme);
        setFont(data.font);
        setSections(data.sections);
        setIndustry(data.industry);
        setShowAIWizard(false);
        showToast("Successfully generated customized project using AI Builder!", "success");
      } else {
        throw new Error();
      }
    } catch (e) {
      showToast("Failed to compile AI generated site. Try again.", "danger");
    } finally {
      setIsWizardLoading(false);
    }
  };

  const deleteSection = (id) => {
    setSections(prev => prev.filter(s => s.id !== id));
    setSelectedElementMeta(null);
    showToast("Section removed.", "success");
  };

  const moveSection = (id, direction) => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx === -1) return;

    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
    showToast("Reordered layers.", "success");
  };

  // ----------------------------------------------------
  // STANDALONE WEBSITE EXPORTER
  // ----------------------------------------------------

  const exportCode = async () => {
    showToast("Compiling standalone website...", "success");

    let cssText = "";
    try {
      const res = await fetch('/preview-styles.css');
      if (res.ok) {
        cssText = await res.text();
      }
    } catch (e) {
      console.error("Could not fetch preview stylesheet", e);
    }

    const themeObj = THEMES[theme] || THEMES.royal;
    const fontObj = FONTS[font] || FONTS.outfit;

    let fileContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
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
    ${cssText}
  </style>
</head>
<body>
    `;

    sections.forEach(section => {
      const iframe = document.getElementById('preview-frame');
      const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
      const targetEl = doc?.getElementById(section.id);
      if (targetEl) {
        let cleanedHtml = targetEl.outerHTML;
        cleanedHtml = cleanedHtml.replace(/\s*data-editable="[^"]*"/g, '');
        cleanedHtml = cleanedHtml.replace(/\s*data-section-id="[^"]*"/g, '');
        cleanedHtml = cleanedHtml.replace(/\s*data-field="[^"]*"/g, '');
        cleanedHtml = cleanedHtml.replace(/\s*data-sub-idx="[^"]*"/g, '');
        cleanedHtml = cleanedHtml.replace(/\s*class="[^"]*active-element[^"]*"/g, 'class=""');
        fileContent += cleanedHtml;
      }
    });

    fileContent += `
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

    // Handle form contact message submission alerts
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your message was submitted successfully.');
        form.reset();
      });
    });
  </script>
</body>
</html>
    `;

    const blob = new Blob([fileContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_site.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Standalone HTML downloaded!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* HEADER */}
      <header className="builder-header">
        <div className="brand-section">
          <div className="brand-logo">
            <i className="fa-solid fa-wand-magic-sparkles"></i> Aleyo Builder
          </div>
          <span className="brand-tag">AI Agent Mode</span>
          <input 
            type="text" 
            className="project-name-input" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        {/* View Resizer */}
        <div className="device-controls">
          <button 
            className={`device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
            onClick={() => setDeviceView('desktop')}
            title="Desktop View"
          >
            <i className="fa-solid fa-desktop"></i>
          </button>
          <button 
            className={`device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
            onClick={() => setDeviceView('tablet')}
            title="Tablet View"
          >
            <i className="fa-solid fa-tablet-screen-button"></i>
          </button>
          <button 
            className={`device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceView('mobile')}
            title="Mobile View"
          >
            <i className="fa-solid fa-mobile-screen-button"></i>
          </button>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <button 
            className={`header-btn ${previewMode ? 'header-btn-primary' : ''}`}
            onClick={() => {
              setPreviewMode(!previewMode);
              setSelectedElementMeta(null);
            }}
          >
            {previewMode ? (
              <><i className="fa-solid fa-pen-to-square"></i> Editor Mode</>
            ) : (
              <><i className="fa-solid fa-eye"></i> Preview Mode</>
            )}
          </button>
          <button 
            className="header-btn" 
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowAIWizard(true)}
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i> AI Wizard Builder
          </button>
          <button className="header-btn" onClick={saveProject}>
            <i className="fa-solid fa-floppy-disk"></i> Save Project
          </button>
          <button className="header-btn header-btn-primary" onClick={exportCode}>
            <i className="fa-solid fa-download"></i> Export Code
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="builder-workspace">
        <Sidebar
          theme={theme}
          setTheme={setTheme}
          industry={industry}
          setIndustry={setIndustry}
          font={font}
          setFont={setFont}
          sections={sections}
          setSections={setSections}
          addNewSection={addNewSection}
          deleteSection={deleteSection}
          moveSection={moveSection}
          projectName={projectName}
          setProjectName={setProjectName}
          selectedSectionId={selectedElementMeta?.sectionId}
          setSelectedElementMeta={setSelectedElementMeta}
          chatHistory={chatHistory}
          sendChatMessage={sendChatMessage}
          isChatLoading={isChatLoading}
          loadProjectList={loadProjectList}
          projectsList={projectsList}
          loadProject={loadProject}
          deleteProject={deleteProject}
          startNewProject={startNewProject}
          localPath={localPath}
          setLocalPath={setLocalPath}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          writeLocalProject={writeLocalProject}
        />
        
        <Canvas
          projectName={projectName}
          theme={theme}
          font={font}
          sections={sections}
          previewMode={previewMode}
          selectedElementMeta={selectedElementMeta}
          setSelectedElementMeta={setSelectedElementMeta}
          deviceView={deviceView}
        />

        <Inspector
          selectedElementMeta={selectedElementMeta}
          sections={sections}
          setSections={setSections}
          showToast={showToast}
        />
      </div>

      {/* AI Website Builder Wizard Modal Overlay */}
      {showAIWizard && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div className="modal-content" style={{
            background: 'linear-gradient(135deg, #131b2e, #0b1120)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '550px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '1.25rem', fontWeight: '800' }}>
                <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--color-accent)' }}></i> AI Website Builder Wizard
              </h3>
              <button 
                onClick={() => setShowAIWizard(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="editor-field">
              <label className="field-label">Describe your website concept</label>
              <textarea 
                className="field-input" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                style={{ height: '90px', resize: 'none' }}
                placeholder="E.g., A minimalist dark-mode coffee shop in Seattle with layout carousels..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="editor-field">
                <label className="field-label">Industry Context</label>
                <select className="font-select" value={aiIndustry} onChange={(e) => setAiIndustry(e.target.value)}>
                  <option value="saas">Apex SaaS & Cloud</option>
                  <option value="coffee">Coffee Shop & Cafe</option>
                  <option value="portfolio">Personal Portfolio</option>
                  <option value="restaurant">Italian Restaurant</option>
                  <option value="clinic">Clinic & Wellness</option>
                  <option value="realestate">Real Estate & Properties</option>
                  <option value="fitness">Gym & Fitness</option>
                  <option value="education">Scholar Academy</option>
                  <option value="law">Law Firm & Counsel</option>
                  <option value="agency">Creative Agency</option>
                </select>
              </div>

              <div className="editor-field">
                <label className="field-label">Visual Theme</label>
                <select className="font-select" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)}>
                  <option value="royal">Royal Indigo</option>
                  <option value="neon">Cyber Neon</option>
                  <option value="forest">Emerald Forest</option>
                  <option value="sunset">Crimson Sunset</option>
                  <option value="classic">Minimalist Light</option>
                  <option value="nordic">Nordic Frost</option>
                  <option value="deepspace">Deep Space Dark</option>
                  <option value="rosegold">Rose Gold Elegant</option>
                  <option value="iceblue">Ice Blue Frost</option>
                  <option value="sage">Sage Calm</option>
                </select>
              </div>
            </div>

            <div className="editor-field">
              <label className="field-label">Typography Style</label>
              <select className="font-select" value={aiFont} onChange={(e) => setAiFont(e.target.value)}>
                <option value="outfit">Outfit (Modern Sans)</option>
                <option value="inter">Inter (Neutral Sans)</option>
                <option value="playfair">Playfair Display (Elegant Serif)</option>
                <option value="space">Space Grotesk (Tech Monospace)</option>
              </select>
            </div>

            <div className="editor-field">
              <label className="field-label">Structure Layout Elements</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                {[
                  { key: 'header', label: 'Header Menu' },
                  { key: 'hero', label: 'Hero Showcase' },
                  { key: 'features', label: 'Features Checklist' },
                  { key: 'gallery', label: 'Work Gallery' },
                  { key: 'testimonials', label: 'Client Reviews' },
                  { key: 'contact', label: 'Contact Form' },
                  { key: 'footer', label: 'Footer Links' },
                  { key: 'code', label: 'Custom Code Element' }
                ].map(item => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={aiSections.includes(item.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAiSections(prev => [...prev, item.key]);
                        } else {
                          setAiSections(prev => prev.filter(x => x !== item.key));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={() => setShowAIWizard(false)}
                className="header-btn" 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                onClick={triggerAIGenerate}
                className="header-btn header-btn-primary" 
                style={{ flex: 1.5, justifyContent: 'center' }}
                disabled={isWizardLoading}
              >
                {isWizardLoading ? (
                  <><i className="fa-solid fa-spinner spinning"></i> Building Site...</>
                ) : (
                  <><i className="fa-solid fa-bolt"></i> Generate Project</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast Notifications */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
