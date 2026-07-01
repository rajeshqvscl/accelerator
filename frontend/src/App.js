import React, { useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

// Set this to your Render backend URL when deploying separately (e.g., "https://your-backend.onrender.com")
const API_BASE_URL = "https://accelerator-backend.onrender.com";

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
    { value: "50+", label: "Portfolio Companies", detail: "Building the future ecosystem" },
    { value: "₹500Cr+", label: "Capital Deployed", detail: "Across promising ventures" },
    { value: "85%", label: "Follow-on Rate", detail: "Founder success ratio" },
    { value: "18mo", label: "Avg to Series A", detail: "Accelerated timeline" },
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

    const elements = document.querySelectorAll(".scroll-in, .metric, .program-card, .highlight-item, .portfolio-card, .approach-item, .event-row, .resource-row");
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  return h(
    React.Fragment,
    null,
    h(Header, { data, onOpenApply: setModalMode }),
    h("main", null,
      h(Hero, { data, loading, onOpenApply: setModalMode }),
      h(Metrics, { stats: data.stats }),
      h(AboutSection, { data }),
      h(ProgramSection, { programs: data.programs, onOpenApply: setModalMode }),
      h(PortfolioApproach, { portfolio: data.portfolio, approach: data.approach }),
      h(JourneySection, { journey: data.journey }),
      h(ResourcesEvents, { resources: data.resources, events: data.events }),
      h(FounderCTA, { onOpenApply: setModalMode }),
      h(ContactSection, { data })
    ),
    h(Footer, { data, onOpenApply: setModalMode }),
    modalMode && h(ApplicationModal, { mode: modalMode, onClose: () => setModalMode(null) })
  );
}

function Header({ data, onOpenApply }) {
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
        { label: "Founder Support", href: "#journey", body: "Validation, GTM, funding, and scale." },
      ],
    },
    {
      label: "Programs",
      items: [
        { label: "Studio Build Sprint", href: "#journey", body: "Hands-on venture building rhythm." },
        { label: "Cohort Accelerator", href: "#journey", body: "A 12-week investor readiness path." },
        { label: "Mentor Network", href: "#approach", body: "Expert access across functions." },
      ],
    },
    { label: "Portfolio", href: "#portfolio" },
    {
      label: "Resources",
      items: [
        { label: "Guides", href: "#resources", body: "Founder playbooks and checklists." },
        { label: "Events", href: "#events", body: "Office hours, workshops, demo prep." },
        { label: "LinkedIn", href: data.brand.linkedin, body: "Follow QVSCL company updates." },
      ],
    },
    { label: "Contact", href: "#contact" },
  ], [data.brand.linkedin]);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
      h(InteractiveLogo, { brand: data.brand }),
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
            openMenu === index && h(DropdownPanel, { items: item.items, onClose: closeAll })
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
            item.items.map((child) => h("a", { key: child.label, href: child.href, onClick: (e) => { e.preventDefault(); scrollToSection(child.href); closeAll(); } }, child.label))
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

function InteractiveLogo({ brand }) {
  return h(
    "a",
    {
      className: "logo-lockup",
      href: "#home",
      onClick: (e) => { e.preventDefault(); document.querySelector("#home").scrollIntoView({ behavior: "smooth" }); },
      "aria-label": `${brand.name} home`,
    },
    h("img", { src: "/assets/qvscl-logo-white.png", alt: "", className: "logo-image" })
  );
}

