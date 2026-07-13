// templates.js - Frontend configuration presets and 50+ Curated Themes

export const THEMES = {
  // Original 6
  royal: { name: "Royal Indigo", primary: "#6366f1", primaryHover: "#4f46e5", secondary: "#10b981", bg: "#0f172a", text: "#f8fafc", textMuted: "#94a3b8", cardBg: "#1e293b", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" },
  neon: { name: "Cyber Neon", primary: "#06b6d4", primaryHover: "#0891b2", secondary: "#ec4899", bg: "#09090b", text: "#f4f4f5", textMuted: "#a1a1aa", cardBg: "#18181b", cardBorder: "rgba(255, 255, 255, 0.08)", borderRadius: "8px" },
  forest: { name: "Emerald Forest", primary: "#059669", primaryHover: "#047857", secondary: "#f59e0b", bg: "#061a14", text: "#ecfdf5", textMuted: "#a7f3d0", cardBg: "#0b2e24", cardBorder: "rgba(167, 243, 208, 0.05)", borderRadius: "16px" },
  sunset: { name: "Crimson Sunset", primary: "#f43f5e", primaryHover: "#e11d48", secondary: "#fb923c", bg: "#0f090d", text: "#fff1f2", textMuted: "#fda4af", cardBg: "#1c0f17", cardBorder: "rgba(253, 164, 175, 0.08)", borderRadius: "14px" },
  classic: { name: "Minimalist Light", primary: "#18181b", primaryHover: "#27272a", secondary: "#2563eb", bg: "#ffffff", text: "#09090b", textMuted: "#71717a", cardBg: "#f4f4f5", cardBorder: "rgba(9, 9, 11, 0.05)", borderRadius: "8px" },
  nordic: { name: "Nordic Frost", primary: "#4f46e5", primaryHover: "#4338ca", secondary: "#38bdf8", bg: "#f3f4f6", text: "#1f2937", textMuted: "#4b5563", cardBg: "#ffffff", cardBorder: "rgba(31, 41, 55, 0.05)", borderRadius: "20px" },
  
  // Nature & Pastels (7-20)
  sapphire: { name: "Midnight Sapphire", primary: "#2563eb", primaryHover: "#1d4ed8", secondary: "#06b6d4", bg: "#020617", text: "#f1f5f9", textMuted: "#94a3b8", cardBg: "#0f172a", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" },
  lavender: { name: "Lavender Bloom", primary: "#8b5cf6", primaryHover: "#7c3aed", secondary: "#f472b6", bg: "#faf5ff", text: "#4c1d95", textMuted: "#7c3aed", cardBg: "#f3e8ff", cardBorder: "rgba(139, 92, 246, 0.1)", borderRadius: "16px" },
  amber: { name: "Sunset Amber", primary: "#d97706", primaryHover: "#b45309", secondary: "#10b981", bg: "#fdf6e2", text: "#78350f", textMuted: "#b45309", cardBg: "#fef3c7", cardBorder: "rgba(217, 119, 6, 0.1)", borderRadius: "10px" },
  breeze: { name: "Ocean Breeze", primary: "#0ea5e9", primaryHover: "#0284c7", secondary: "#14b8a6", bg: "#f0f9ff", text: "#0369a1", textMuted: "#0ea5e9", cardBg: "#e0f2fe", cardBorder: "rgba(14, 165, 233, 0.1)", borderRadius: "14px" },
  sleek: { name: "Charcoal Sleek", primary: "#3f3f46", primaryHover: "#27272a", secondary: "#71717a", bg: "#18181b", text: "#f4f4f5", textMuted: "#a1a1aa", cardBg: "#27272a", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "6px" },
  luxury: { name: "Gold Luxury", primary: "#d97706", primaryHover: "#b45309", secondary: "#171717", bg: "#0a0a0a", text: "#f5f5f5", textMuted: "#a3a3a3", cardBg: "#171717", cardBorder: "rgba(217, 119, 6, 0.2)", borderRadius: "4px" },
  autumn: { name: "Autumn Leaf", primary: "#c2410c", primaryHover: "#9a3412", secondary: "#ea580c", bg: "#fff7ed", text: "#7c2d12", textMuted: "#c2410c", cardBg: "#ffedd5", cardBorder: "rgba(194, 65, 12, 0.1)", borderRadius: "12px" },
  rose: { name: "Rose Quartz", primary: "#ec4899", primaryHover: "#db2777", secondary: "#a855f7", bg: "#fff1f2", text: "#9f1239", textMuted: "#db2777", cardBg: "#ffe4e6", cardBorder: "rgba(236, 72, 153, 0.1)", borderRadius: "18px" },
  clean: { name: "Slate Clean", primary: "#475569", primaryHover: "#334155", secondary: "#64748b", bg: "#f8fafc", text: "#0f172a", textMuted: "#475569", cardBg: "#f1f5f9", cardBorder: "rgba(71, 85, 105, 0.05)", borderRadius: "8px" },
  plum: { name: "Plum Dream", primary: "#6b21a8", primaryHover: "#581c87", secondary: "#db2777", bg: "#1a0b2e", text: "#f3e8ff", textMuted: "#c084fc", cardBg: "#2e1065", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "14px" },
  wave: { name: "Teal Wave", primary: "#0d9488", primaryHover: "#0f766e", secondary: "#06b6d4", bg: "#041b18", text: "#ccfbf1", textMuted: "#2dd4bf", cardBg: "#072e2a", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" },
  moss: { name: "Forest Moss", primary: "#15803d", primaryHover: "#166534", secondary: "#84cc16", bg: "#0b1c0e", text: "#dcfce7", textMuted: "#4ade80", cardBg: "#142d18", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "16px" },
  dune: { name: "Sand Dune", primary: "#854d0e", primaryHover: "#713f12", secondary: "#ca8a04", bg: "#fefcf4", text: "#451a03", textMuted: "#854d0e", cardBg: "#fef9e7", cardBorder: "rgba(133, 77, 14, 0.1)", borderRadius: "10px" },
  coffee: { name: "Coffee Warmth", primary: "#78350f", primaryHover: "#451a03", secondary: "#d97706", bg: "#faf7f2", text: "#451a03", textMuted: "#78350f", cardBg: "#f0e6d6", cardBorder: "rgba(120, 53, 15, 0.1)", borderRadius: "12px" },
  
  // Vibrant & Neon (21-35)
  solar: { name: "Solar Flare", primary: "#ea580c", primaryHover: "#c2410c", secondary: "#eab308", bg: "#0d0400", text: "#fff7ed", textMuted: "#fdba74", cardBg: "#1c0d02", cardBorder: "rgba(234, 88, 12, 0.15)", borderRadius: "10px" },
  orchid: { name: "Orchid Mist", primary: "#d946ef", primaryHover: "#c026d3", secondary: "#8b5cf6", bg: "#0a020d", text: "#fae8ff", textMuted: "#f0abfc", cardBg: "#190822", cardBorder: "rgba(217, 70, 239, 0.15)", borderRadius: "14px" },
  coral: { name: "Coral Reef", primary: "#ff6b6b", primaryHover: "#fa5252", secondary: "#4dabf7", bg: "#fff5f5", text: "#c92a2a", textMuted: "#fa5252", cardBg: "#ffe3e3", cardBorder: "rgba(255, 107, 107, 0.1)", borderRadius: "16px" },
  cobalt: { name: "Cobalt Power", primary: "#1d4ed8", primaryHover: "#1e40af", secondary: "#e11d48", bg: "#030a21", text: "#eff6ff", textMuted: "#93c5fd", cardBg: "#0b153b", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" },
  copper: { name: "Copper Vintage", primary: "#b45309", primaryHover: "#92400e", secondary: "#475569", bg: "#1a120b", text: "#fef3c7", textMuted: "#f59e0b", cardBg: "#2d1f10", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "6px" },
  platinum: { name: "Platinum Premium", primary: "#0f172a", primaryHover: "#1e293b", secondary: "#64748b", bg: "#f1f5f9", text: "#0f172a", textMuted: "#475569", cardBg: "#e2e8f0", cardBorder: "rgba(0, 0, 0, 0.05)", borderRadius: "12px" },
  emerald: { name: "Emerald Shine", primary: "#059669", primaryHover: "#047857", secondary: "#06b6d4", bg: "#022c22", text: "#ecfdf5", textMuted: "#34d399", cardBg: "#044333", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" },
  mint: { name: "Mint Fresh", primary: "#0d9488", primaryHover: "#0f766e", secondary: "#84cc16", bg: "#f0fdfa", text: "#115e59", textMuted: "#0d9488", cardBg: "#ccfbf1", cardBorder: "rgba(13, 148, 136, 0.1)", borderRadius: "16px" },
  lilac: { name: "Lilac Whisper", primary: "#d946ef", primaryHover: "#c026d3", secondary: "#6366f1", bg: "#fdf4ff", text: "#701a75", textMuted: "#d946ef", cardBg: "#fae8ff", cardBorder: "rgba(217, 70, 239, 0.1)", borderRadius: "14px" },
  velvet: { name: "Burgundy Velvet", primary: "#881337", primaryHover: "#4c0519", secondary: "#b45309", bg: "#2a020c", text: "#ffe4e6", textMuted: "#fb7185", cardBg: "#4c0519", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "10px" },
  navy: { name: "Navy Trust", primary: "#1e3a8a", primaryHover: "#172554", secondary: "#d97706", bg: "#f8fafc", text: "#1e3a8a", textMuted: "#3b82f6", cardBg: "#eff6ff", cardBorder: "rgba(30, 58, 138, 0.05)", borderRadius: "8px" },
  peach: { name: "Peach Soft", primary: "#ea580c", primaryHover: "#c2410c", secondary: "#f43f5e", bg: "#fffaf8", text: "#7c2d12", textMuted: "#f97316", cardBg: "#ffedd5", cardBorder: "rgba(234, 88, 12, 0.1)", borderRadius: "16px" },
  lemon: { name: "Lemon Sherbet", primary: "#ca8a04", primaryHover: "#a16207", secondary: "#0d9488", bg: "#fefdf0", text: "#713f12", textMuted: "#ca8a04", cardBg: "#fef9c3", cardBorder: "rgba(202, 138, 4, 0.1)", borderRadius: "12px" },
  electric: { name: "Electric Violet", primary: "#8b5cf6", primaryHover: "#7c3aed", secondary: "#06b6d4", bg: "#0c051f", text: "#f5f3ff", textMuted: "#c084fc", cardBg: "#1a0e3c", cardBorder: "rgba(139, 92, 246, 0.15)", borderRadius: "12px" },
  olive: { name: "Olive Grove", primary: "#65a30d", primaryHover: "#4d7c0f", secondary: "#ca8a04", bg: "#f7fee7", text: "#3f6212", textMuted: "#65a30d", cardBg: "#ecfccb", cardBorder: "rgba(101, 163, 13, 0.1)", borderRadius: "14px" },
  
  // Industrial & Modern (36-51)
  bronze: { name: "Bronze Shield", primary: "#b45309", primaryHover: "#92400e", secondary: "#4b5563", bg: "#111827", text: "#f9fafb", textMuted: "#9ca3af", cardBg: "#1f2937", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" },
  titanium: { name: "Titanium Industrial", primary: "#4b5563", primaryHover: "#374151", secondary: "#9ca3af", bg: "#0f172a", text: "#f8fafc", textMuted: "#94a3b8", cardBg: "#1e293b", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "6px" },
  sky: { name: "Sky Blue", primary: "#0284c7", primaryHover: "#0369a1", secondary: "#0ea5e9", bg: "#f0f9ff", text: "#0c4a6e", textMuted: "#0284c7", cardBg: "#e0f2fe", cardBorder: "rgba(2, 132, 199, 0.1)", borderRadius: "12px" },
  raspberry: { name: "Raspberry Sweet", primary: "#db2777", primaryHover: "#be185d", secondary: "#4f46e5", bg: "#fdf2f8", text: "#9d174d", textMuted: "#db2777", cardBg: "#fce7f3", cardBorder: "rgba(219, 39, 119, 0.1)", borderRadius: "16px" },
  mustard: { name: "Mustard Bold", primary: "#eab308", primaryHover: "#ca8a04", secondary: "#18181b", bg: "#fffbeb", text: "#713f12", textMuted: "#ca8a04", cardBg: "#fef3c7", cardBorder: "rgba(234, 179, 8, 0.1)", borderRadius: "10px" },
  clay: { name: "Clay Earth", primary: "#ea580c", primaryHover: "#c2410c", secondary: "#475569", bg: "#faf6f0", text: "#451a03", textMuted: "#ea580c", cardBg: "#eedfcc", cardBorder: "rgba(234, 88, 12, 0.1)", borderRadius: "8px" },
  ocean: { name: "Indigo Ocean", primary: "#4f46e5", primaryHover: "#4338ca", secondary: "#0ea5e9", bg: "#0b0c1f", text: "#e0e7ff", textMuted: "#a5b4fc", cardBg: "#15183d", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" },
  grape: { name: "Grape Fusion", primary: "#7c3aed", primaryHover: "#6d28d9", secondary: "#d946ef", bg: "#070212", text: "#f5f3ff", textMuted: "#c084fc", cardBg: "#170e30", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "14px" },
  banana: { name: "Banana Pastel", primary: "#eab308", primaryHover: "#ca8a04", secondary: "#10b981", bg: "#fefdf7", text: "#451a03", textMuted: "#ca8a04", cardBg: "#fefce8", cardBorder: "rgba(234, 179, 8, 0.05)", borderRadius: "16px" },
  pumpkin: { name: "Pumpkin Spice", primary: "#d97706", primaryHover: "#b45309", secondary: "#dc2626", bg: "#fdf8f4", text: "#78350f", textMuted: "#d97706", cardBg: "#fef3e7", cardBorder: "rgba(217, 119, 6, 0.08)", borderRadius: "12px" },
  slate: { name: "Slate Blue", primary: "#3b82f6", primaryHover: "#2563eb", secondary: "#64748b", bg: "#0f172a", text: "#f8fafc", textMuted: "#94a3b8", cardBg: "#1e293b", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" },
  teal: { name: "Teal Green", primary: "#0d9488", primaryHover: "#0f766e", secondary: "#22c55e", bg: "#022c22", text: "#ecfdf5", textMuted: "#14b8a6", cardBg: "#054f40", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "10px" },
  rosegold: { name: "Rose Gold Elegant", primary: "#fda4af", primaryHover: "#f43f5e", secondary: "#1e293b", bg: "#faf7f8", text: "#4c0519", textMuted: "#9f1239", cardBg: "#fbeff1", cardBorder: "rgba(253, 164, 255, 0.08)", borderRadius: "16px" },
  deepspace: { name: "Deep Space Dark", primary: "#6366f1", primaryHover: "#4f46e5", secondary: "#38bdf8", bg: "#020204", text: "#f1f5f9", textMuted: "#94a3b8", cardBg: "#0a0a0f", cardBorder: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" },
  iceblue: { name: "Ice Blue Frost", primary: "#38bdf8", primaryHover: "#0ea5e9", secondary: "#818cf8", bg: "#f0fdfa", text: "#0369a1", textMuted: "#0ea5e9", cardBg: "#e0f2fe", cardBorder: "rgba(56, 189, 248, 0.1)", borderRadius: "24px" },
  sage: { name: "Sage Calm", primary: "#2e7d32", primaryHover: "#1b5e20", secondary: "#607d8b", bg: "#f1f8e9", text: "#1b5e20", textMuted: "#4caf50", cardBg: "#dcedc8", cardBorder: "rgba(46, 125, 50, 0.05)", borderRadius: "14px" }
};

export const FONTS = {
  outfit: {
    name: "Outfit (Modern)",
    value: "'Outfit', sans-serif",
    import: "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');"
  },
  inter: {
    name: "Inter (Neutral)",
    value: "'Inter', sans-serif",
    import: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');"
  },
  playfair: {
    name: "Playfair (Elegant)",
    value: "'Playfair Display', serif",
    import: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@400;600&display=swap');"
  },
  space: {
    name: "Space Grotesk (Tech)",
    value: "'Space Grotesk', sans-serif",
    import: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');"
  }
};

export const DEFAULT_PROJECT = {
  projectName: "My React Project",
  theme: "royal",
  font: "outfit",
  sections: [
    {
      id: "header_init",
      type: "header",
      data: {
        logo: "Aleyo Studio",
        link1: "Features",
        link2: "Gallery",
        link3: "Testimonials",
        link4: "Contact",
        ctaText: "Get Started"
      }
    },
    {
      id: "hero_init",
      type: "hero",
      data: {
        title: "Create stunning websites in seconds with React & Python",
        subtitle: "Aleyo Builder AI empowers creators, developers, and businesses to build high-converting, premium websites using combinatoric generators.",
        cta1: "Start Building",
        cta2: "Learn More",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
      }
    },
    {
      id: "features_init",
      type: "features",
      data: {
        title: "Why Choose Us",
        subtitle: "We combine modern visual aesthetics with blazing fast performance to deliver websites that elevate your brand.",
        cards: [
          {
            icon: "✨",
            title: "Combinatoric Presets",
            desc: "Generate over 500+ design configurations instantly combining 10 industries, 6 themes, 4 font scales, and layouts."
          },
          {
            icon: "🐍",
            title: "Python backend",
            desc: "FastAPI server hosts structural templates, provides AI copywriting classification, and saves files on-disk."
          },
          {
            icon: "⚛️",
            title: "React Hooks state",
            desc: "Full modular SPA dashboard with synchronized component inspect logs and real-time canvas updates."
          }
        ]
      }
    },
    {
      id: "contact_init",
      type: "contact",
      data: {
        title: "Get in Touch",
        subtitle: "Have a project in mind or want to know how we can help? Send us a message and our team will get right back to you.",
        email: "hello@aleyostudio.com",
        phone: "+1 (555) 019-2834",
        address: "742 Evergreen Terrace, Springfield, US"
      }
    },
    {
      id: "footer_init",
      type: "footer",
      data: {
        copyright: "© 2026 Aleyo Studio. Built with Aleyo Builder AI.",
        link1: "Privacy Policy",
        link2: "Terms of Service"
      }
    }
  ]
};

export const STOCK_IMAGES = [
  // Tech / SaaS
  { category: "Tech & SaaS", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" },
  { category: "Tech & SaaS", url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80" },
  { category: "Tech & SaaS", url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80" },
  { category: "Tech & SaaS", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80" },
  { category: "Tech & SaaS", url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80" },

  // Coffee / Cafe
  { category: "Coffee & Food", url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" },
  { category: "Coffee & Food", url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" },
  { category: "Coffee & Food", url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80" },
  { category: "Coffee & Food", url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=600&q=80" },
  { category: "Coffee & Food", url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80" },

  // Portfolio / Agency
  { category: "Creative & Design", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" },
  { category: "Creative & Design", url: "https://images.unsplash.com/photo-1581291518655-9523c932ebcf?auto=format&fit=crop&w=600&q=80" },
  { category: "Creative & Design", url: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=600&q=80" },
  { category: "Creative & Design", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80" },
  { category: "Creative & Design", url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80" },

  // Wellness / Clinic
  { category: "Health & Wellness", url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" },
  { category: "Health & Wellness", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" },
  { category: "Health & Wellness", url: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80" },
  { category: "Health & Wellness", url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80" },
  { category: "Health & Wellness", url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80" },

  // Real Estate
  { category: "Real Estate", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
  { category: "Real Estate", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" },
  { category: "Real Estate", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" },
  { category: "Real Estate", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80" },
  { category: "Real Estate", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },

  // Fitness / Gym
  { category: "Fitness & Gym", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" },
  { category: "Fitness & Gym", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" },
  { category: "Fitness & Gym", url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80" },
  { category: "Fitness & Gym", url: "https://images.unsplash.com/photo-1571731956672-f2b94d7db0cb?auto=format&fit=crop&w=600&q=80" },
  { category: "Fitness & Gym", url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80" },

  // Dining
  { category: "Dining & Restaurant", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" },
  { category: "Dining & Restaurant", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" },
  { category: "Dining & Restaurant", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80" },
  { category: "Dining & Restaurant", url: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=600&q=80" },
  { category: "Dining & Restaurant", url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80" },

  // Education
  { category: "Education", url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80" },
  { category: "Education", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80" },
  { category: "Education", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80" },
  { category: "Education", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" },
  { category: "Education", url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80" },

  // Law / Corporate
  { category: "Law & Corporate", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80" },
  { category: "Law & Corporate", url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80" },
  { category: "Law & Corporate", url: "https://images.unsplash.com/photo-1505664194779-8bebcb95c557?auto=format&fit=crop&w=600&q=80" },
  { category: "Law & Corporate", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { category: "Law & Corporate", url: "https://images.unsplash.com/photo-1521791136368-1a9b7d89536b?auto=format&fit=crop&w=600&q=80" },

  // Abstract / Avatars
  { category: "Abstract & Avatars", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
  { category: "Abstract & Avatars", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
  { category: "Abstract & Avatars", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80" },
  { category: "Abstract & Avatars", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
  { category: "Abstract & Avatars", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" }
];
