import React, { useCallback, useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

// API base: relative for local dev, absolute for Render deployment
const API_BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? "http://127.0.0.1:4173"
  : "https://accelerator-backend.onrender.com";

const h = React.createElement;

const fallbackData = {
  brand: {
    name: "QVSCL Accelerator",
    tagline: "Accelerator & Venture Studio",
    linkedin: "https://www.linkedin.com/company/qvscl-accelerator-venture-studio/about/",
    reference: "https://www.indiaaccelerator.co",
    email: "info@qvscl.com",
    address: "5th floor, Adani Miracle Miles, 507, Sector 60, Gurugram, Haryana 122098",
    phone: "9810646388",
  },
  stats: [
    { value: "25-50L", label: "Avg ticket size", detail: "For portfolio companies" },
    { value: "5+", label: "Active Mentors", detail: "Across domains and functions" },
    { value: "15+", label: "Industry Verticals", detail: "Deep tech, health, fintech" },
  ],
  programs: [
    {
      title: "Venture Studio",
      accent: "green",
      icon: "rocket",
      eyebrow: "Co-Create",
      summary: "We ideate, validate, and launch ventures from the ground up. Our studio model provides hands-on support, capital, and operational expertise.",
      features: ["Idea validation and market research", "Product MVP development", "Go-to-market strategy", "Pre-seed funding", "6-month intensive program"],
    },
    {
      title: "Cohort Accelerator",
      accent: "violet",
      icon: "chart",
      eyebrow: "Scale Fast",
      summary: "Fast-track your growth with investor-ready support. Perfect for early-stage startups ready to sharpen execution and close funding.",
      features: ["Investor introductions", "Growth playbooks", "Weekly office hours", "Demo day preparation", "12-week intensive program"],
    },
  ],
  portfolio: [
    { name: "GoAid", focus: "Emergency assistance and response", signal: "Impact-led mobility support", detail: "GoAid provides rapid emergency ambulance services with real-time tracking and AI-based dispatch, ensuring critical care reaches those in need within the golden hour.", image: "/assets/portfolio-goaid.png", color: "#ef233c" },
    { name: "LabBuddy", focus: "Learning and laboratory enablement", signal: "Education and skill access", detail: "LabBuddy is a digital platform connecting students and professionals with hands-on lab experiments, virtual simulations, and skill-based certification programs.", image: "/assets/portfolio-labbuddy.jpeg", color: "#1d9a8a" },
    { name: "WeSkills", focus: "Workforce empowerment and hiring", signal: "Talent-to-industry bridge", detail: "WeSkills is a workforce empowerment platform connecting talent with industry through skill assessments, micro-credentials, and direct hiring pipelines, enabling career growth for the modern workforce.", image: "/assets/portfolio-weskills.webp", color: "#e94e1b" },
  ],
  approach: [
    {
      title: "Rigorous Validation",
      icon: "target",
      body: "We validate market-problem fit before building. Data-driven decisions minimize risk and accelerate learning.",
    },
    {
      title: "Capital & Connections",
      icon: "handshake",
      body: "Access to investor networks, strategic partners, and follow-on funding to scale beyond the program.",
    },
    {
      title: "Operational Excellence",
      icon: "spark",
      body: "Hands-on mentorship from operators, GTM frameworks, and tactical support across every function.",
    },
    {
      title: "Community & Collaboration",
      icon: "lightbulb",
      body: "Cohort-based learning, peer support, and ecosystem access to accelerate progress and unlock opportunities.",
    },
  ],
  journey: [
    {
      phase: "1",
      title: "Validation Sprint",
      body: "Week 1-3: Problem-market fit exploration, user research, and competitive benchmarking. Define your core thesis and validate assumptions with potential customers.",
    },
    {
      phase: "2",
      title: "MVP Development",
      body: "Week 4-8: Build your minimum viable product with our technical partners. Validate your solution in the hands of real users. Rapid iteration based on feedback.",
    },
    {
      phase: "3",
      title: "GTM & Traction",
      body: "Week 9-12: Launch go-to-market playbook, establish KPIs, and build initial traction. Prepare metrics for investor conversations.",
    },
    {
      phase: "4",
      title: "Investor Readiness",
      body: "Week 12+: Pitch deck refinement, investor introductions, and funding negotiations. Demo day presentation to our investor network.",
    },
  ],
  resources: [
    { type: "Guide", title: "Fundraising Playbook", meta: "Essential templates and best practices for raising your first check.", href: "#resources" },
    { type: "Template", title: "Financial Model", meta: "Ready-to-use 3-year projection template for your startup.", href: "#resources" },
    { type: "Checklist", title: "Launch Checklist", meta: "80-point pre-launch verification to ensure market readiness.", href: "#resources" },
    { type: "Article", title: "GTM Framework", meta: "Step-by-step guide to building and executing your go-to-market strategy.", href: "#resources" },
    { type: "Video", title: "Pitch Mastery", meta: "6-part series on crafting and delivering compelling pitches.", href: "#resources" },
    { type: "Webinar", title: "Unit Economics 101", meta: "Understanding metrics that matter to investors and scale.", href: "#resources" },
  ],
  events: [
    { date: "Jul 14", title: "Founder Office Hours", mode: "In-person • Gurugram" },
    { date: "Jul 21", title: "Pitch Workshop Series", mode: "Hybrid • Online & Office" },
    { date: "Aug 02", title: "Investor Panel Discussion", mode: "Hybrid • Q&A with VCs" },
    { date: "Aug 15", title: "Cohort Demo Day", mode: "In-person • Live investor showcase" },
    { date: "Aug 28", title: "Mentor Speed Dating", mode: "In-person • Expert connections" },
    { date: "Sep 10", title: "Growth Hacking Workshop", mode: "Hybrid • Hands-on tactics" },
  ],
};

const statCycles = [
  [
    { value: "2", label: "Founder pathways", detail: "Venture studio and accelerator" },
    { value: "4", label: "Support pillars", detail: "Build, mentor, fundraise, scale" },
    { value: "3", label: "Portfolio signals", detail: "GoAid, LabBuddy, WeSkills" },
  ],
  [
    { value: "25-50L", label: "Avg ticket size", detail: "For portfolio companies" },
    { value: "5+", label: "Active Mentors", detail: "Across domains and functions" },
    { value: "15+", label: "Industry Verticals", detail: "Deep tech, health, fintech" },
  ],
];

const iconPaths = {
  arrowRight: [
    "M5 12h14",
    "m13 5 7 7-7 7",
  ],
  chevronDown: [
    "m6 9 6 6 6-6",
  ],
  check: [
    "M20 6 9 17l-5-5",
  ],
  menu: [
    "M4 7h16",
    "M4 12h16",
    "M4 17h16",
  ],
  x: [
    "M18 6 6 18",
    "M6 6l12 12",
  ],
  rocket: [
    "M4.5 16.5c-1.2 1.2-1.6 3.2-1 4 0.8 0.6 2.8 0.2 4-1",
    "M9 15 6 18",
    "M14 4c3.5 0 5 1.5 5 5 0 4-4 9-8 11l-7-7C6 8 10 4 14 4Z",
    "M15 9h.01",
  ],
  chart: [
    "M4 19h16",
    "M7 16V9",
    "M12 16V5",
    "M17 16v-4",
  ],
  lightbulb: [
    "M9 18h6",
    "M10 22h4",
    "M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.7-1.5 1.6-1.5 3h-4c0-1.4-.7-2.3-1.5-3Z",
  ],
  handshake: [
    "M8 12 5 15a3 3 0 0 0 4 4l2-2",
    "m14 12 3 3a3 3 0 0 1-4 4l-2-2",
    "M7 12l3-3 3 3 2-2 4 4",
    "M3 9l4-4 4 4",
    "m21 9-4-4-4 4",
  ],
  target: [
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
    "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z",
    "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  spark: [
    "M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z",
    "M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z",
  ],
  linkedin: [
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z",
    "M2 9h4v12H2z",
    "M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  mail: [
    "M4 4h16v16H4z",
    "m4 7 8 6 8-6",
  ],
  layers: [
    "M12 2 2 7l10 5 10-5-10-5Z",
    "M2 17l10 5 10-5",
    "M2 12l10 5 10-5",
  ],
};

function Icon({ name, size = 20, stroke = 2, className = "" }) {
  const paths = iconPaths[name] || iconPaths.arrowRight;
  return h(
    "svg",
    {
      className: `icon ${className}`,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: stroke,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
    },
    paths.map((d) => h("path", { key: d, d }))
  );
}

function App() {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [statIndex, setStatIndex] = useState(0);
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith("/insights/")) return { view: "article", slug: path.replace("/insights/", "") };
    if (path === "/insights") return { view: "insights" };
    if (path === "/privacy-policy") return { view: "privacy" };
    if (path === "/terms-of-use") return { view: "terms" };
    return { view: "main" };
  });

  const navigate = useCallback((to) => {
    if (to.startsWith("#")) {
      if (page.view !== "main") {
        window.history.pushState({}, "", "/");
        setPage({ view: "main" });
        requestAnimationFrame(() => {
          const el = document.querySelector(to);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        });
      } else {
        const el = document.querySelector(to);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    window.history.pushState({}, "", to);
    if (to.startsWith("/insights/")) setPage({ view: "article", slug: to.replace("/insights/", "") });
    else if (to === "/insights") setPage({ view: "insights" });
    else if (to === "/privacy-policy") setPage({ view: "privacy" });
    else if (to === "/terms-of-use") setPage({ view: "terms" });
    else { setPage({ view: "main" }); window.scrollTo(0, 0); }
  }, [page.view]);

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/insights/")) setPage({ view: "article", slug: path.replace("/insights/", "") });
      else if (path === "/insights") setPage({ view: "insights" });
      else if (path === "/privacy-policy") setPage({ view: "privacy" });
      else if (path === "/terms-of-use") setPage({ view: "terms" });
      else setPage({ view: "main" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/site-data`)
      .then((response) => response.json())
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setData(fallbackData);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(modalMode));
  }, [modalMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatIndex(prev => (prev + 1) % statCycles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const mainContent = page.view === "insights"
    ? h(InsightsPage, { navigate })
    : page.view === "article"
      ? h(BlogPostPage, { slug: page.slug, navigate })
      : page.view === "privacy"
        ? h(LegalPage, { type: "privacy", navigate })
        : page.view === "terms"
          ? h(LegalPage, { type: "terms", navigate })
          : h(HomePage, { data, loading, onOpenApply: (type) => window.open(type === "partner" ? "https://forms.gle/z4C3VUzxyWaJ7kw98" : "https://forms.gle/ZiairZ8uJSGjQab78", "_blank"), statIndex, setStatIndex, navigate });

  return h(
    React.Fragment,
    null,
    h(Header, { data, onOpenApply: (type) => window.open(type === "partner" ? "https://forms.gle/z4C3VUzxyWaJ7kw98" : "https://forms.gle/ZiairZ8uJSGjQab78", "_blank"), navigate, pageView: page.view }),
    h("div", { id: "glass-bg" }),
    h(ParticleBackground, null),
    mainContent,
    h(Footer, { data, onOpenApply: (type) => window.open(type === "partner" ? "https://forms.gle/z4C3VUzxyWaJ7kw98" : "https://forms.gle/ZiairZ8uJSGjQab78", "_blank"), navigate })
  );
}

function HomePage({ data, loading, onOpenApply, statIndex, setStatIndex }) {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".scroll-in, .metric, .program-card, .highlight-item, .portfolio-card, .approach-item, .event-row, .resource-row, .cta-card, .cta-header");
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  return h("main", null,
    h(Hero, { data, loading, onOpenApply }),
    h(Metrics, { stats: statCycles[statIndex] }),
    h(AboutSection, { data }),
    h(ProgramSection, { programs: data.programs, onOpenApply }),
    h(PortfolioSection, { portfolio: data.portfolio }),
    h(ApproachSection, { approach: data.approach }),
    h(JourneySection, { journey: data.journey }),
    h(FounderCTA, { onOpenApply }),
    h(ContactSection, { data })
  );
}

function Header({ data, onOpenApply, navigate, pageView }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hoverTimer = useRef(null);
  const navItems = useMemo(() => [
    { label: "About Us", href: "#about" },
    {
      label: "What We Do",
      items: [
        { label: "Venture Studio", href: "#programs", body: "Co-create and build from zero to launch." },
        { label: "Accelerator", href: "#programs", body: "Cohort support for early-stage startups." },
      ],
    },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "#contact" },
  ], [data.brand.linkedin]);

  const scrollToSection = (href) => {
    navigate(href);
  };

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const closeAll = () => {
    clearHoverTimer();
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return h(
    "header",
    { className: "site-header" },
    h("div", { className: "header-shell" },
      h(InteractiveLogo, { brand: data.brand, navigate }),
      h("nav", { className: "desktop-nav", "aria-label": "Primary navigation" },
        navItems.map((item, index) => item.items
          ? h(
            "div",
            {
              key: item.label,
              className: "nav-dropdown",
              onMouseEnter: () => {
                clearHoverTimer();
                setOpenMenu(index);
              },
              onMouseLeave: () => {
                hoverTimer.current = setTimeout(() => setOpenMenu(null), 150);
              },
            },
            h(
              "button",
              {
                className: "nav-trigger",
                type: "button",
                "aria-expanded": openMenu === index,
                onClick: () => setOpenMenu(openMenu === index ? null : index),
              },
              item.label,
              h(Icon, { name: "chevronDown", size: 16 })
            ),
            openMenu === index && h(DropdownPanel, { items: item.items, onClose: closeAll, navigate })
          )
          : h("a", { key: item.label, className: "nav-link", href: item.href, onClick: (e) => { e.preventDefault(); scrollToSection(item.href); closeAll(); } }, item.label)
        )
      ),
      h("div", { className: "header-actions" },
        h("button", { className: "btn btn-primary", type: "button", onClick: () => onOpenApply("founder") },
          "Apply Now",
          h(Icon, { name: "arrowRight", size: 18 })
        ),
        h("button", {
          className: "icon-button menu-button",
          type: "button",
          "aria-label": mobileOpen ? "Close menu" : "Open menu",
          onClick: () => setMobileOpen(!mobileOpen),
        }, h(Icon, { name: mobileOpen ? "x" : "menu" }))
      )
    ),
    mobileOpen && h("nav", { className: "mobile-nav", "aria-label": "Mobile navigation" },
      navItems.map((item) => h("div", { className: "mobile-nav-group", key: item.label },
        item.items
          ? h(React.Fragment, null,
            h("span", { className: "mobile-nav-heading" }, item.label),
            item.items.map((child) => h("a", { key: child.label, href: child.href, onClick: (e) => { e.preventDefault(); child.href.startsWith("/") ? navigate(child.href) : scrollToSection(child.href); closeAll(); } }, child.label))
          )
          : h("a", { href: item.href, onClick: (e) => { e.preventDefault(); scrollToSection(item.href); closeAll(); } }, item.label)
      )),
      h("button", { className: "btn btn-primary mobile-apply", type: "button", onClick: () => onOpenApply("founder") },
        "Apply Now",
        h(Icon, { name: "arrowRight", size: 18 })
      )
    )
  );
}

function InteractiveLogo({ brand, navigate }) {
  return h(
    "a",
    {
      className: "logo-lockup",
      href: "#/",
      onClick: (e) => { e.preventDefault(); navigate("/"); },
      "aria-label": `${brand.name} home`,
    },
    h("img", { src: "/assets/qvscl-logo-white.png", alt: "", className: "logo-image" })
  );
}

function DropdownPanel({ items, onClose, navigate }) {
  const handleClick = (e, href) => {
    if (href.startsWith("http")) {
      e.preventDefault();
      window.open(href, "_blank", "noreferrer");
      onClose();
      return;
    }
    e.preventDefault();
    if (href.startsWith("/")) {
      navigate(href);
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    onClose();
  };

  return h("div", { className: "dropdown-panel" },
    items.map((item) => h("a", {
      key: item.label,
      className: "dropdown-item",
      href: item.href,
      onClick: (e) => handleClick(e, item.href),
    },
      h("span", null, item.label),
      h("small", null, item.body)
    ))
  );
}

function Hero({ data, loading, onOpenApply }) {
  return h("section", { className: "hero", id: "home" },
    h("video", { className: "hero-video", autoPlay: true, muted: true, loop: true, playsInline: true, preload: "auto" },
      h("source", { src: "/assets/hero-bg.mp4", type: "video/mp4" })
    ),
    h("div", { className: "hero-scrim" }),
    h("div", { className: "hero-content page-pad" },
      h("p", { className: "eyebrow" }, data.brand.tagline),
      h("h1", null, "QVSCL Accelerator"),
      h("p", { className: "hero-line" },
        "We build. We accelerate. We back the ",
        h("span", null, "future."),
      ),
      h("p", { className: "hero-copy" },
        loading
          ? "Loading the QVSCL startup blueprint..."
          : "QVSCL partners with ambitious founders to create high-impact startups and accelerate the journey from idea to industry leadership."
      ),
      h("div", { className: "hero-actions" },
        h("button", { className: "btn btn-primary", type: "button", onClick: () => onOpenApply("founder") },
          "Apply as Founder",
          h(Icon, { name: "arrowRight", size: 18 })
        ),
        h("button", { className: "btn btn-secondary", type: "button", onClick: () => onOpenApply("partner") },
          "Partner With Us",
          h(Icon, { name: "arrowRight", size: 18 })
        )
      )
    )
  );
}

function Metrics({ stats }) {
  return h("section", { className: "metrics page-pad", "aria-label": "QVSCL operating data" },
    stats.map((stat, i) => h("article", { className: "metric", key: i },
      h("strong", { key: stat.value }, stat.value),
      h("span", { key: stat.label }, stat.label),
      h("p", { key: stat.detail }, stat.detail)
    ))
  );
}

function AboutSection({ data }) {
  return h("section", { className: "about-section page-pad", id: "about" },
    h("div", { className: "section-heading scroll-in" },
      h("p", { className: "eyebrow" }, "Who We Are"),
      h("h2", null, "Building the Next Generation of High-Growth Startups")
    ),
    h("div", { className: "about-content" },
      h("p", null, "At QVSCL Accelerator, we work with ambitious founders who are building innovative businesses with the potential to create meaningful impact. Through structured programs, practical mentorship, and access to a growing network of industry experts, investors, and ecosystem partners, we help startups move from promising ideas to investment-ready ventures."),
      h("p", null, "Our focus is on supporting founders through the critical early stages of their journey—refining business models, validating markets, strengthening execution, and preparing for sustainable growth. Every startup has unique challenges, and our approach is designed to provide practical guidance tailored to each venture's needs."),
      h("p", null, "As part of the broader QVSCL ecosystem, we combine entrepreneurial support with strategic business insights, creating an environment where founders can learn, build, connect, and grow with confidence.")
    ),
    h("div", { className: "about-highlights" },
      h("div", { className: "highlight-item" },
        h("h3", null, "Founder-Centric Programs"),
        h("p", null, "Our programs are designed to help early-stage startups validate ideas, build scalable business models, and accelerate execution. Through expert-led workshops, one-on-one mentorship, peer learning, and structured milestones, founders receive practical support at every stage of their entrepreneurial journey.")
      ),
      h("div", { className: "highlight-item" },
        h("h3", null, "Access to Capital & Ecosystem"),
        h("p", null, "We connect promising startups with a growing network of investors, mentors, industry leaders, and strategic partners. By helping founders strengthen their investment readiness and build meaningful relationships, we aim to create opportunities for long-term growth and collaboration.")
      )
    )
  );
}

function ProgramSection({ programs, onOpenApply }) {
  return h("section", { className: "section page-pad", id: "programs" },
    h("div", { className: "section-heading scroll-in" },
      h("p", { className: "eyebrow" }, "What We Do"),
      h("h2", null, "Two ways QVSCL moves founders faster"),
      h("p", null, "A venture studio track for building from the ground up, and an accelerator track for startups ready to sharpen growth and funding execution.")
    ),
    h("div", { className: "program-grid" },
      programs.map((program) => h("article", {
        className: `program-card ${program.accent}`,
        key: program.title,
        onClick: () => onOpenApply(program.accent === "green" ? "studio" : "founder"),
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") onOpenApply(program.accent === "green" ? "studio" : "founder"); }
      },
        h("div", { className: "program-icon" }, h(Icon, { name: program.icon, size: 28 })),
        h("div", { className: "program-body" },
          h("p", { className: "program-eyebrow" }, program.eyebrow),
          h("h3", null, program.title),
          h("p", null, program.summary),
          h("ul", null,
            program.features.map((feature) => h("li", { key: feature },
              h(Icon, { name: "check", size: 16 }),
              h("span", null, feature)
            ))
          ),
          h("button", { className: "text-link", type: "button", onClick: (e) => { e.stopPropagation(); onOpenApply(program.accent === "green" ? "studio" : "founder"); } },
            program.accent === "green" ? "Explore Venture Studio" : "Explore Accelerator",
            h(Icon, { name: "arrowRight", size: 16 })
          )
        )
      ))
    )
  );
}

function PortfolioSection({ portfolio }) {
  return h("section", { className: "portfolio-section page-pad", id: "portfolio" },
    h("p", { className: "eyebrow scroll-in" }, "Companies We've Backed"),
    h("h2", { className: "scroll-in" }, "Portfolio signals from the QVSCL ecosystem"),
    h("p", { className: "portfolio-lead scroll-in" }, "A focused set of ventures from emergency assistance to learning infrastructure and workforce certification."),
    h("div", { className: "portfolio-strip" },
      portfolio.map((company) => h("article", {
        className: "portfolio-card",
        key: company.name,
        style: { "--brand-color": company.color }
      },
        h("div", { className: "portfolio-logo-wrap" },
          h("img", { className: "portfolio-logo", src: company.image, alt: `${company.name} logo` })
        ),
        h("div", { className: "portfolio-body" },
          h("div", { className: "portfolio-mark" }, company.name),
          h("h3", null, company.focus),
          h("p", { className: "portfolio-signal" }, company.signal),
          h("p", { className: "portfolio-detail" }, company.detail)
        )
      ))
    )
  );
}

function ApproachSection({ approach }) {
  return h("section", { className: "approach-section page-pad", id: "approach" },
    h("p", { className: "eyebrow scroll-in" }, "Our Approach"),
    h("h2", { className: "scroll-in" }, "Founder support that stays practical"),
    h("div", { className: "approach-grid" },
      approach.map((item) => h("article", { className: "approach-item", key: item.title },
        h("div", { className: "approach-icon" }, h(Icon, { name: item.icon, size: 22 })),
        h("h3", null, item.title),
        h("p", null, item.body)
      ))
    )
  );
}

function JourneySection({ journey }) {
  const [active, setActive] = useState(0);
  const selected = journey[active] || journey[0];
  const progressRef = useRef(null);
  const draggingRef = useRef(false);

  const getPhaseFromPosition = (clientX) => {
    const el = progressRef.current;
    if (!el) return active;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (journey.length - 1));
  };

  const handleStart = (clientX) => {
    draggingRef.current = true;
    setActive(getPhaseFromPosition(clientX));
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      setActive(getPhaseFromPosition(e.clientX));
    };
    const handleMouseUp = () => { draggingRef.current = false; };
    const handleTouchMove = (e) => {
      if (!draggingRef.current) return;
      setActive(getPhaseFromPosition(e.touches[0].clientX));
    };
    const handleTouchEnd = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return h("section", { className: "section journey page-pad", id: "journey" },
    h("div", { className: "section-heading compact scroll-in" },
      h("p", { className: "eyebrow" }, "Operating Blueprint"),
      h("h2", null, "From idea validation to investor readiness"),
      h("p", null, "Click a phase or drag the slider to explore the QVSCL accelerator rhythm.")
    ),
    h("div", { className: "journey-board" },
      h("div", { className: "journey-tabs", role: "tablist", "aria-label": "Founder journey phases" },
        journey.map((item, index) => h("button", {
          key: item.phase,
          className: `journey-tab ${active === index ? "active" : ""}`,
          type: "button",
          role: "tab",
          "aria-selected": active === index,
          onClick: () => setActive(index),
        },
          h("span", null, item.phase),
          item.title
        ))
      ),
      selected && h("article", { className: "journey-detail", role: "tabpanel" },
        h("span", null, selected.phase),
        h("h3", null, selected.title),
        h("p", null, selected.body),
        h("div", {
          className: "journey-progress",
          ref: progressRef,
          onMouseDown: (e) => handleStart(e.clientX),
          onTouchStart: (e) => handleStart(e.touches[0].clientX),
        },
          h("div", { className: "journey-progress-fill", style: { width: `${((active + 1) / journey.length) * 100}%` } }),
          h("div", { className: "journey-progress-thumb", style: { left: `${((active + 1) / journey.length) * 100}%` } })
        )
      )
    )
  );
}

function ResourcesEvents({ resources, events }) {
  return h("section", { className: "resource-event page-pad", id: "resources" },
    h("div", { className: "resource-column" },
      h("p", { className: "eyebrow scroll-in" }, "Resources"),
      h("h2", { className: "scroll-in" }, "Founder tools for the next decision"),
      h("div", { className: "resource-list" },
        resources.map((resource) => h("a", { className: "resource-row", key: resource.title, href: resource.href, onClick: (e) => { e.preventDefault(); window.open(resource.href, "_blank"); } },
          h("span", null, resource.type),
          h("div", null,
            h("h3", null, resource.title),
            h("p", null, resource.meta)
          ),
          h(Icon, { name: "arrowRight", size: 18 })
        ))
      )
    ),
    h("div", { className: "event-column", id: "events" },
      h("p", { className: "eyebrow scroll-in" }, "Events"),
      h("h2", { className: "scroll-in" }, "Upcoming accelerator moments"),
      h("div", { className: "event-list" },
        events.map((event) => h("article", { className: "event-row", key: event.title },
          h("time", null, event.date),
          h("div", null,
            h("h3", null, event.title),
            h("p", null, event.mode)
          )
        ))
      )
    )
  );
}

function ContactSection({ data }) {
  const address = data?.brand?.address || "5th floor, Adani Miracle Miles, 507, Sector 60, Gurugram, Haryana 122098";
  const mapsLink = "https://www.google.com/maps/place/QVSCL/@28.4009696,77.0912222,17z/data=!4m10!1m2!2m1!1s5th+floor,+Adani+Miracle+Miles,+507,+Sector+60,+Gurugram,+Haryana+122098!3m6!1s0x390d23d23468a4a9:0xc8ea4ae2ed8241a6!8m2!3d28.4010771!4d77.0933375!15sCkg1dGggZmxvb3IsIEFkYW5pIE1pcmFjbGUgTWlsZXMsIDUwNywgU2VjdG9yIDYwLCBHdXJ1Z3JhbSwgSGFyeWFuYSAxMjIwOThaRSJDNXRoIGZsb29yIGFkYW5pIG1pcmFjbGUgbWlsZXMgNTA3IHNlY3RvciA2MCBndXJ1Z3JhbSBoYXJ5YW5hIDEyMjA5OJIBHmJ1c2luZXNzX21hbmFnZW1lbnRfY29uc3VsdGFudJoBI0NoWkRTVWhOTUc5blMwVk9hV3h6TjI1aE16aDFXVnBuRUFF4AEA-gEECAAQPg!16s%2Fg%2F11x8w0hcc9?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D";
  const mapsEmbed = "https://maps.google.com/maps?q=QVSCL+Gurugram&z=17&output=embed";
  const phone = data?.brand?.phone || "9810646388";
  const email = data?.brand?.email || "info@qvscl.com";
  const linkedin = data?.brand?.linkedin || "https://www.linkedin.com/company/qvscl-accelerator-venture-studio/about/";

  return h("section", { className: "contact-section page-pad", id: "contact" },
    h("div", { className: "contact-info" },
      h("p", { className: "eyebrow scroll-in" }, "Get in Touch"),
      h("h2", { className: "scroll-in" }, "Let's build the future together"),
      h("div", { className: "contact-item" },
        h("strong", null, "📧 Email"),
        h("p", null,
          h("a", { href: `mailto:${email}` }, email)
        )
      ),
      h("div", { className: "contact-item" },
        h("strong", null, "📞 Phone"),
        h("p", null,
          h("a", { href: `tel:${phone.replace(/[^0-9+]/g, '')}` }, phone)
        )
      ),
      h("div", { className: "contact-item" },
        h("strong", null, "📍 Address"),
        h("p", null,
          h("a", { href: mapsLink, target: "_blank", rel: "noreferrer", className: "address-link" }, address)
        )
      ),
      h("div", { className: "contact-item" },
        h("strong", null, "🔗 Connect"),
        h("p", null,
          h("a", { href: linkedin, target: "_blank", rel: "noreferrer" }, "Visit us on LinkedIn")
        )
      )
    ),
    h("div", { className: "map-container" },
      h("a", { href: mapsLink, target: "_blank", rel: "noreferrer", className: "map-link", title: "Open in Google Maps" },
        h("iframe", {
          title: "QVSCL Office Location",
          src: mapsEmbed,
          width: "100%",
          height: "100%",
          style: { border: 0 },
          allowFullScreen: true,
          loading: "lazy",
          referrerPolicy: "no-referrer-when-downgrade",
        })
      )
    )
  );
}

function FounderCTA({ onOpenApply }) {
  return h("section", { className: "founder-cta", id: "apply" },
    h("div", { className: "cta-glow-orb cta-glow-1" }),
    h("div", { className: "cta-glow-orb cta-glow-2" }),
    h("div", { className: "cta-inner page-pad" },
      h("div", { className: "cta-header scroll-in" },
        h("p", { className: "eyebrow" }, "Let's Build Together"),
        h("h2", null, "Bring your startup, thesis, or ecosystem partnership to QVSCL"),
        h("p", { className: "cta-sub" }, "Whether you're a founder with a bold idea or an organization looking to collaborate — QVSCL is your unfair advantage in the journey from idea to investor-ready.")
      ),
      h("div", { className: "cta-cards" },
        h("article", { className: "cta-card cta-card-founder" },
          h("div", { className: "cta-card-icon" },
            h(Icon, { name: "rocket", size: 28 })
          ),
          h("h3", null, "Apply as a Founder"),
          h("p", null, "Co-build your startup from idea to launch. Get mentorship, funding access, and a dedicated growth team."),
          h("ul", { className: "cta-perks" },
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Venture studio & accelerator track")),
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Mentor network + investor access")),
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "12-week cohort blueprint"))
          ),
          h("button", { className: "cta-card-btn cta-btn-green", type: "button", onClick: () => onOpenApply("founder") },
            "Apply Now",
            h(Icon, { name: "arrowRight", size: 16 })
          )
        ),
        h("article", { className: "cta-card cta-card-partner" },
          h("div", { className: "cta-card-icon cta-icon-violet" },
            h(Icon, { name: "handshake", size: 28 })
          ),
          h("h3", null, "Partner with QVSCL"),
          h("p", null, "Join as a corporate partner, angel investor, or ecosystem collaborator and co-shape India's next startup wave."),
          h("ul", { className: "cta-perks" },
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Portfolio co-investment opportunities")),
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Exclusive deal flow access")),
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Strategic advisory relationships"))
          ),
          h("button", { className: "cta-card-btn cta-btn-violet", type: "button", onClick: () => onOpenApply("partner") },
            "Partner With Us",
            h(Icon, { name: "arrowRight", size: 16 })
          )
        ),
        h("article", { className: "cta-card cta-card-studio" },
          h("div", { className: "cta-card-icon cta-icon-gold" },
            h(Icon, { name: "layers", size: 28 })
          ),
          h("h3", null, "Explore Venture Studio"),
          h("p", null, "Have an idea but no team yet? QVSCL's venture studio co-builds startups from scratch with you as founding partner."),
          h("ul", { className: "cta-perks" },
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Co-founding & equity structure")),
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Team building & product development")),
            h("li", null, h(Icon, { name: "check", size: 14 }), h("span", null, "Go-to-market from day one"))
          ),
          h("button", { className: "cta-card-btn cta-btn-gold", type: "button", onClick: () => onOpenApply("studio") },
            "Explore Studio",
            h(Icon, { name: "arrowRight", size: 16 })
          )
        )
      )
    )
  );
}

function InsightsPage({ navigate }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/blogs`)
      .then((r) => r.json())
      .then((data) => { if (active) setBlogs(data); })
      .catch(() => { if (active) setBlogs([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categoryColors = {
    "Founder Insights": "var(--green)",
    "Venture Building": "var(--violet)",
    "Operations": "var(--gold)",
    "Programs": "var(--green)",
    "Fundraising": "var(--violet-hi)",
    "General": "var(--muted)",
  };

  return h("main", { className: "insights-page page-pad" },
    h("div", { className: "insights-header" },
      h("p", { className: "eyebrow" }, "QVSCL Insights"),
      h("h1", null, "Ideas that work"),
      h("p", { className: "insights-subtitle" }, "Perspectives on venture building, fundraising, and growing startups that matter.")
    ),
    loading
      ? h("div", { className: "insights-loading" }, "Loading insights...")
      : blogs.length === 0
        ? h("div", { className: "insights-empty" }, "No insights published yet. Check back soon.")
        : h("div", { className: "insights-grid" },
          blogs.map((blog) =>
            h("article", {
              key: blog.id,
              className: "blog-card",
              style: { "--cat-color": categoryColors[blog.category] || "var(--green)" },
              onClick: () => navigate(`/insights/${blog.slug}`),
              role: "button",
              tabIndex: 0,
              onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") navigate(`/insights/${blog.slug}`); },
            },
              h("div", { className: "blog-card-image" },
                h("img", {
                  src: blog.image,
                  alt: "",
                  loading: "lazy",
                  onError: (e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.classList.add("blog-card-img-fallback");
                  },
                }),
                h("span", { className: "blog-card-category", style: { background: categoryColors[blog.category] || "var(--green)" } }, blog.category)
              ),
              h("div", { className: "blog-card-body" },
                h("h3", null, blog.title),
                h("p", { className: "blog-card-excerpt" }, blog.excerpt),
                h("div", { className: "blog-card-meta" },
                  h("span", null, blog.author),
                  h("span", null, formatDate(blog.date)),
                ),
                h("a", { className: "text-link", href: `/insights/${blog.slug}`, onClick: (e) => { e.preventDefault(); navigate(`/insights/${blog.slug}`); } },
                  "Read More",
                  h(Icon, { name: "arrowRight", size: 16 })
                )
              )
            )
          )
        )
  );
}

function BlogPostPage({ slug, navigate }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/blogs/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Blog not found");
        return r.json();
      })
      .then((data) => { if (active) setBlog(data); })
      .catch(() => { if (active) setBlog(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return h("main", { className: "blog-post-page page-pad" },
      h("div", { className: "blog-post-loading" }, "Loading article...")
    );
  }

  if (!blog) {
    return h("main", { className: "blog-post-page page-pad" },
      h("div", { className: "blog-post-error" },
        h("h1", null, "Article not found"),
        h("p", null, "The insight you're looking for doesn't exist or has been removed."),
        h("a", { className: "btn btn-primary", href: "/insights", onClick: (e) => { e.preventDefault(); navigate("/insights"); } }, "Back to Insights")
      )
    );
  }

  return h("main", { className: "blog-post-page page-pad" },
    h("div", { className: "blog-post-back" },
      h("a", { className: "text-link", href: "/insights", onClick: (e) => { e.preventDefault(); navigate("/insights"); } },
        h(Icon, { name: "arrowRight", size: 16, className: "back-arrow" }),
        "Back to Insights"
      )
    ),
    blog.image && h("div", { className: "blog-post-cover" },
      h("img", {
        src: blog.image,
        alt: blog.title,
        onError: (e) => {
          e.target.style.display = "none";
          e.target.parentElement.classList.add("blog-post-cover-fallback");
        },
      })
    ),
    h("article", { className: "blog-post-article" },
      h("div", { className: "blog-post-meta" },
        blog.category && h("span", { className: "blog-post-category" }, blog.category),
        h("span", null, blog.author),
        h("span", null, formatDate(blog.date)),
      ),
      h("h1", null, blog.title),
      h("div", { className: "blog-post-content", dangerouslySetInnerHTML: { __html: blog.content } }),
    ),
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const legalContent = {
  privacy: {
    title: "Privacy Policy",
    body: [
      { heading: "Information We Collect", text: "We collect personal information you voluntarily provide when you fill out forms on our website, including your name, email address, phone number, and company details. We also collect anonymized usage data such as page views, browser type, and device information to improve our website experience." },
      { heading: "How We Use Your Information", text: "The information we collect is used to respond to your inquiries, process applications for our accelerator and venture studio programs, send relevant updates about our programs and events, improve our website and services based on usage patterns, and comply with legal obligations." },
      { heading: "Data Sharing and Disclosure", text: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted partners who assist us in operating our website and programs, provided they agree to keep your information confidential. We may also disclose information when required by law." },
      { heading: "Data Security", text: "We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security." },
      { heading: "Cookies", text: "We use essential cookies to ensure the proper functioning of our website. We may also use analytics cookies to understand how visitors interact with our site. You can control cookie preferences through your browser settings." },
      { heading: "Your Rights", text: "You have the right to access, correct, or delete your personal information held by us. You may also withdraw consent for communications at any time by contacting us at info@qvscl.com." },
      { heading: "Changes to This Policy", text: "We may update this privacy policy from time to time. Any changes will be posted on this page with the updated effective date." },
      { heading: "Contact Us", text: "If you have any questions about this Privacy Policy, please contact us at info@qvscl.com or at our registered address: 5th floor, Adani Miracle Miles, 507, Sector 60, Gurugram, Haryana 122098." },
    ],
  },
  terms: {
    title: "Terms of Use",
    body: [
      { heading: "Acceptance of Terms", text: "By accessing and using the QVSCL Accelerator website, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should not use our website or services." },
      { heading: "Services Description", text: "QVSCL Accelerator & Venture Studio provides startup acceleration programs, venture studio services, mentorship, and access to investor networks. The specific terms of each program are outlined in separate program agreements." },
      { heading: "Eligibility", text: "Our programs are open to founders, entrepreneurs, and startups that meet the criteria specified in each program application. We reserve the right to accept or reject any application at our discretion." },
      { heading: "Intellectual Property", text: "All content on this website, including text, graphics, logos, and software, is the property of QVSCL Accelerator unless otherwise stated. You may not reproduce, distribute, or modify any content without prior written consent." },
      { heading: "Application and Program Participation", text: "Submitting an application does not guarantee acceptance into any program. Participants selected for programs must comply with all program rules, timelines, and obligations as outlined in their program agreement." },
      { heading: "Limitation of Liability", text: "QVSCL Accelerator shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or participation in our programs. Our total liability shall not exceed the fees paid by you, if any, for our services." },
      { heading: "Third-Party Links", text: "Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of those websites." },
      { heading: "Modifications", text: "We reserve the right to modify these Terms of Use at any time. Continued use of the website after changes constitutes acceptance of the new terms." },
      { heading: "Governing Law", text: "These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Gurugram, Haryana." },
    ],
  },
};

function LegalPage({ type, navigate }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const content = legalContent[type];
  return h("main", { className: "legal-page page-pad" },
    h("div", { className: "legal-back" },
      h("a", { className: "text-link", href: "/", onClick: (e) => { e.preventDefault(); navigate("/"); } },
        h(Icon, { name: "arrowRight", size: 16, className: "back-arrow" }),
        "Back to Home"
      )
    ),
    h("h1", null, content.title),
    h("hr", { className: "legal-divider" }),
    content.body.map((section, i) =>
      h("div", { className: "legal-section", key: i },
        h("h2", null, section.heading),
        h("p", null, section.text)
      )
    ),
    h("div", { className: "legal-footer" },
      h("p", null, "© 2026 QVSCL Accelerator & Venture Studio. All rights reserved.")
    )
  );
}

function Footer({ data, onOpenApply, navigate }) {
  return h("footer", { className: "site-footer" },
    h("div", { className: "footer-top page-pad" },
      h("div", { className: "footer-brand" },
        h(InteractiveLogo, { brand: data.brand, navigate }),
        h("p", null, "Building and accelerating the next generation of impact-driven startups."),
        h("div", { className: "social-links" },
          h("a", { href: data.brand.linkedin, target: "_blank", rel: "noreferrer", "aria-label": "QVSCL on LinkedIn" },
            h(Icon, { name: "linkedin", size: 18 })
          ),
          h("a", { href: `mailto:${data.brand.email}`, "aria-label": "Email QVSCL" },
            h(Icon, { name: "mail", size: 18 })
          )
        )
      ),
      h("div", { className: "footer-links" },
        h(FooterColumn, { title: "Company", links: [{ label: "About Us", href: "#about" }, { label: "Blog", href: "/insights" }], navigate }),
        h(FooterColumn, { title: "Programs", links: [{ label: "Venture Studio", href: "#programs" }, { label: "Accelerator", href: "#programs" }], navigate })
      ),
      h("div", { className: "footer-contact" },
        h("h3", null, "Contact Info"),
        h("p", null,
          h("strong", null, "Email: "),
          h("a", { href: `mailto:${data.brand.email}` }, data.brand.email)
        ),
        h("p", null,
          h("strong", null, "Phone: "),
          data.brand.phone
        ),
        h("p", null,
          h("strong", null, "Address: "),
          h("br"),
          data.brand.address
        )
      )
    ),
    h("div", { className: "footer-bottom page-pad" },
      h("span", null, "© 2026 QVSCL Accelerator & Venture Studio. All rights reserved."),
      h("a", { href: "/privacy-policy", onClick: (e) => { e.preventDefault(); navigate("/privacy-policy"); } }, "Privacy Policy"),
      h("a", { href: "/terms-of-use", onClick: (e) => { e.preventDefault(); navigate("/terms-of-use"); } }, "Terms of Use")
    )
  );
}

function FooterColumn({ title, links, navigate }) {
  return h("div", { className: "footer-column" },
    h("h3", null, title),
    links.map((link) =>
      link.href.startsWith("/")
        ? h("a", { key: link.label, href: link.href, onClick: (e) => { e.preventDefault(); navigate(link.href); } }, link.label)
        : h("a", { key: link.label, href: link.href, onClick: (e) => { e.preventDefault(); navigate(link.href); } }, link.label)
    )
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "Saving..." });
    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to save email.");
      setEmail("");
      setStatus({ state: "success", message: payload.message });
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  };

  return h("form", { className: "newsletter-form", onSubmit: submit },
    h("label", { className: "sr-only", htmlFor: "newsletter-email" }, "Email address"),
    h("input", {
      id: "newsletter-email",
      type: "email",
      placeholder: "Enter your email",
      value: email,
      onChange: (event) => setEmail(event.target.value),
      required: true,
    }),
    h("button", { className: "icon-submit", type: "submit", "aria-label": "Subscribe to newsletter" },
      h(Icon, { name: "arrowRight", size: 18 })
    ),
    status.message && h("p", { className: `form-status ${status.state}` }, status.message)
  );
}

function ApplicationModal({ mode, onClose }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({
    interest: modeLabel(mode),
    name: "",
    email: "",
    company: "",
    stage: "Idea stage",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => dialogRef.current?.querySelector("input")?.focus(), 0);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "Sending application..." });
    try {
      const response = await fetch(`${API_BASE_URL}/api/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to submit application.");
      setStatus({ state: "success", message: payload.message });
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  };

  return h("div", {
    className: "modal-backdrop", role: "presentation", onMouseDown: (event) => {
      if (event.target === event.currentTarget) onClose();
    }
  },
    h("section", { className: "application-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", ref: dialogRef },
      h("button", { className: "icon-button close-button", type: "button", onClick: onClose, "aria-label": "Close application form" },
        h(Icon, { name: "x" })
      ),
      h("p", { className: "eyebrow" }, "QVSCL Intake"),
      h("h2", { id: "modal-title" }, modeLabel(mode)),
      h("form", { className: "application-form", onSubmit: submit },
        h("label", null,
          "Name",
          h("input", {
            value: form.name,
            onChange: (event) => updateField("name", event.target.value),
            required: true,
          })
        ),
        h("label", null,
          "Email",
          h("input", {
            type: "email",
            value: form.email,
            onChange: (event) => updateField("email", event.target.value),
            required: true,
          })
        ),
        h("label", null,
          "Company or idea",
          h("input", {
            value: form.company,
            onChange: (event) => updateField("company", event.target.value),
            placeholder: "Startup name, thesis, or partner org",
          })
        ),
        h("label", null,
          "Stage",
          h("select", {
            value: form.stage,
            onChange: (event) => updateField("stage", event.target.value),
          },
            ["Idea stage", "MVP", "Early revenue", "Scaling", "Partnership"].map((option) => h("option", { key: option }, option))
          )
        ),
        h("label", { className: "full-span" },
          "What should QVSCL know?",
          h("textarea", {
            rows: 4,
            value: form.message,
            onChange: (event) => updateField("message", event.target.value),
            placeholder: "Tell us about the problem, traction, or collaboration goal.",
          })
        ),
        h("button", { className: "btn btn-primary full-span", type: "submit" },
          status.state === "loading" ? "Submitting..." : "Submit Blueprint",
          h(Icon, { name: "arrowRight", size: 18 })
        ),
        status.message && h("p", { className: `form-status ${status.state} full-span` }, status.message)
      )
    )
  );
}

function modeLabel(mode) {
  if (mode === "partner") return "Partner With QVSCL";
  if (mode === "studio") return "Explore Venture Studio";
  return "Apply as Founder";
}

function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    // --- Orbs (large animated glows) ---
    const orbs = [
      { x: 0.12, y: 0.20, r: 0.38, color: [6, 180, 80], speed: 0.00007, phase: 0 },
      { x: 0.88, y: 0.75, r: 0.32, color: [4, 130, 60], speed: 0.00009, phase: 2.1 },
      { x: 0.45, y: 0.55, r: 0.26, color: [20, 200, 120], speed: 0.00006, phase: 4.2 },
      { x: 0.75, y: 0.15, r: 0.18, color: [61, 214, 140], speed: 0.00007, phase: 1.5 },
    ];

    // --- Particles ---
    const COUNT = 80;
    const MAX_DIST = 120;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.4,
      });
    }

    let t = 0;
    const draw = () => {
      t += 1;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Draw glow orbs
      orbs.forEach(orb => {
        const wave = Math.sin(t * orb.speed * 1000 + orb.phase);
        const cx = (orb.x + wave * 0.06) * W;
        const cy = (orb.y + Math.cos(t * orb.speed * 800 + orb.phase) * 0.08) * H;
        const radius = orb.r * Math.max(W, H);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const [r, g, b] = orb.color;
        grad.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},0.08)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Move + wrap particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });

      // Particle lines
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(61,214,140,${(1 - dist / MAX_DIST) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particle dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61,214,140,0.55)`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return h("canvas", { id: "particles-canvas", ref: canvasRef });
}

createRoot(document.getElementById("root")).render(h(App));