function DropdownPanel({ items, onClose }) {
  const handleClick = (e, href) => {
    if (!href.startsWith("http")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    onClose();
  };

  return h("div", { className: "dropdown-panel" },
    items.map((item) => h("a", {
      key: item.label,
      className: "dropdown-item",
      href: item.href,
      onClick: (e) => handleClick(e, item.href),
      target: item.href.startsWith("http") ? "_blank" : undefined,
      rel: item.href.startsWith("http") ? "noreferrer" : undefined,
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
    stats.map((stat) => h("article", { className: "metric", key: stat.label },
      h("strong", null, stat.value),
      h("span", null, stat.label),
      h("p", null, stat.detail)
    ))
  );
}

function AboutSection({ data }) {
  return h("section", { className: "about-section page-pad", id: "about" },
    h("div", { className: "section-heading scroll-in" },
      h("p", { className: "eyebrow" }, "Who We Are"),
      h("h2", null, "Your Trusted Partner for Capital Growth")
    ),
    h("div", { className: "about-content" },
      h("p", null, "At QVSCL, we go beyond traditional consulting and investment banking—we serve as trusted strategic partners, committed to guiding your business toward sustained growth and success. With a comprehensive understanding of financial markets, corporate strategy, and industry dynamics, we help businesses navigate challenges, seize opportunities, and realize their full potential."),
      h("p", null, "From securing capital and executing mergers and acquisitions to refining business strategies, we provide tailored, results-driven solutions designed to create lasting impact."),
      h("p", null, "Our approach is grounded in expertise, innovation, and strategic foresight. We don't simply offer advice; we collaborate with you, aligning our insights with your vision, mitigating risks, and crafting solutions that generate real value. With access to a strong global network, in-depth market intelligence, and proven execution capabilities, we empower organizations to remain competitive in an ever-changing business environment.")
    ),
    h("div", { className: "about-highlights" },
      h("div", { className: "highlight-item" },
        h("h3", null, "Strategic Consulting for a Competitive Edge"),
        h("p", null, "Having a clear and effective strategy is essential. Our consulting services focus on corporate finance and strategic advisory, providing organizations with the insights needed to navigate complexities, improve efficiency, and achieve long-term growth. From capital structuring and cost optimization to business transformation, we deliver actionable solutions that help our clients stay ahead of the competition.")
      ),
      h("div", { className: "highlight-item" },
        h("h3", null, "Investment Banking Excellence"),
        h("p", null, "Specializing in equity funding, mergers & acquisitions (M&A), and private equity advisory, we ensure that businesses have access to the right capital, strategic investors, and transformative opportunities. Our expertise lies in structuring deals that drive growth, optimize financial performance, and unlock new avenues for success.")
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
      programs.map((program) => h("article", { className: `program-card ${program.accent}`, key: program.title },
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
          h("button", { className: "text-link", type: "button", onClick: () => onOpenApply(program.accent === "green" ? "studio" : "founder") },
            program.accent === "green" ? "Explore Venture Studio" : "Explore Accelerator",
            h(Icon, { name: "arrowRight", size: 16 })
          )
        )
      ))
    )
  );
}

function PortfolioApproach({ portfolio, approach }) {
  return h("section", { className: "split-section page-pad", id: "portfolio" },
    h("div", { className: "portfolio-panel" },
      h("p", { className: "eyebrow scroll-in" }, "Companies We've Backed"),
      h("h2", { className: "scroll-in" }, "Portfolio signals from the QVSCL ecosystem"),
      h("p", { className: "scroll-in" }, "A focused set of ventures from emergency assistance to learning infrastructure and workforce certification."),
      h("div", { className: "portfolio-strip" },
        portfolio.map((company) => h("article", { className: "portfolio-card", key: company.name, style: { "--brand-color": company.color } },
          h("img", { className: "portfolio-logo", src: company.image, alt: `${company.name} logo` }),
          h("div", { className: "portfolio-mark" }, company.name),
          h("h3", null, company.focus),
          h("p", { className: "portfolio-signal" }, company.signal),
          h("p", { className: "portfolio-detail" }, company.detail)
        ))
      ),
      h("a", { className: "text-link", href: "#contact" },
        "View Portfolio",
        h(Icon, { name: "arrowRight", size: 16 })
      )
    ),
    h("div", { className: "approach-panel", id: "approach" },
      h("p", { className: "eyebrow scroll-in" }, "Our Approach"),
      h("h2", { className: "scroll-in" }, "Founder support that stays practical"),
      h("div", { className: "approach-grid" },
        approach.map((item) => h("article", { className: "approach-item", key: item.title },
          h("div", { className: "approach-icon" }, h(Icon, { name: item.icon, size: 22 })),
          h("h3", null, item.title),
          h("p", null, item.body)
        ))
      )
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
  return h("section", { className: "cta-band page-pad", id: "contact" },
    h("div", null,
      h("p", { className: "eyebrow scroll-in" }, "Let's Build Together"),
      h("h2", { className: "scroll-in" }, "Bring QVSCL your startup, thesis, or ecosystem partnership."),
      h("p", { className: "scroll-in" }, "Whether you are a founder with a bold idea or an organization looking to collaborate, QVSCL can help shape the next execution step.")
    ),
    h("button", { className: "btn btn-primary", type: "button", onClick: () => onOpenApply("founder") },
      "Get in Touch",
      h(Icon, { name: "arrowRight", size: 18 })
    )
  );
}

function Footer({ data, onOpenApply }) {
  return h("footer", { className: "site-footer" },
    h("div", { className: "footer-top page-pad" },
      h("div", { className: "footer-brand" },
        h(InteractiveLogo, { brand: data.brand }),
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
        h(FooterColumn, { title: "Company", links: ["About Us", "Our Team", "Careers", "Blog"] }),
        h(FooterColumn, { title: "Programs", links: ["Venture Studio", "Accelerator", "Bootcamps", "Mentorship"] }),
        h(FooterColumn, { title: "Resources", links: ["Guides", "Templates", "Articles", "FAQ"] })
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
      h("span", null, "Privacy Policy"),
      h("span", null, "Terms of Use")
    )
  );
}

function FooterColumn({ title, links }) {
  return h("div", { className: "footer-column" },
    h("h3", null, title),
    links.map((link) => h("a", { key: link, href: "#home" }, link))
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

createRoot(document.getElementById("root")).render(h(App));
