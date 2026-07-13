# main.py - FastAPI Python Backend for Aleyo Builder AI
import os
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

app = FastAPI(title="Aleyo Builder AI API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECTS_DIR = os.path.join(os.path.dirname(__file__), "projects")
os.makedirs(PROJECTS_DIR, exist_ok=True)

# ----------------------------------------------------
# COMBINATORIC TEMPLATE ENGINE (500+ Unique Designs)
# ----------------------------------------------------

INDUSTRIES = {
    "saas": "Apex SaaS & Cloud",
    "coffee": "Artisanal Cafe & Roast",
    "portfolio": "Creative Designer Portfolio",
    "agency": "Vektor Digital Agency",
    "restaurant": "Osteria Italian Restaurant",
    "clinic": "Zenith Medical & Wellness",
    "realestate": "Horizon Luxury Properties",
    "fitness": "Iron Pulse Gym & Fitness",
    "education": "Scholar Online Academy",
    "law": "Justice & Partners Law Firm"
}

THEMES = [
    "royal", "neon", "forest", "sunset", "classic", "nordic",
    "sapphire", "lavender", "amber", "breeze", "sleek", "luxury", "autumn", "rose", "clean", "plum", "wave", "moss", "dune", "coffee",
    "solar", "orchid", "coral", "cobalt", "copper", "platinum", "emerald", "mint", "lilac", "velvet", "navy", "peach", "lemon", "electric", "olive",
    "bronze", "titanium", "sky", "raspberry", "mustard", "clay", "ocean", "grape", "banana", "pumpkin", "slate", "teal", "rosegold", "deepspace", "iceblue", "sage"
]
FONTS = ["outfit", "inter", "playfair", "space"]
VARIANTS = [0, 1, 2] # 3 layout structures per industry

# Copy templates database to generate hundreds of options dynamically
COPY_DB = {
    "saas": {
        "logo": ["Apex Cloud", "SaaSify", "CloudFlow"],
        "title": [
            "Scale your development pipelines instantly",
            "Next-generation analytics for modern product teams",
            "Automate devops workflows with machine intelligence"
        ],
        "subtitle": [
            "Apex delivers secure cluster orchestrations, real-time query metrics, and serverless database storage for scaling software systems.",
            "Consolidate team tracking, log error streams, and monitor active sessions inside a sleek, customizable dashboard.",
            "Maximize engineering velocities, reduce cloud computing overhead, and ship production code multiple times a day with confidence."
        ],
        "image": [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "coffee": {
        "logo": ["Aroma Cafe", "Daily Brew", "Espresso Lab"],
        "title": [
            "Ethically sourced, craft roasted specialty coffee",
            "Experience warm sanctuary and micro-batch espresso",
            "Fresh organic pastries and single-origin pour overs"
        ],
        "subtitle": [
            "We source organic Arabica beans directly from family farms in Colombia and Ethiopia, roasting in small batches to preserve fruit and chocolate profiles.",
            "A comfortable neighborhood corner with high-speed internet, friendly baristas, natural light, and freshly baked croissants served daily.",
            "Explore our masterfully balanced signature blends and weekly single-origin filter coffees brewed to precise thermal metrics."
        ],
        "image": [
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "portfolio": {
        "logo": ["Alex Rivera", "Rivera.Dev", "Alex.Designs"],
        "title": [
            "Designing digital experiences people love",
            "Interactive product designer & art director",
            "Bridging the gap between code and aesthetic beauty"
        ],
        "subtitle": [
            "I specialize in building modular UI design systems, high-fidelity prototypes, and conducting user interviews to solve complex software usability problems.",
            "Crafting premium dark-themed applications, typography scales, and fluid web animations for scaling tech startups.",
            "Providing digital consultancy services, usability reviews, and end-to-end user experience designs for mobile and web systems."
        ],
        "image": [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581291518655-9523c932ebcf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "agency": {
        "logo": ["Vektor Studio", "Vektor.Digital", "Vektor Creative"],
        "title": [
            "We engineer digital products that dominate markets",
            "Transforming brands through technical craftsmanship",
            "Growth marketing and full-stack software development"
        ],
        "subtitle": [
            "Vektor is an award-winning creative agency partnering with forward-thinking companies to build applications, design identities, and scale user bases.",
            "Our cross-functional teams of engineers, researchers, and copywriters deliver comprehensive growth campaigns and high-performance server architectures.",
            "Analyzing product funnels, running search engine optimizations, and coding responsive frontend UI structures tailored for rapid customer acquisition."
        ],
        "image": [
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "restaurant": {
        "logo": ["Osteria Bella", "Bella Italia", "Osteria Rustica"],
        "title": [
            "Hand-rolled fresh pasta and wood-fired pizza",
            "Authentic regional Italian cuisine in New York",
            "A warm candlelight lounge serving heritage wines"
        ],
        "subtitle": [
            "We source semolina flour, olive oil, and San Marzano tomatoes directly from Italian farms to prepare traditional regional recipes.",
            "Pizzas baked in our clay dome oven at 900°F for exactly 90 seconds, producing a perfectly charred, airy, and blistered crust.",
            "A hand-picked selection of vintage Chianti, Barolo, and Prosecco paired with fresh egg tagliatelle and white truffle shaving."
        ],
        "image": [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "clinic": {
        "logo": ["Zenith Health", "Zenith Clinic", "Zenith Wellness"],
        "title": [
            "Compassionate, advanced primary medical care",
            "State-of-the-art diagnostic screening and therapy",
            "Your family's partner in lifelong health and wellness"
        ],
        "subtitle": [
            "Our team of board-certified medical experts leverages advanced laboratory diagnostics to deliver tailored preventive screening programs.",
            "Offering rapid-result imaging, pediatric consultation, geriatric care, and physical therapy in a comfortable clinic setting.",
            "Manage your medical history easily, check in online to bypass waiting rooms, and consult with specialists via high-fidelity video."
        ],
        "image": [
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "realestate": {
        "logo": ["Horizon Realty", "Horizon Estates", "Horizon Luxury"],
        "title": [
            "Find your dream architectural home",
            "Exclusive listings of premium luxury properties",
            "Award-winning real estate brokerage and consultancy"
        ],
        "subtitle": [
            "Horizon is the market leader in premium residential real estate, representing modern villa designs, high-rise penthouses, and private estates.",
            "Our advisors deliver comprehensive neighborhood insights, accurate property evaluations, and guide you through secure investment workflows.",
            "Explore virtual walk-throughs, inspect structural blueprints, and schedule private tours of world-class architectural designs."
        ],
        "image": [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "fitness": {
        "logo": ["Iron Pulse", "Pulse Fitness", "Pulse Athletics"],
        "title": [
            "Unlock your maximum strength and potential",
            "High-intensity functional training and nutrition",
            "State-of-the-art strength training and athletic coaching"
        ],
        "subtitle": [
            "Iron Pulse combines Olympic lifting rigs, expert strength coaches, and recovery suites to help you achieve elite athletic performance.",
            "Join guided community circuits, track progress in our biometric app, and receive customized macronutrient meal planning.",
            "Spacious training floors, certified personal trainers, clean locker facilities, and a supportive atmosphere built for results."
        ],
        "image": [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "education": {
        "logo": ["Scholar Academy", "Scholar.Edu", "Scholar Online"],
        "title": [
            "Master in-demand creative and tech skills",
            "Interactive bootcamps taught by industry leaders",
            "Learn coding, design, and analytics at your pace"
        ],
        "subtitle": [
            "Scholar Academy provides structured learning tracks, code sandbox reviews, and 1-on-1 career mentoring to help you land technical roles.",
            "Gain access to 500+ lecture nodes, complete interactive portfolio assignments, and connect with a global student network.",
            "Accredited professional certificate tracks designed by engineering leads from top-tier digital product teams."
        ],
        "image": [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "law": {
        "logo": ["Justice & Co", "Justice Law", "Justice Attorneys"],
        "title": [
            "Protecting your business, assets, and rights",
            "Elite legal counsel for corporate and private sectors",
            "Dedicated advocates with a record of trial success"
        ],
        "subtitle": [
            "Justice Partners deliver strategic legal advice on corporate intellectual property rights, mergers and acquisitions, and commercial litigations.",
            "A collaborative network of specialized trial attorneys guiding you through regulatory changes and contract compliance scripts.",
            "Providing transparent billing structures, direct partner communication lines, and meticulous legal evidence preparation."
        ],
        "image": [
            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1453728148148-6032e5d9660c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
        ]
    }
}

# Generate list of 500 templates dynamically (10 industries * 6 themes * 4 fonts * 3 variants = 720 combinations!)
# Exposes a robust, interactively browsable library
def get_all_templates():
    templates = []
    tpl_count = 0
    
    for industry_key, industry_name in INDUSTRIES.items():
        for theme in THEMES:
            for font in FONTS:
                for var in VARIANTS:
                    tpl_count += 1
                    if tpl_count > 500:
                        # Cap at 500+ design presets
                        return templates
                        
                    tpl_id = f"tpl_{industry_key}_{theme}_{font}_{var}"
                    name = f"{COPY_DB[industry_key]['logo'][var]} - {theme.capitalize()} {font.capitalize()} Edition"
                    description = f"A premium, responsive {industry_name} landing page styled using the {theme.capitalize()} color theme and {font.capitalize()} font."
                    
                    templates.append({
                        "id": tpl_id,
                        "name": name,
                        "description": description,
                        "industry": industry_key,
                        "theme": theme,
                        "font": font,
                        "variant": var
                    })
    return templates

TEMPLATES_LIST = get_all_templates()

## Helper to compile context-aware section mock data matching the selected industry
def get_industry_section_data(industry: str, section_type: str, logo: str, var: int = 0) -> Dict[str, Any]:
    db = COPY_DB.get(industry, COPY_DB["saas"])
    logo_val = logo or db["logo"][0]
    
    # 1. HEADER
    if section_type == "header":
        return {
            "logo": logo_val,
            "link1": "Features",
            "link2": "Gallery",
            "link3": "Testimonials",
            "link4": "Contact",
            "ctaText": "Get Started"
        }
        
    # 2. HERO
    elif section_type == "hero":
        title = db["title"][var % len(db["title"])]
        subtitle = db["subtitle"][var % len(db["subtitle"])]
        image = db["image"][var % len(db["image"])]
        return {
            "title": title,
            "subtitle": subtitle,
            "cta1": "Start Free Trial" if industry == "saas" else "Contact Us",
            "cta2": "Learn More",
            "image": image
        }
        
    # 3. FEATURES
    elif section_type == "features":
        if industry == "coffee":
            cards = [
                {"icon": "☕", "title": "Fresh Roast", "desc": "Small-batch roasted coffee beans sourced from single-origin organic estates."},
                {"icon": "🥐", "title": "In-house Baking", "desc": "Sweet pastries, sourdough breads, and cookies baked fresh every morning."},
                {"icon": "✨", "title": "Cozy Ambience", "desc": "Comfortable seating, high-speed Wi-Fi, and natural light perfect for work or reading."}
            ]
        elif industry == "fitness":
            cards = [
                {"icon": "💪", "title": "Elite Training", "desc": "Certified professional coaches and personalized workout plans."},
                {"icon": "🏋️", "title": "Modern Equipment", "desc": "Premium strength rigs, cardio zones, and group studio classes."},
                {"icon": "🥗", "title": "Nutrition Plans", "desc": "Customized diet mappers and body composition monitoring reviews."}
            ]
        elif industry == "portfolio":
            cards = [
                {"icon": "🎨", "title": "UI/UX Design", "desc": "Sleek wireframing, interactive prototyping, and design systems."},
                {"icon": "💻", "title": "Frontend Dev", "desc": "Responsive web apps compiled with modern frameworks like React."},
                {"icon": "📈", "title": "Consultancy", "desc": "Aesthetic optimization reviews to maximize conversion rates."}
            ]
        elif industry == "restaurant":
            cards = [
                {"icon": "🍝", "title": "Handmade Pasta", "desc": "Fresh semolina egg pasta rolled and cut daily by our master chefs."},
                {"icon": "🔥", "title": "Wood-fired Oven", "desc": "Authentic pizzas baked at 900°F producing an airy, blistered crust."},
                {"icon": "🍷", "title": "Heritage Wines", "desc": "Curated pairing list featuring vintage Chianti, Barolo, and Prosecco."}
            ]
        elif industry == "clinic":
            cards = [
                {"icon": "🩺", "title": "Expert Doctors", "desc": "Licensed medical practitioners with decades of clinical experience."},
                {"icon": "🏥", "title": "Modern Clinic", "desc": "Clean environment equipped with next-gen diagnostics tools."},
                {"icon": "🧘", "title": "Holistic Healing", "desc": "Integrative therapies balancing wellness, recovery, and fitness."}
            ]
        elif industry == "realestate":
            cards = [
                {"icon": "📍", "title": "Premium Locations", "desc": "Villas and apartments situated in highly-rated development zones."},
                {"icon": "🏛️", "title": "Modern Architecture", "desc": "Open spaces, floor-to-ceiling glass, and luxurious finishes."},
                {"icon": "🛡️", "title": "Secure Investment", "desc": "Verified properties ensuring solid capital appreciation over time."}
            ]
        elif industry == "education":
            cards = [
                {"icon": "🎓", "title": "Certified Courses", "desc": "Structured syllabi mapped to in-demand technical fields."},
                {"icon": "👩‍🏫", "title": "Expert Mentors", "desc": "1-on-1 reviews and direct assistance from industry leaders."},
                {"icon": "💼", "title": "Career Support", "desc": "Resume reviews and recruiter networks to land high-paying roles."}
            ]
        elif industry == "law":
            cards = [
                {"icon": "⚖️", "title": "Justice Focused", "desc": "Elite legal advocates protecting your corporate assets and rights."},
                {"icon": "📂", "title": "Trial Prepared", "desc": "Meticulous documentation and evidence construction for success."},
                {"icon": "🤝", "title": "Clear Counsel", "desc": "Direct partner communication lines and transparent pricing schedules."}
            ]
        elif industry == "agency":
            cards = [
                {"icon": "🚀", "title": "Full Stack Dev", "desc": "Custom web apps built with maintainable systems architectures."},
                {"icon": "💡", "title": "Brand Design", "desc": "Unique identities, copywriting lines, and marketing mockups."},
                {"icon": "📈", "title": "SEO & Growth", "desc": "Optimizing search listings and funnel conversions to scale user bases."}
            ]
        else: # saas
            cards = [
                {"icon": "⚡", "title": "Peak Velocity", "desc": "Deploy serverless instances and monitor queries instantly."},
                {"icon": "📊", "title": "Real-time Metrics", "desc": "Sleek charts plotting errors, active sessions, and database traffic."},
                {"icon": "🔒", "title": "Endless Scale", "desc": "Multi-tenant clusters secure user records across global clouds."}
            ]
        return {
            "title": "Core Features" if industry != "coffee" else "Our Craft",
            "subtitle": "Discover the values that define our quality standards.",
            "cards": cards
        }
        
    # 4. GALLERY
    elif section_type == "gallery":
        if industry == "coffee":
            items = [
                {"title": "Perfect Latte Art", "desc": "Pouring steamed microfoam.", "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"},
                {"title": "In-house Bakery", "desc": "Fresh croissants baked daily.", "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"},
                {"title": "Pour Over Brew", "desc": "Single-origin filter selections.", "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "fitness":
            items = [
                {"title": "Strength Deck", "desc": "Heavy barbell training racks.", "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"},
                {"title": "Cardio Hub", "desc": "Treadmills and rowing systems.", "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"},
                {"title": "Group Yoga", "desc": "Flexible meditation classes.", "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "portfolio":
            items = [
                {"title": "Mobile App UI", "desc": "Interactive layout prototypes.", "image": "https://images.unsplash.com/photo-1581291518655-9523c932ebcf?auto=format&fit=crop&w=600&q=80"},
                {"title": "Brand Guidelines", "desc": "Color styles and logo guides.", "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"},
                {"title": "SaaS Platform", "desc": "Complete frontend build assets.", "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "restaurant":
            items = [
                {"title": "Margerita Pizza", "desc": "Mozzarella and fresh basil.", "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"},
                {"title": "Handmade Pasta", "desc": "Traditional egg tagliatelle.", "image": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80"},
                {"title": "Cozy Candlelight", "desc": "Perfect dining experience.", "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "clinic":
            items = [
                {"title": "Dental Studio", "desc": "Modern teeth cleaning rigs.", "image": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"},
                {"title": "Consultation", "desc": "1-on-1 health mappers.", "image": "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80"},
                {"title": "Therapy Room", "desc": "Quiet physical healing space.", "image": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "realestate":
            items = [
                {"title": "Horizon Penthouse", "desc": "Panoramic city views.", "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"},
                {"title": "Sunset Villa", "desc": "Infinite pool and modern lines.", "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"},
                {"title": "Interior Design", "desc": "Premium lounge decor.", "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "education":
            items = [
                {"title": "Online Syllabus", "desc": "Interactive lessons log.", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"},
                {"title": "Campus Library", "desc": "Quiet spaces for learning.", "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80"},
                {"title": "Study Group", "desc": "Collaborative project reviews.", "image": "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "law":
            items = [
                {"title": "Elite Counsel", "desc": "Litigation and planning.", "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"},
                {"title": "Case Mappings", "desc": "Rigorous research prep.", "image": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"},
                {"title": "Corporate Mergers", "desc": "Secure transaction records.", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"}
            ]
        elif industry == "agency":
            items = [
                {"title": "Campaign Launch", "desc": "Aesthetic strategy layout.", "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"},
                {"title": "Development", "desc": "Clean structured react app.", "image": "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80"},
                {"title": "Logo Mockup", "desc": "High-fidelity vectors maps.", "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"}
            ]
        else: # saas
            items = [
                {"title": "Analytics Hub", "desc": "Query metrics charts.", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"},
                {"title": "Cluster Config", "desc": "Server status logs.", "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"},
                {"title": "User Dashboard", "desc": "Account billing controls.", "image": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"}
            ]
        return {
            "title": "Showcase Gallery" if industry != "coffee" else "Our Bar",
            "subtitle": "Take a visual glance at our premium productions.",
            "items": items
        }
        
    # 5. TESTIMONIALS
    elif section_type == "testimonials":
        if industry == "coffee":
            testimonials = [
                {"quote": "Hands down the best cold brew in town. The staff is always welcoming and friendly!", "name": "Emily Watson", "role": "Regular Customer", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"},
                {"quote": "The atmosphere is perfect for remote work. Fast internet, cozy seating, and excellent roasts.", "name": "Leo Martinez", "role": "Software Developer", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "fitness":
            testimonials = [
                {"quote": "Lost 15 lbs in my first two months. The coaches are extremely supportive and knowledgeable!", "name": "Marcus Finch", "role": "Club Member", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Top-tier equipment and a very clean space. I love the group boxing classes on weekends.", "name": "Rebecca Lopez", "role": "Fitness enthusiast", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "portfolio":
            testimonials = [
                {"quote": "An absolute professional. Handled our complete application redesign with clean modular systems.", "name": "Julia Vance", "role": "Product Lead, Apex", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Stunning aesthetics and fast turnaround times. Helped double our user signups.", "name": "Arthur Pendelton", "role": "Startup founder", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "restaurant":
            testimonials = [
                {"quote": "The handmade egg tagliatelle with truffle was spectacular. Highly recommend the candlelit lounge.", "name": "Gemma Di Rosa", "role": "Food Critic", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Authentic wood-fired pizzas just like Napoli. Friendly service and incredible vintage wines.", "name": "Fabio Moretti", "role": "Naples Native", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "clinic":
            testimonials = [
                {"quote": "The doctors were thorough and gentle. Very clean facilities and comfortable waiting lounge.", "name": "Clara Higgins", "role": "Patient", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Exceptional dental treatment. They resolved my wisdom tooth pain instantly.", "name": "Neil Armstrong", "role": "Wellness consultant", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "realestate":
            testimonials = [
                {"quote": "Guided us through buying our first sunset penthouse. Meticulous service and documentation.", "name": "Daniel Craig", "role": "Home Buyer", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Incredible investment returns. The property value appreciated by 20% in one year.", "name": "Victoria Beckham", "role": "Investor", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "education":
            testimonials = [
                {"quote": "The course maps was clear and easy to follow. Helped me secure an engineering job.", "name": "Lucas Boyd", "role": "Software Graduate", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Invaluable 1-on-1 coding reviews. Exceeded my high expectations early.", "name": "Naomi Watts", "role": "UI design student", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "law":
            testimonials = [
                {"quote": "Represented our SaaS company during a complex copyright trial. Exceptional litigation preparation.", "name": "Robert Downey", "role": "CEO, Vektor Tech", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Reliable commercial contract drafting. Clear billing and straight partner consultations.", "name": "Gwyneth Paltrow", "role": "Corporate Counsel", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"}
            ]
        elif industry == "agency":
            testimonials = [
                {"quote": "Vektor designed our complete mobile identity and double our conversion rates. Elite studio.", "name": "Jon Favreau", "role": "Director, Cloudflow", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"},
                {"quote": "Professional system engineers and copywriters. Delivered our cluster configs early.", "name": "Scarlett Johansson", "role": "VP, SaaSify", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"}
            ]
        else: # saas
            testimonials = [
                {"quote": f"The development team at {logo_val} was outstanding. They wrote robust, maintainable clusters and kept us secure.", "name": "Sarah Jenkins", "role": "CTO, CloudScale", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"},
                {"quote": f"Working with {logo_val} transformed our conversions. We went from manual logs to full serverless databases.", "name": "David Kim", "role": "Director, FinTech.io", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"}
            ]
        return {
            "title": "Client Feedback" if industry != "coffee" else "Reviews",
            "subtitle": "Read reviews directly from our client portfolio.",
            "cards": testimonials
        }
        
    # 6. CONTACT
    elif section_type == "contact":
        details = {
            "coffee": {"email": f"brew@{logo_val.lower().replace(' ', '')}.com", "phone": "+1 (555) 345-0987", "address": "402 Espresso Way, Seattle, WA"},
            "fitness": {"email": f"train@{logo_val.lower().replace(' ', '')}.com", "phone": "+1 (555) 789-2345", "address": "88 Iron Pulse Rd, Denver, CO"},
            "portfolio": {"email": f"alex@{logo_val.lower().replace(' ', '')}.dev", "phone": "+1 (555) 678-1234", "address": "San Francisco, CA"},
            "restaurant": {"email": f"reservations@{logo_val.lower().replace(' ', '')}.it", "phone": "+1 (555) 987-6543", "address": "12 Ristorante Blvd, New York, NY"},
            "clinic": {"email": f"wellness@{logo_val.lower().replace(' ', '')}.org", "phone": "+1 (555) 456-7890", "address": "704 Health Dr, San Diego, CA"},
            "realestate": {"email": f"villas@{logo_val.lower().replace(' ', '')}.com", "phone": "+1 (555) 234-5678", "address": "90 Ocean Front Drive, Miami, FL"},
            "education": {"email": f"admissions@{logo_val.lower().replace(' ', '')}.edu", "phone": "+1 (555) 890-1234", "address": "120 Scholar Campus, Boston, MA"},
            "law": {"email": f"counsel@{logo_val.lower().replace(' ', '')}.com", "phone": "+1 (555) 901-2345", "address": "500 Court Street, Washington, DC"},
            "agency": {"email": f"hello@{logo_val.lower().replace(' ', '')}.agency", "phone": "+1 (555) 019-3388", "address": "120 Pine Street, San Francisco, CA"},
            "saas": {"email": f"support@{logo_val.lower().replace(' ', '')}.io", "phone": "+1 (555) 120-4567", "address": "88 Cloud Serverless Ln, Austin, TX"}
        }
        info = details.get(industry, details["saas"])
        return {
            "title": "Get in Touch" if industry != "coffee" else "Find Our Shop",
            "subtitle": "Send a message and our strategist will reach out." if industry != "coffee" else "Stop by for a fresh cup or contact us for catering inquiries.",
            "email": info["email"],
            "phone": info["phone"],
            "address": info["address"]
        }
        
    # 7. FOOTER
    elif section_type == "footer":
        return {
            "copyright": f"© 2026 {logo_val}. Built with Aleyo Builder AI.",
            "link1": "Privacy Policy",
            "link2": "Terms of Service"
        }
        
    # 8. CUSTOM CODE
    elif section_type == "code":
        return {
            "code": """<div class="custom-widget-container" style="text-align: center; padding: 45px 30px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--border-radius); max-width: 500px; margin: 0 auto; box-shadow: 0 8px 30px rgba(0,0,0,0.2);">
  <h3 style="margin-bottom: 8px;">Interactive Counter Feature</h3>
  <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">This is a fully custom interactive HTML, CSS, and JS component.</p>
  <div id="counter-value" style="font-size: 3.5rem; font-weight: 800; margin: 15px 0; color: var(--primary-color); transition: transform 0.1s;">0</div>
  <button id="counter-btn" class="btn btn-primary" style="padding: 10px 24px; cursor: pointer;">Increment Counter</button>
</div>
<script>
  (function() {
    const valEl = document.getElementById('counter-value');
    const btnEl = document.getElementById('counter-btn');
    if (valEl && btnEl) {
      let count = 0;
      btnEl.addEventListener('click', () => {
        count++;
        valEl.textContent = count;
        valEl.style.transform = 'scale(1.2)';
        setTimeout(() => { valEl.style.transform = 'scale(1)'; }, 100);
      });
    }
  })();
</script>"""
        }
    return {}

# Helper to build the project JSON
def generate_project_json(industry: str, theme: str, font: str, var: int) -> Dict[str, Any]:
    db = COPY_DB.get(industry, COPY_DB["saas"])
    logo = db["logo"][var % len(db["logo"])]
    
    return {
        "projectName": f"{logo} Portal",
        "theme": theme,
        "font": font,
        "industry": industry,
        "sections": [
            {
                "id": "header_api",
                "type": "header",
                "data": get_industry_section_data(industry, "header", logo, var)
            },
            {
                "id": "hero_api",
                "type": "hero",
                "data": get_industry_section_data(industry, "hero", logo, var)
            },
            {
                "id": "features_api",
                "type": "features",
                "data": get_industry_section_data(industry, "features", logo, var)
            },
            {
                "id": "gallery_api",
                "type": "gallery",
                "data": get_industry_section_data(industry, "gallery", logo, var)
            },
            {
                "id": "testimonials_api",
                "type": "testimonials",
                "data": get_industry_section_data(industry, "testimonials", logo, var)
            },
            {
                "id": "contact_api",
                "type": "contact",
                "data": get_industry_section_data(industry, "contact", logo, var)
            },
            {
                "id": "footer_api",
                "type": "footer",
                "data": get_industry_section_data(industry, "footer", logo, var)
            }
        ]
    }

# ----------------------------------------------------
# API ENDPOINTS
# ----------------------------------------------------

class PromptRequest(BaseModel):
    prompt: str

class ProjectData(BaseModel):
    projectName: str
    theme: str
    font: str
    sections: List[Dict[str, Any]]
    industry: Optional[str] = "saas"

class ChatMessage(BaseModel):
    message: str
    currentState: Dict[str, Any]

@app.post("/api/agent/chat")
def agent_chat(chat: ChatMessage):
    message = chat.message.strip().lower()
    state = chat.currentState
    
    projectName = state.get("projectName", "Untitled Project")
    theme = state.get("theme", "royal")
    font = state.get("font", "outfit")
    sections = state.get("sections", [])
    industry = state.get("industry", "saas")
    
    reply = "I'm not sure how to handle that request. You can ask me to change themes, fonts, add sections, update titles, or generate a website."
    
    # 0. DIRECT FILE SYSTEM EXPORT COMMAND
    if "write as" in message or "export as" in message or "compile as" in message or "save as" in message:
        fmt = "html"
        if "react" in message: fmt = "react"
        elif "nextjs" in message or "next.js" in message or "next js" in message: fmt = "nextjs"
        elif "fastapi" in message or "python" in message: fmt = "fastapi"
        elif "php" in message: fmt = "php"
        
        import re
        # Find absolute folder path in user's prompt (e.g. C:/path/to/folder or relative path)
        path_match = re.search(r'(?:to|in|at)\s+([a-zA-Z]:[\\/][^,\n]+|[\\/][^,\n]+|\w+[\w\-./\\]*)', chat.message)
        extracted_path = None
        if path_match:
            extracted_path = path_match.group(1).strip()
            
        if extracted_path:
            try:
                abs_path = os.path.abspath(extracted_path)
                os.makedirs(abs_path, exist_ok=True)
                compiled_files = compile_project_files(projectName, theme, font, sections, fmt)
                for rel_path, content in compiled_files.items():
                    full_path = os.path.join(abs_path, rel_path)
                    os.makedirs(os.path.dirname(full_path), exist_ok=True)
                    with open(full_path, "w", encoding="utf-8") as f:
                        f.write(content)
                reply = f"I have successfully compiled your website into a **{fmt.upper()}** project structure and written all files to your local drive path: `{abs_path}`!<br/><br/>**Generated files:**<br/>" + "<br/>".join([f"- <code>{f}</code>" for f in compiled_files.keys()])
            except Exception as e:
                reply = f"I attempted to write the codebase locally but encountered a disk access error: {str(e)}"
        else:
            reply = "I couldn't extract the destination folder path from your message. Please formulate it like: *'write as react to C:/Users/user/Documents/my-site'*."
            
    # 1. SITE GENERATION COMMAND
    if "generate" in message or "create" in message:
        # Match industry keywords
        selected_ind = "agency"
        if any(k in message for k in ["saas", "software", "cloud", "app", "dashboard"]):
            selected_ind = "saas"
        elif any(k in message for k in ["coffee", "cafe", "espresso", "barista"]):
            selected_ind = "coffee"
        elif any(k in message for k in ["portfolio", "designer", "developer", "resume", "alex"]):
            selected_ind = "portfolio"
        elif any(k in message for k in ["italian", "pizza", "pasta", "restaurant", "dining", "menu"]):
            selected_ind = "restaurant"
        elif any(k in message for k in ["clinic", "medical", "doctor", "health", "dentist", "wellness"]):
            selected_ind = "clinic"
        elif any(k in message for k in ["real estate", "house", "properties", "villa", "penthouse"]):
            selected_ind = "realestate"
        elif any(k in message for k in ["gym", "fitness", "workout", "lifting", "athletic"]):
            selected_ind = "fitness"
        elif any(k in message for k in ["school", "education", "academy", "scholar", "online course"]):
            selected_ind = "education"
        elif any(k in message for k in ["lawyer", "law firm", "advocate", "attorney", "justice"]):
            selected_ind = "law"
            
        import random
        theme = random.choice(THEMES)
        font = random.choice(FONTS)
        variant = random.choice(VARIANTS)
        
        new_project = generate_project_json(selected_ind, theme, font, variant)
        projectName = new_project["projectName"]
        sections = new_project["sections"]
        industry = selected_ind
        reply = f"I've generated a brand new {INDUSTRIES[selected_ind]} website for you! I selected the {theme.capitalize()} theme and the {font.capitalize()} font."
        
    # 2. CHANGE THEME COMMAND
    elif "theme" in message:
        # Extract theme name
        matched_theme = None
        all_theme_names = {
            "royal indigo": "royal", "royal": "royal",
            "cyber neon": "neon", "neon": "neon",
            "emerald forest": "forest", "forest": "forest",
            "crimson sunset": "sunset", "sunset": "sunset",
            "minimalist light": "classic", "classic": "classic", "light": "classic",
            "nordic frost": "nordic", "nordic": "nordic",
            "midnight sapphire": "sapphire", "sapphire": "sapphire",
            "lavender bloom": "lavender", "lavender": "lavender",
            "sunset amber": "amber", "amber": "amber",
            "ocean breeze": "breeze", "breeze": "breeze",
            "charcoal sleek": "sleek", "sleek": "sleek",
            "gold luxury": "luxury", "luxury": "luxury", "gold": "luxury",
            "autumn leaf": "autumn", "autumn": "autumn",
            "rose quartz": "rose", "rose": "rose",
            "slate clean": "clean", "clean": "clean",
            "plum dream": "plum", "plum": "plum",
            "teal wave": "wave", "wave": "wave",
            "forest moss": "moss", "moss": "moss",
            "sand dune": "dune", "dune": "dune",
            "coffee warmth": "coffee", "coffee": "coffee",
            "solar flare": "solar", "solar": "solar",
            "orchid mist": "orchid", "orchid": "orchid",
            "coral reef": "coral", "coral": "coral",
            "cobalt power": "cobalt", "cobalt": "cobalt",
            "copper vintage": "copper", "copper": "copper",
            "platinum premium": "platinum", "platinum": "platinum",
            "emerald shine": "emerald", "emerald": "emerald",
            "mint fresh": "mint", "mint": "mint",
            "lilac whisper": "lilac", "lilac": "lilac",
            "burgundy velvet": "velvet", "velvet": "velvet",
            "navy trust": "navy", "navy": "navy",
            "peach soft": "peach", "peach": "peach",
            "lemon sherbet": "lemon", "lemon": "lemon",
            "electric violet": "electric", "electric": "electric",
            "olive grove": "olive", "olive": "olive",
            "bronze shield": "bronze", "bronze": "bronze",
            "titanium industrial": "titanium", "titanium": "titanium",
            "sky blue": "sky", "sky": "sky",
            "raspberry sweet": "raspberry", "raspberry": "raspberry",
            "mustard bold": "mustard", "mustard": "mustard",
            "clay earth": "clay", "clay": "clay",
            "indigo ocean": "ocean", "ocean": "ocean",
            "grape fusion": "grape", "grape": "grape",
            "banana pastel": "banana", "banana": "banana",
            "pumpkin spice": "pumpkin", "pumpkin": "pumpkin",
            "slate blue": "slate", "slate": "slate",
            "teal green": "teal", "teal": "teal",
            "rose gold": "rosegold", "rose gold elegant": "rosegold", "rosegold": "rosegold",
            "deep space": "deepspace", "deep space dark": "deepspace", "deepspace": "deepspace",
            "ice blue": "iceblue", "ice blue frost": "iceblue", "iceblue": "iceblue",
            "sage calm": "sage", "sage": "sage"
        }
        for name, key in all_theme_names.items():
            if name in message:
                matched_theme = key
                break
        
        if matched_theme:
            theme = matched_theme
            reply = f"I've updated the website color theme to **{theme.capitalize()}**."
        else:
            reply = f"I couldn't find that theme. You can select from one of our 50+ themes, such as *Midnight Sapphire*, *Rose Gold*, *Lavender Bloom*, or *Emerald Forest*."

    # 3. SET FONT COMMAND
    elif "font" in message:
        matched_font = None
        all_fonts = {"outfit": "outfit", "inter": "inter", "playfair": "playfair", "space": "space", "space grotesk": "space"}
        for name, key in all_fonts.items():
            if name in message:
                matched_font = key
                break
        if matched_font:
            font = matched_font
            reply = f"I've updated the website typography font to **{font.capitalize()}**."
        else:
            reply = "I couldn't find that font. Supported fonts are: *Outfit*, *Inter*, *Playfair Display*, and *Space Grotesk*."

    # 4. ADD SECTION COMMAND
    elif "add" in message or "append" in message:
        section_type = None
        if "header" in message: section_type = "header"
        elif "hero" in message: section_type = "hero"
        elif "feature" in message: section_type = "features"
        elif "gallery" in message or "portfolio" in message: section_type = "gallery"
        elif "testimonial" in message or "review" in message: section_type = "testimonials"
        elif "contact" in message or "form" in message: section_type = "contact"
        elif "footer" in message: section_type = "footer"
        
        if section_type:
            import time
            new_id = f"{section_type}_{int(time.time())}"
            industry_context = state.get("industry", "saas")
            theme_defaults = get_industry_section_data(industry_context, section_type, projectName.split(' ')[0], 0)
            sections.append({"id": new_id, "type": section_type, "data": theme_defaults})
            reply = f"I've appended a new **{section_type.capitalize()}** section to your website layout."
        else:
            reply = "I couldn't identify which section to add. Try asking me to *'add a contact section'* or *'append testimonials'*."

    # 5. REMOVE SECTION COMMAND
    elif "delete" in message or "remove" in message:
        section_type = None
        if "header" in message: section_type = "header"
        elif "hero" in message: section_type = "hero"
        elif "feature" in message: section_type = "features"
        elif "gallery" in message or "portfolio" in message: section_type = "gallery"
        elif "testimonial" in message or "review" in message: section_type = "testimonials"
        elif "contact" in message or "form" in message: section_type = "contact"
        elif "footer" in message: section_type = "footer"
        
        if section_type:
            target_idx = next((i for i, s in enumerate(sections) if s["type"] == section_type), None)
            if target_idx is not None:
                sections.pop(target_idx)
                reply = f"I've removed the **{section_type.capitalize()}** section from your layout."
            else:
                reply = f"I couldn't find a {section_type.capitalize()} section in your current layout to remove."
        else:
            reply = "Which section would you like to delete? E.g., *'remove contact section'*."

    # 6. UPDATE SECTION TEXT FIELD
    elif "update" in message or "change" in message or "set" in message:
        if "hero title" in message or "title in hero" in message or "heading in hero" in message:
            new_title = message.split("to")[-1].strip().replace("'", "").replace('"', '')
            hero = next((s for s in sections if s["type"] == "hero"), None)
            if hero:
                hero["data"]["title"] = new_title
                reply = f"I've updated the hero title to **'{new_title}'**."
            else:
                reply = "I couldn't find a Hero section in the current layout to update."
        elif "logo" in message:
            new_logo = message.split("to")[-1].strip().replace("'", "").replace('"', '')
            header = next((s for s in sections if s["type"] == "header"), None)
            if header:
                header["data"]["logo"] = new_logo
                reply = f"I've set the website logo text to **'{new_logo}'**."
            else:
                reply = "I couldn't find a Header section to apply that logo text."
        else:
            reply = "I couldn't parse the update target. Try asking me like: *'change hero title to [Your Title]'* or *'set logo to [Brand Name]'*."

    # 7. UPDATE SECTION STYLE VARIANT
    elif "style" in message or "layout" in message:
        target_section = None
        if "header" in message: target_section = "header"
        elif "hero" in message: target_section = "hero"
        elif "feature" in message: target_section = "features"
        elif "gallery" in message or "portfolio" in message: target_section = "gallery"
        elif "testimonial" in message or "review" in message: target_section = "testimonials"
        elif "contact" in message or "form" in message: target_section = "contact"
        elif "footer" in message: target_section = "footer"
        
        target_style = None
        if "minimal" in message or "clean" in message: target_style = "minimal"
        elif "split" in message or "balance" in message: target_style = "split"
        elif "glass" in message or "depth" in message: target_style = "glass"
        elif "gradient" in message or "glow" in message: target_style = "gradient"
        elif "card" in message or "compact" in message: target_style = "card"
        elif "carousel" in message or "slider" in message or "slide" in message: target_style = "carousel"
        
        if target_section and target_style:
            updated = False
            for s in sections:
                if s["type"] == target_section:
                    s["styleVariant"] = target_style
                    updated = True
            if updated:
                reply = f"I've updated the **{target_section.capitalize()}** section layout style to **{target_style.capitalize()}**."
            else:
                reply = f"I couldn't find a {target_section.capitalize()} section in the current layout to apply that style variation."
        else:
            reply = "I couldn't identify the section or layout style from your request. Try asking like: *'make hero style glass'* or *'set features style to minimal'*."

    return {
        "reply": reply,
        "updatedState": {
            "projectName": projectName,
            "theme": theme,
            "font": font,
            "sections": sections,
            "industry": industry
        }
    }

@app.get("/api/templates")
def read_templates():
    """Return the collection of 500 dynamic design presets"""
    return TEMPLATES_LIST

@app.get("/api/template/{template_id}")
def read_template(template_id: str):
    """Retrieve full project schema for a template ID"""
    tpl = next((t for t in TEMPLATES_LIST if t["id"] == template_id), None)
    if not tpl:
        raise HTTPException(status_code=404, detail="Template not found")
    return generate_project_json(tpl["industry"], tpl["theme"], tpl["font"], tpl["variant"])
class AIGenerateRequest(BaseModel):
    prompt: str
    industry: str
    theme: str
    font: str
    sections: List[str]

@app.post("/api/agent/generate")
def ai_agent_generate(req: AIGenerateRequest):
    # Match brand name or details from prompt
    brand_name = "Zenith"
    words = [w for w in req.prompt.split(' ') if w.istitle()]
    if words:
        brand_name = "".join(c for c in words[0] if c.isalnum())
    else:
        # Fallback to copy db defaults
        db = COPY_DB.get(req.industry, COPY_DB["saas"])
        import random
        brand_name = random.choice(db["logo"])
        
    compiled_sections = []
    import time
    for idx, sec_type in enumerate(req.sections):
        new_id = f"{sec_type}_{int(time.time()) + idx}"
        section_data = get_industry_section_data(req.industry, sec_type, brand_name, idx)
        compiled_sections.append({
            "id": new_id,
            "type": sec_type,
            "data": section_data,
            "styleVariant": "split" if sec_type in ["header", "footer"] else "carousel" if sec_type == "gallery" else "card"
        })
        
    return {
        "projectName": f"{brand_name} AI Hub",
        "theme": req.theme,
        "font": req.font,
        "sections": compiled_sections,
        "industry": req.industry
    }

@app.post("/api/generate")
def generate_from_prompt(request: PromptRequest):
    """Matches prompt keywords to select a beautiful dynamic theme & structure combination"""
    prompt = request.prompt.lower()
    
    # Keyword classifier
    selected_ind = "agency"
    if any(k in prompt for k in ["saas", "software", "cloud", "app", "dashboard"]):
        selected_ind = "saas"
    elif any(k in prompt for k in ["coffee", "cafe", "espresso", "barista"]):
        selected_ind = "coffee"
    elif any(k in prompt for k in ["portfolio", "designer", "developer", "resume", "alex"]):
        selected_ind = "portfolio"
    elif any(k in prompt for k in ["italian", "pizza", "pasta", "restaurant", "dining", "menu"]):
        selected_ind = "restaurant"
    elif any(k in prompt for k in ["clinic", "medical", "doctor", "health", "dentist", "wellness"]):
        selected_ind = "clinic"
    elif any(k in prompt for k in ["real estate", "house", "properties", "villa", "penthouse"]):
        selected_ind = "realestate"
    elif any(k in prompt for k in ["gym", "fitness", "workout", "lifting", "athletic"]):
        selected_ind = "fitness"
    elif any(k in prompt for k in ["school", "education", "academy", "scholar", "online course"]):
        selected_ind = "education"
    elif any(k in prompt for k in ["lawyer", "law firm", "advocate", "attorney", "justice"]):
        selected_ind = "law"

    # Select random variant details to keep prompts feeling unique
    import random
    theme = random.choice(THEMES)
    font = random.choice(FONTS)
    variant = random.choice(VARIANTS)
    
    return generate_project_json(selected_ind, theme, font, variant)

@app.post("/api/save")
def save_project(project: ProjectData):
    """Saves a project model to local server disk"""
    safe_name = "".join(c for c in project.projectName if c.isalnum() or c in (' ', '_', '-')).strip()
    if not safe_name:
        safe_name = "Untitled_Project"
    
    filename = f"{safe_name}.json"
    filepath = os.path.join(PROJECTS_DIR, filename)
    
    save_data = {
        "projectName": project.projectName,
        "theme": project.theme,
        "font": project.font,
        "sections": project.sections,
        "industry": project.industry or "saas",
        "updatedAt": request_time_iso()
    }
    
    with open(filepath, "w") as f:
        json.dump(save_data, f, indent=2)
        
    return {"status": "success", "filename": filename}

@app.get("/api/projects")
def list_projects():
    """Returns list of files stored in projects/ folder"""
    projects = []
    for filename in os.listdir(PROJECTS_DIR):
        if filename.endswith(".json"):
            filepath = os.path.join(PROJECTS_DIR, filename)
            try:
                with open(filepath, "r") as f:
                    data = json.load(f)
                    projects.append({
                        "projectName": data.get("projectName", filename[:-5]),
                        "theme": data.get("theme", "royal"),
                        "font": data.get("font", "outfit"),
                        "industry": data.get("industry", "saas"),
                        "updatedAt": data.get("updatedAt", "2026-07-12T00:00:00Z"),
                        "filename": filename
                    })
            except Exception:
                continue
    return sorted(projects, key=lambda x: x["updatedAt"], reverse=True)

@app.get("/api/load/{filename}")
def load_project(filename: str):
    """Loads a project from file stream"""
    filepath = os.path.join(PROJECTS_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Project not found")
        
    with open(filepath, "r") as f:
        return json.load(f)

@app.get("/api/default-section")
def get_default_section(type: str, industry: str):
    """Returns a context-aware default section schema for the specified industry and type"""
    import time
    new_id = f"{type}_{int(time.time())}"
    section_data = get_industry_section_data(industry, type, "Brand", 0)
    return {
        "id": new_id,
        "type": type,
        "data": section_data
    }

@app.delete("/api/projects/{filename}")
# ----------------------------------------------------
# MULTI-LANGUAGE CODEBASE GENERATOR ENGINE
# ----------------------------------------------------

def get_preview_css() -> str:
    """Reads the static CSS layout template file"""
    css_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "preview-styles.css"))
    if os.path.exists(css_path):
        try:
            with open(css_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception:
            pass
    # Fallback basic styles if public file is not found
    return "/* preview-styles.css fallback */"

def compile_sections_to_html(sections: List[Dict]) -> str:
    """Assembles all sections into raw HTML strings"""
    html = ""
    for section in sections:
        id = section.get("id", "section")
        type = section.get("type")
        data = section.get("data", {})
        style_variant = section.get("styleVariant", "split")
        
        if type == "header":
            html += f"""
  <header class="header-section section-container {style_variant}-variant" id="{id}">
    <div class="container">
      <a href="#" class="logo">
        <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary-color);"></i>
        <span>{data.get('logo', 'Aleyo')}</span>
      </a>
      <button class="nav-toggle"><i class="fa-solid fa-bars"></i></button>
      <ul class="nav-links">
        <li><a href="#features">{data.get('link1', 'Features')}</a></li>
        <li><a href="#gallery">{data.get('link2', 'Gallery')}</a></li>
        <li><a href="#testimonials">{data.get('link3', 'Testimonials')}</a></li>
        <li><a href="#contact">{data.get('link4', 'Contact')}</a></li>
        <li><a href="#contact" class="btn btn-primary" style="padding: 8px 18px; font-size: 0.9rem;">{data.get('ctaText', 'Get Started')}</a></li>
      </ul>
    </div>
  </header>
"""
        elif type == "hero":
            html += f"""
  <section class="hero-section section-container {style_variant}-variant" id="{id}">
    <div class="container">
      <div class="hero-content">
        <h1>{data.get('title', 'Hero Title')}</h1>
        <p>{data.get('subtitle', 'Hero description')}</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-primary">{data.get('cta1', 'Start Now')}</a>
          <a href="#features" class="btn btn-secondary">{data.get('cta2', 'Learn More')}</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="{data.get('image', '')}" alt="Hero Image">
      </div>
    </div>
  </section>
"""
        elif type == "features":
            cards_html = ""
            for card in data.get("cards", []):
                cards_html += f"""
          <div class="feature-card">
            <div class="feature-icon">{card.get('icon', '⚡')}</div>
            <h3>{card.get('title', 'Benefit')}</h3>
            <p>{card.get('desc', 'Detail text.')}</p>
          </div>
"""
            
            # Wrap in carousel structure if selected
            if style_variant == "carousel":
                cards_html = f"""
        <div class="carousel-container">
          <button class="carousel-arrow prev" onclick="slideCarousel('{id}', -1)"><i class="fa-solid fa-chevron-left"></i></button>
          <div class="carousel-viewport">
            <div class="carousel-track" id="track-{id}" data-current-idx="0">
              {cards_html}
            </div>
          </div>
          <button class="carousel-arrow next" onclick="slideCarousel('{id}', 1)"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
"""
            html += f"""
  <section class="features-section section-container {style_variant}-variant" id="features">
    <div class="container">
      <div class="section-header">
        <h2>{data.get('title', 'Our Features')}</h2>
        <p>{data.get('subtitle', 'Explore benefits')}</p>
      </div>
      <div class="features-grid">
        {cards_html}
      </div>
    </div>
  </section>
"""
        elif type == "gallery":
            items_html = ""
            for item in data.get("items", []):
                items_html += f"""
          <div class="gallery-item">
            <img src="{item.get('image', '')}" alt="Gallery">
            <div class="gallery-overlay">
              <div class="gallery-info">
                <h4>{item.get('title', 'Work')}</h4>
                <p>{item.get('desc', 'Description')}</p>
              </div>
            </div>
          </div>
"""
            
            # Wrap in carousel structure if selected
            if style_variant == "carousel":
                items_html = f"""
        <div class="carousel-container">
          <button class="carousel-arrow prev" onclick="slideCarousel('{id}', -1)"><i class="fa-solid fa-chevron-left"></i></button>
          <div class="carousel-viewport">
            <div class="carousel-track" id="track-{id}" data-current-idx="0">
              {items_html}
            </div>
          </div>
          <button class="carousel-arrow next" onclick="slideCarousel('{id}', 1)"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
"""
            html += f"""
  <section class="gallery-section section-container {style_variant}-variant" id="gallery">
    <div class="container">
      <div class="section-header">
        <h2>{data.get('title', 'Gallery')}</h2>
        <p>{data.get('subtitle', 'Visual catalog')}</p>
      </div>
      <div class="gallery-grid">
        {items_html}
      </div>
    </div>
  </section>
"""
        elif type == "testimonials":
            t_cards_html = ""
            for card in data.get("cards", []):
                t_cards_html += f"""
          <div class="testimonial-card">
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <p class="testimonial-quote">"{card.get('quote', 'Awesome work.')}"</p>
            <div class="testimonial-user">
              <img src="{card.get('avatar', '')}" class="testimonial-avatar" alt="Avatar">
              <div class="testimonial-details">
                <h4>{card.get('name', 'User')}</h4>
                <span>{card.get('role', 'Client')}</span>
              </div>
            </div>
          </div>
"""
            
            # Wrap in carousel structure if selected
            if style_variant == "carousel":
                t_cards_html = f"""
        <div class="carousel-container">
          <button class="carousel-arrow prev" onclick="slideCarousel('{id}', -1)"><i class="fa-solid fa-chevron-left"></i></button>
          <div class="carousel-viewport">
            <div class="carousel-track" id="track-{id}" data-current-idx="0">
              {t_cards_html}
            </div>
          </div>
          <button class="carousel-arrow next" onclick="slideCarousel('{id}', 1)"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
"""
            html += f"""
  <section class="testimonials-section section-container {style_variant}-variant" id="testimonials">
    <div class="container">
      <div class="section-header">
        <h2>{data.get('title', 'Reviews')}</h2>
        <p>{data.get('subtitle', 'Customer reviews')}</p>
      </div>
      <div class="testimonials-grid">
        {t_cards_html}
      </div>
    </div>
  </section>
"""
        elif type == "contact":
            html += f"""
  <section class="contact-section section-container {style_variant}-variant" id="contact">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          <h3>{data.get('title', 'Contact Us')}</h3>
          <p>{data.get('subtitle', 'Get in touch')}</p>
          <ul class="contact-details">
            <li><i class="fa-solid fa-envelope"></i> <span>{data.get('email', '')}</span></li>
            <li><i class="fa-solid fa-phone"></i> <span>{data.get('phone', '')}</span></li>
            <li><i class="fa-solid fa-map-pin"></i> <span>{data.get('address', '')}</span></li>
          </ul>
        </div>
        <div class="contact-form">
          <form action="#" method="POST">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" name="name" required>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" class="form-control" name="email" required>
            </div>
            <div class="form-group">
              <label>Your Message</label>
              <textarea class="form-control" name="message" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </section>
"""
        elif type == "footer":
            html += f"""
  <footer class="footer-section section-container {style_variant}-variant">
    <div class="container">
      <span class="copyright">{data.get('copyright', '')}</span>
      <ul class="footer-links">
        <li><a href="#">{data.get('link1', 'Privacy')}</a></li>
        <li><a href="#">{data.get('link2', 'Terms')}</a></li>
      </ul>
    </div>
  </footer>
"""
        elif type == "code":
            html += f"""
  <section class="custom-code-section" id="{id}">
    <div class="container">
      {data.get('code', '')}
    </div>
  </section>
"""
    return html


def compile_project_files(projectName: str, theme: str, font: str, sections: List[Dict], exportFormat: str) -> Dict[str, str]:
    theme_colors = {
        "royal": {"primary": "#6366f1", "primaryHover": "#4f46e5", "secondary": "#10b981", "bg": "#0f172a", "text": "#f8fafc", "textMuted": "#94a3b8", "cardBg": "#1e293b", "cardBorder": "rgba(255, 255, 255, 0.05)", "borderRadius": "12px"},
        "neon": {"primary": "#06b6d4", "primaryHover": "#0891b2", "secondary": "#ec4899", "bg": "#09090b", "text": "#f4f4f5", "textMuted": "#a1a1aa", "cardBg": "#18181b", "cardBorder": "rgba(255, 255, 255, 0.08)", "borderRadius": "8px"},
        "forest": {"primary": "#059669", "primaryHover": "#047857", "secondary": "#f59e0b", "bg": "#061a14", "text": "#ecfdf5", "textMuted": "#a7f3d0", "cardBg": "#0b2e24", "cardBorder": "rgba(167, 243, 208, 0.05)", "borderRadius": "16px"},
        "sunset": {"primary": "#f43f5e", "primaryHover": "#e11d48", "secondary": "#fb923c", "bg": "#0f090d", "text": "#fff1f2", "textMuted": "#fda4af", "cardBg": "#1c0f17", "cardBorder": "rgba(253, 164, 175, 0.08)", "borderRadius": "14px"},
        "classic": {"primary": "#18181b", "primaryHover": "#27272a", "secondary": "#2563eb", "bg": "#ffffff", "text": "#09090b", "textMuted": "#71717a", "cardBg": "#f4f4f5", "cardBorder": "rgba(9, 9, 11, 0.05)", "borderRadius": "8px"},
        "nordic": {"primary": "#4f46e5", "primaryHover": "#4338ca", "secondary": "#38bdf8", "bg": "#f3f4f6", "text": "#1f2937", "textMuted": "#4b5563", "cardBg": "#ffffff", "cardBorder": "rgba(31, 41, 55, 0.05)", "borderRadius": "20px"}
    }
    
    # Check fallback theme if not one of the core six
    tObj = theme_colors.get(theme, theme_colors["royal"])
    
    font_imports = {
        "outfit": {"value": "'Outfit', sans-serif", "import": "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');"},
        "inter": {"value": "'Inter', sans-serif", "import": "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');"},
        "playfair": {"value": "'Playfair Display', serif", "import": "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@400;600&display=swap');"},
        "space": {"value": "'Space Grotesk', sans-serif", "import": "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');"}
    }
    fObj = font_imports.get(font, font_imports["outfit"])
    
    preview_css = get_preview_css()
    
    # CSS Custom property block
    css_variables = f"""
:root {{
  --primary-color: {tObj['primary']};
  --primary-hover: {tObj['primaryHover']};
  --secondary-color: {tObj['secondary']};
  --bg-color: {tObj['bg']};
  --text-color: {tObj['text']};
  --text-muted: {tObj['textMuted']};
  --card-bg: {tObj['cardBg']};
  --card-border: {tObj['cardBorder']};
  --border-radius: {tObj['borderRadius']};
  --font-family: {fObj['value']};
}}
"""
    
    # Standard scripting blocks for responsive menus
    nav_toggle_script = """
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
    """

    carousel_script = """
    window.slideCarousel = (sectionId, direction) => {
      const track = document.getElementById(`track-${sectionId}`);
      if (!track) return;
      const slides = track.children;
      if (slides.length === 0) return;
      
      let currentIdx = parseInt(track.dataset.currentIdx || '0');
      currentIdx += direction;
      
      if (currentIdx < 0) currentIdx = slides.length - 1;
      else if (currentIdx >= slides.length) currentIdx = 0;
      
      track.dataset.currentIdx = currentIdx;
      const offset = currentIdx * -100;
      track.style.transform = `translateX(${offset}%)`;
    };
    """

    files = {}

    # 1. HTML FORMAT
    if exportFormat == "html":
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{projectName}</title>
  
  <!-- Professional SEO Metadata -->
  <meta name="description" content="A professional theme-coordinated portal for {projectName}. Optimized for desktop and mobile devices.">
  <meta name="author" content="Aleyo Builder AI">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{projectName}">
  <meta property="og:description" content="A professional theme-coordinated portal.">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{projectName}">
  <meta name="twitter:description" content="A professional theme-coordinated portal.">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    {fObj['import']}
    {css_variables}
    {preview_css}
  </style>
</head>
<body>
{compile_sections_to_html(sections)}
  <script>
    {nav_toggle_script}
    {carousel_script}
    document.querySelectorAll('form').forEach(form => {{
      form.addEventListener('submit', (e) => {{
        e.preventDefault();
        alert('Thank you! Your message was submitted successfully.');
        form.reset();
      }});
    }});
  </script>
</body>
</html>
"""
        files["index.html"] = html_content
        files[".gitignore"] = """# OS files
.DS_Store
Thumbs.db
"""
        files["README.md"] = f"""# {projectName}

This website project was compiled and generated with **Aleyo Builder AI**.

## 📁 File Structure
- `index.html` - Standard HTML5 webpage containing the structural sections, custom styles, dynamic background glows, and interactive slider modules.

## 🚀 Setup & Launch
You can run this project locally by opening `index.html` directly in any web browser, or by spinning up a simple local server:
```bash
# Python 3
python -m http.server 8000
```
Then visit: `http://localhost:8000`
"""

    # 2. REACT FORMAT
    elif exportFormat == "react":
        # package.json
        files["package.json"] = json.dumps({
            "name": "aleyo-react-app",
            "private": True,
            "version": "1.0.0",
            "type": "module",
            "scripts": {
                "dev": "vite",
                "build": "vite build"
            },
            "dependencies": {
                "react": "^18.2.0",
                "react-dom": "^18.2.0"
            },
            "devDependencies": {
                "@vitejs/plugin-react": "^4.2.1",
                "vite": "^5.1.4"
            }
        }, indent=2)
        
        # vite.config.js
        files["vite.config.js"] = """import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()]
});
"""
        
        # index.html
        files["index.html"] = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{projectName}</title>
  
  <!-- Professional SEO Metadata -->
  <meta name="description" content="A professional theme-coordinated React portal for {projectName}. Optimized with Vite and responsive sliding features.">
  <meta name="author" content="Aleyo Builder AI">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{projectName}">
  <meta property="og:description" content="A professional theme-coordinated portal.">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{projectName}">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
"""
        
        # src/main.jsx
        files["src/main.jsx"] = """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""
        
        # src/index.css
        files["src/index.css"] = f"""{fObj['import']}
{css_variables}
{preview_css}
"""
        
        # src/App.jsx (React render JSX code of sections)
        # To make it fully working, we will inline the HTML as static JSX!
        sections_jsx = ""
        for section in sections:
            sections_jsx += generate_section_jsx(section)

        files["src/App.jsx"] = f"""import React, {{ useState, useEffect }} from 'react';

export default function App() {{
  const [navActive, setNavActive] = useState(false);

  useEffect(() => {{
    window.slideCarousel = (sectionId, direction) => {{
      const track = document.getElementById(`track-${{sectionId}}`);
      if (!track) return;
      const slides = track.children;
      if (slides.length === 0) return;
      
      let currentIdx = parseInt(track.dataset.currentIdx || '0');
      currentIdx += direction;
      
      if (currentIdx < 0) currentIdx = slides.length - 1;
      else if (currentIdx >= slides.length) currentIdx = 0;
      
      track.dataset.currentIdx = currentIdx;
      const offset = currentIdx * -100;
      track.style.transform = `translateX(${{offset}}%)`;
    }};
  }}, []);

  const handleSubmit = (e) => {{
    e.preventDefault();
    alert('Thank you! Your message was submitted successfully.');
    e.target.reset();
  }};

  return (
    <div>
      {sections_jsx}
    </div>
  );
}}
"""
        files[".gitignore"] = """# logs
*.log
npm-debug.log*

# Dependency directories
node_modules/

# Output directories
dist/
dist-ssr/

# OS files
.DS_Store
Thumbs.db
"""
        files["README.md"] = f"""# {projectName} (React + Vite)

This React website project was compiled and generated with **Aleyo Builder AI**.

## 📁 File Structure
- `src/App.jsx` - Main React entry page housing layout sections, form handlers, and responsive carousel sliding tracks.
- `src/index.css` - Theme styles, background radial glows, feature icons, and card hover variables.
- `src/main.jsx` - React DOM initialization mount.
- `vite.config.js` - Vite configuration template.
- `index.html` - Base HTML shell with SEO metadata.

## 🚀 Setup & Launch
1. Install node dependencies:
```bash
npm install
```
2. Start the hot-reloading development server:
```bash
npm run dev
```
3. Compile production-ready assets to the `dist/` directory:
```bash
npm run build
```
"""

    # 3. NEXTJS FORMAT
    elif exportFormat == "nextjs":
        files["package.json"] = json.dumps({
            "name": "aleyo-next-app",
            "private": True,
            "version": "1.0.0",
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start"
            },
            "dependencies": {
                "next": "14.1.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0"
            }
        }, indent=2)
        
        # app/layout.js
        files["app/layout.js"] = f"""import './globals.css';

export const metadata = {{
  title: '{projectName}',
  description: 'A professional theme-coordinated Next.js portal designed for {projectName}.',
  openGraph: {{
    title: '{projectName}',
    description: 'A professional theme-coordinated portal.',
    type: 'website',
  }},
  twitter: {{
    card: 'summary_large_image',
    title: '{projectName}',
    description: 'A professional theme-coordinated portal.',
  }}
}};

export default function RootLayout({{ children }}) {{
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>{{children}}</body>
    </html>
  );
}}
"""
        # app/globals.css
        files["app/globals.css"] = f"""{fObj['import']}
{css_variables}
{preview_css}
"""
        
        # app/page.js
        sections_jsx = ""
        for section in sections:
            sections_jsx += generate_section_jsx(section)
            
        files["app/page.js"] = f"""'use client';
import React, {{ useState, useEffect }} from 'react';

export default function Home() {{
  const [navActive, setNavActive] = useState(false);

  useEffect(() => {{
    window.slideCarousel = (sectionId, direction) => {{
      const track = document.getElementById(`track-${{sectionId}}`);
      if (!track) return;
      const slides = track.children;
      if (slides.length === 0) return;
      
      let currentIdx = parseInt(track.dataset.currentIdx || '0');
      currentIdx += direction;
      
      if (currentIdx < 0) currentIdx = slides.length - 1;
      else if (currentIdx >= slides.length) currentIdx = 0;
      
      track.dataset.currentIdx = currentIdx;
      const offset = currentIdx * -100;
      track.style.transform = `translateX(${{offset}}%)`;
    }};
  }}, []);

  const handleSubmit = (e) => {{
    e.preventDefault();
    alert('Thank you! Your message was submitted.');
    e.target.reset();
  }};

  return (
    <div>
      {sections_jsx}
    </div>
  );
}}
"""
        files[".gitignore"] = """# logs
*.log
npm-debug.log*

# Dependency directories
node_modules/

# Next.js build
.next/
out/
build/

# OS files
.DS_Store
Thumbs.db
"""
        files["README.md"] = f"""# {projectName} (Next.js App Router)

This Next.js portal was compiled and generated with **Aleyo Builder AI**.

## 📁 File Structure
- `app/page.js` - Live clientside entry page template housing layout sections, form handlers, and responsive carousel sliding tracks.
- `app/layout.js` - App shell config declaring SEO OpenGraph metadata, title headings, and scripts.
- `app/globals.css` - Custom styling stylesheet.

## 🚀 Setup & Launch
1. Install node dependencies:
```bash
npm install
```
2. Start the local hot-reloading development server:
```bash
npm run dev
```
3. Compile production-ready builds:
```bash
npm run build
```
"""

    # 4. PYTHON FASTAPI FORMAT
    elif exportFormat == "fastapi":
        files["requirements.txt"] = "fastapi\nuvicorn\njinja2\n"
        
        # Python FastAPI script
        files["main.py"] = """import os
from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI(title="Aleyo Python Site")

# Setup static files directory
os.makedirs("static", exist_ok=True)
os.makedirs("templates", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/contact")
def submit_contact(name: str = Form(...), email: str = Form(...), message: str = Form(...)):
    # Simulates saving locally
    print(f"Received contact from {name} ({email}): {message}")
    return HTMLResponse("<script>alert('Thank you! Your message was submitted successfully.'); window.location.href='/';</script>")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
"""
        # static/styles.css
        files["static/styles.css"] = f"{fObj['import']}\n{css_variables}\n{preview_css}"
        
        # templates/index.html
        # Set FastAPI form actions to post to `/contact`
        html_content = compile_sections_to_html(sections)
        html_content = html_content.replace('<form action="#" method="POST">', '<form action="/contact" method="POST">')
        
        files["templates/index.html"] = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{projectName}</title>
  
  <!-- Professional SEO Metadata -->
  <meta name="description" content="A professional theme-coordinated portal for {projectName} running on Python FastAPI.">
  <meta name="author" content="Aleyo Builder AI">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{projectName}">
  <meta property="og:description" content="A professional theme-coordinated portal.">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{projectName}">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
{html_content}
  <script>
    {nav_toggle_script}
    {carousel_script}
  </script>
</body>
</html>
"""
        files[".gitignore"] = """# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd

# Environments
.venv/
venv/
ENV/

# OS files
.DS_Store
Thumbs.db
"""
        files["README.md"] = f"""# {projectName} (Python FastAPI Server)

This Python web app was compiled and generated with **Aleyo Builder AI**.

## 📁 File Structure
- `main.py` - FastAPI app file hosting static routes and live contact form endpoints.
- `templates/index.html` - Jinja2 layout page containing structural layouts.
- `static/styles.css` - Custom styling stylesheet.
- `requirements.txt` - Python module dependencies.

## 🚀 Setup & Launch
1. Create a Python virtual environment:
```bash
python -m venv venv
```
2. Activate virtual environment:
- Windows: `venv\\Scripts\\activate`
- macOS/Linux: `source venv/bin/activate`
3. Install package dependencies:
```bash
pip install -r requirements.txt
```
4. Run server:
```bash
python main.py
```
5. View in browser: `http://127.0.0.1:8080`
"""

    # 5. PHP FORMAT
    elif exportFormat == "php":
        # static/styles.css
        files["styles.css"] = f"{fObj['import']}\n{css_variables}\n{preview_css}"
        
        html_content = compile_sections_to_html(sections)
        # Update contact form action to POST to same file
        html_content = html_content.replace('<form action="#" method="POST">', '<form action="" method="POST">')
        
        # index.php
        files["index.php"] = f"""<?php
// Handle form submission in PHP
if ($_SERVER["REQUEST_METHOD"] == "POST") {{
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = strip_tags(trim($_POST["message"]));
    
    // Simulates emailing/saving
    error_log("Contact form submission: $name ($email) - $message");
    
    echo "<script>alert('Thank you! Your message was submitted successfully.');</script>";
}}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{projectName}</title>
  
  <!-- Professional SEO Metadata -->
  <meta name="description" content="A professional theme-coordinated portal for {projectName} built with PHP.">
  <meta name="author" content="Aleyo Builder AI">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{projectName}">
  <meta property="og:description" content="A professional theme-coordinated portal.">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{projectName}">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
{html_content}
  <script>
    {nav_toggle_script}
    {carousel_script}
  </script>
</body>
</html>
"""
        files[".gitignore"] = """# OS files
.DS_Store
Thumbs.db
"""
        files["README.md"] = f"""# {projectName} (PHP Webpage)

This PHP website project was compiled and generated with **Aleyo Builder AI**.

## 📁 File Structure
- `index.php` - Responsive PHP page handling contact submissions and rendering structural sections.
- `styles.css` - Custom styling stylesheet.

## 🚀 Setup & Launch
1. Host this directly on Apache or Nginx servers with PHP enabled.
2. Alternatively, run PHP's built-in local development server:
```bash
php -S 127.0.0.1:8000
```
3. Open `http://127.0.0.1:8000` in your web browser.
"""

    return files

def generate_section_jsx(section: Dict) -> str:
    """Helper to convert section elements into JSX compliant codes"""
    id = section.get("id", "section")
    type = section.get("type")
    data = section.get("data", {})
    style_variant = section.get("styleVariant", "split")
    
    if type == "header":
        return f"""
      <header className="header-section section-container {style_variant}-variant" id="{id}">
        <div className="container">
          <a href="#" className="logo">
            <i className="fa-solid fa-wand-magic-sparkles" style={{{{ color: 'var(--primary-color)' }}}}></i>
            <span>{data.get('logo', 'Aleyo')}</span>
          </a>
          <button className="nav-toggle" onClick={{() => setNavActive(!navActive)}}><i className="fa-solid fa-bars"></i></button>
          <ul className="nav-links" style={{{{ display: navActive ? 'flex' : '' }}}}>
            <li><a href="#features">{data.get('link1', 'Features')}</a></li>
            <li><a href="#gallery">{data.get('link2', 'Gallery')}</a></li>
            <li><a href="#testimonials">{data.get('link3', 'Testimonials')}</a></li>
            <li><a href="#contact">{data.get('link4', 'Contact')}</a></li>
            <li><a href="#contact" className="btn btn-primary" style={{{{ padding: '8px 18px', fontSize: '0.9rem' }}}}>{data.get('ctaText', 'Get Started')}</a></li>
          </ul>
        </div>
      </header>
"""
    elif type == "hero":
        return f"""
      <section className="hero-section section-container {style_variant}-variant" id="{id}">
        <div className="container">
          <div className="hero-content">
            <h1>{data.get('title', 'Hero Title')}</h1>
            <p>{data.get('subtitle', 'Hero description')}</p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">{data.get('cta1', 'Start Now')}</a>
              <a href="#features" className="btn btn-secondary">{data.get('cta2', 'Learn More')}</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="{data.get('image', '')}" alt="Hero Image" />
          </div>
        </div>
      </section>
"""
    elif type == "features":
        cards_jsx = ""
        for card in data.get("cards", []):
            cards_jsx += f"""
          <div className="feature-card">
            <div className="feature-icon">{card.get('icon', '⚡')}</div>
            <h3>{card.get('title', 'Benefit')}</h3>
            <p>{card.get('desc', 'Detail text.')}</p>
          </div>
"""
        if style_variant == "carousel":
            cards_jsx = f"""
          <div className="carousel-container">
            <button className="carousel-arrow prev" onClick={{() => window.slideCarousel('{id}', -1)}}><i className="fa-solid fa-chevron-left"></i></button>
            <div className="carousel-viewport">
              <div className="carousel-track" id="track-{id}" data-current-idx="0">
                {cards_jsx}
              </div>
            </div>
            <button className="carousel-arrow next" onClick={{() => window.slideCarousel('{id}', 1)}}><i className="fa-solid fa-chevron-right"></i></button>
          </div>
"""
        return f"""
      <section className="features-section section-container {style_variant}-variant" id="features">
        <div className="container">
          <div className="section-header">
            <h2>{data.get('title', 'Our Features')}</h2>
            <p>{data.get('subtitle', 'Explore benefits')}</p>
          </div>
          <div className="features-grid">
            {cards_jsx}
          </div>
        </div>
      </section>
"""
    elif type == "gallery":
        items_jsx = ""
        for item in data.get("items", []):
            items_jsx += f"""
          <div className="gallery-item">
            <img src="{item.get('image', '')}" alt="Gallery" />
            <div className="gallery-overlay">
              <div className="gallery-info">
                <h4>{item.get('title', 'Work')}</h4>
                <p>{item.get('desc', 'Description')}</p>
              </div>
            </div>
          </div>
"""
        if style_variant == "carousel":
            items_jsx = f"""
          <div className="carousel-container">
            <button className="carousel-arrow prev" onClick={{() => window.slideCarousel('{id}', -1)}}><i className="fa-solid fa-chevron-left"></i></button>
            <div className="carousel-viewport">
              <div className="carousel-track" id="track-{id}" data-current-idx="0">
                {items_jsx}
              </div>
            </div>
            <button className="carousel-arrow next" onClick={{() => window.slideCarousel('{id}', 1)}}><i className="fa-solid fa-chevron-right"></i></button>
          </div>
"""
        return f"""
      <section className="gallery-section section-container {style_variant}-variant" id="gallery">
        <div className="container">
          <div className="section-header">
            <h2>{data.get('title', 'Gallery')}</h2>
            <p>{data.get('subtitle', 'Visual catalog')}</p>
          </div>
          <div className="gallery-grid">
            {items_jsx}
          </div>
        </div>
      </section>
"""
    elif type == "testimonials":
        t_cards_jsx = ""
        for card in data.get("cards", []):
            t_cards_jsx += f"""
          <div className="testimonial-card">
            <div className="stars">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="testimonial-quote">"{card.get('quote', 'Awesome work.')}"</p>
            <div className="testimonial-user">
              <img src="{card.get('avatar', '')}" className="testimonial-avatar" alt="Avatar" />
              <div className="testimonial-details">
                <h4>{card.get('name', 'User')}</h4>
                <span>{card.get('role', 'Client')}</span>
              </div>
            </div>
          </div>
"""
        if style_variant == "carousel":
            t_cards_jsx = f"""
          <div className="carousel-container">
            <button className="carousel-arrow prev" onClick={{() => window.slideCarousel('{id}', -1)}}><i className="fa-solid fa-chevron-left"></i></button>
            <div className="carousel-viewport">
              <div className="carousel-track" id="track-{id}" data-current-idx="0">
                {t_cards_jsx}
              </div>
            </div>
            <button className="carousel-arrow next" onClick={{() => window.slideCarousel('{id}', 1)}}><i className="fa-solid fa-chevron-right"></i></button>
          </div>
"""
        return f"""
      <section className="testimonials-section section-container {style_variant}-variant" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>{data.get('title', 'Reviews')}</h2>
            <p>{data.get('subtitle', 'Customer reviews')}</p>
          </div>
          <div className="testimonials-grid">
            {t_cards_jsx}
          </div>
        </div>
      </section>
"""
    elif type == "contact":
        return f"""
      <section className="contact-section section-container {style_variant}-variant" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>{data.get('title', 'Contact Us')}</h3>
              <p>{data.get('subtitle', 'Get in touch')}</p>
              <ul className="contact-details">
                <li><i className="fa-solid fa-envelope"></i> <span>{data.get('email', '')}</span></li>
                <li><i className="fa-solid fa-phone"></i> <span>{data.get('phone', '')}</span></li>
                <li><i className="fa-solid fa-map-pin"></i> <span>{data.get('address', '')}</span></li>
              </ul>
            </div>
            <div className="contact-form">
              <form onSubmit={{handleSubmit}}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" placeholder="Jane Doe" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" placeholder="jane@example.com" required />
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea className="form-control" placeholder="Type here..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{{{ width: '100%' }}}}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
"""
    elif type == "footer":
        return f"""
      <footer className="footer-section section-container {style_variant}-variant">
        <div className="container">
          <span className="copyright">{data.get('copyright', '')}</span>
          <ul className="footer-links">
            <li><a href="#">{data.get('link1', 'Privacy')}</a></li>
            <li><a href="#">{data.get('link2', 'Terms')}</a></li>
          </ul>
        </div>
      </footer>
"""
    elif type == "code":
        code_str = data.get('code', '').replace('`', '\\`').replace('{', '{{').replace('}', '}}')
        return f"""
      <section className="custom-code-section" id="{id}">
        <div className="container" dangerouslySetInnerHTML={{{{ __html: `{code_str}` }}}} />
      </section>
"""
    return ""

class WriteLocalRequest(BaseModel):
    projectName: str
    theme: str
    font: str
    sections: List[Dict[str, Any]]
    localPath: str
    exportFormat: str

@app.post("/api/write-local")
def write_local_project(req: WriteLocalRequest):
    """Generates and writes a multi-language website file structure directly to local disk paths"""
    path = req.localPath.strip()
    if not path:
        raise HTTPException(status_code=400, detail="Local directory path must be specified.")
    
    path = os.path.abspath(path)
    
    try:
        os.makedirs(path, exist_ok=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create target directory: {str(e)}")
        
    files = compile_project_files(req.projectName, req.theme, req.font, req.sections, req.exportFormat)
    
    written_files = []
    try:
        for rel_path, content in files.items():
            full_path = os.path.join(path, rel_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)
            written_files.append(rel_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error compiling and writing files to local disk: {str(e)}")
        
    return {
        "status": "success",
        "localPath": path,
        "exportFormat": req.exportFormat,
        "writtenFiles": written_files
    }

def delete_project(filename: str):
    """Removes a project file from disk"""
    filepath = os.path.join(PROJECTS_DIR, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Project not found")

def request_time_iso():
    import datetime
    return datetime.datetime.now().isoformat()

# Mount built React assets folder to serve the compiled client SPA
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

