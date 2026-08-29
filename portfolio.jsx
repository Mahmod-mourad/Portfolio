import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";

/* ─── THEME TOKENS ──────────────────────────────────────── */
const T = {
  bg: "#09090b",
  glassBg: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassHover: "rgba(255, 255, 255, 0.06)",
  glassBorderHover: "rgba(255, 255, 255, 0.2)",
  textMain: "#f8fafc",
  textMuted: "#94a3b8",
  accent1: "#c084fc", // Violet
  accent2: "#22d3ee", // Cyan
  fontHeading: "'Outfit', sans-serif",
  fontBody: "'Inter', sans-serif",
  fontMono: "'Fira Code', monospace",
};

/* ─── FX COMPONENTS ──────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{ scaleX, position: "fixed", top: 0, left: 0, right: 0, height: "3px", transformOrigin: "0 0", background: "linear-gradient(90deg, #c084fc, #22d3ee)", zIndex: 200, borderRadius: "0 0 4px 0" }} />
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [on, setOn] = useState(false);
  useEffect(() => {
    const move = (e) => { setPos({ x: e.clientX, y: e.clientY }); if (!on) setOn(true); };
    const leave = () => setOn(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", leave);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseout", leave); };
  }, [on]);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: 520, height: 520, pointerEvents: "none", zIndex: 1,
      opacity: on ? 1 : 0, transition: "opacity 0.35s",
      transform: `translate(${pos.x - 260}px, ${pos.y - 260}px)`,
      background: "radial-gradient(circle, rgba(192,132,252,0.08) 0%, rgba(34,211,238,0.05) 38%, transparent 68%)",
      borderRadius: "50%",
    }} />
  );
}

function Typewriter({ words }) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[idx % words.length];
    const t = setTimeout(() => {
      if (!del) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDel(true), 1250);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") { setDel(false); setIdx((i) => i + 1); }
      }
    }, del ? 42 : 85);
    return () => clearTimeout(t);
  }, [text, del, idx, words]);
  return <span>{text}<span className="tw-cursor">|</span></span>;
}

function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Tilt({ children, max = 7 }) {
  const ref = useRef(null);
  const [tr, setTr] = useState({ rX: 0, rY: 0 });
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTr({ rY: px * max * 2, rX: -py * max * 2 });
  };
  const onLeave = () => setTr({ rX: 0, rY: 0 });
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: "1100px" }}>
      <div style={{ transform: `rotateX(${tr.rX}deg) rotateY(${tr.rY}deg)`, transition: "transform 0.18s ease-out", transformStyle: "preserve-3d", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── DATA ───────────────────────────────────────────────── */
const NAV_LINKS = ["About", "Experience", "Projects", "Education", "Skills", "Contact"];

const EXPERIENCE = [
  {
    company: "Vibe Fusion UG",
    url: "#",
    title: "Senior Software Developer",
    range: "September 2025 – Present",
    location: "Remote · Germany",
    bullets: [
      "Developed and maintained a cross-platform booking app — React Native mobile, Next.js admin dashboard, and Node.js + Supabase backend.",
      "Collaborated with cross-functional teams including developers, designers, testers, and analysts to deliver software enhancements and new modules.",
      "Applied agile methodologies, participated in sprint planning, and contributed to process improvement initiatives.",
      "Reduced deployment time by 50% through effective micro service separation and automated pipelines.",
    ],
    tech: ["React Native", "Next.js", "Node.js", "Supabase", "React"],
  },
  {
    company: "NextLogix",
    url: "#",
    title: "Software Developer",
    range: "February 2025 – September 2025",
    location: "6th of October City · Egypt",
    bullets: [
      "Delivered two full-stack products: an ERP system and a clinic management platform for healthcare providers.",
      "Built with React and Next.js frontends, Node.js and NestJS backends, PostgreSQL and MongoDB databases.",
      "Improved system performance by 25% by optimizing database queries and streamlining backend processes.",
      "Ensured responsive UI and scalable backend to support high traffic volumes.",
    ],
    tech: ["NestJS", "Node.js", "React", "Next.js", "PostgreSQL", "MongoDB"],
  },
  {
    company: "Asass Elamal",
    url: "#",
    title: "Software Developer",
    range: "October 2023 – January 2025",
    location: "Remote · Saudi Arabia",
    bullets: [
      "Built the frontend for a real estate platform: property listings, search & filter, and residential unit sales.",
      "Created a reusable TypeScript component library with Tailwind CSS adopted across multiple product teams.",
      "Integrated RESTful APIs with robust error handling, caching, and loading states.",
      "Improved page load performance through lazy loading, code splitting, and rendering optimisations.",
    ],
    tech: ["React.js", "TypeScript", "Tailwind CSS", "REST APIs", "Next.js"],
  },
];

const PROJECTS = [
  {
    title: "NexMart",
    solves: "Most product demos online are a handful of mocked components. This is a full shop — catalogue with search, filters and pagination, cart and wishlist, Stripe checkout, order history and an admin dashboard. Payments are settled by a server-side webhook, and stock is reserved inside the order transaction so two shoppers can't race the last unit.",
    tech: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS"],
    github: "https://github.com/Mahmod-mourad/e-commerce-platform-NexMart",
    live: "https://nexmart.vercel.app",
    emoji: "\uD83D\uDED2",
    gallery: [
      ["screenshots/nexmart/home.png", "Home — hero, featured products, categories, deals"],
      ["screenshots/nexmart/products.png", "Product listing — search, filters, pagination"],
      ["screenshots/nexmart/product-detail.png", "Product page — gallery, reviews, related items"],
      ["screenshots/nexmart/cart.png", "Cart — quantities, order summary"],
    ],
    run: [
      "# The quick route — one command brings up Postgres, migrations, seed data and the app.",
      "git clone https://github.com/Mahmod-mourad/e-commerce-platform-NexMart.git",
      "cd e-commerce-platform-NexMart",
      "docker compose up --build",
      "# App: http://localhost:3000",
    ],
    note: "No setup needed: payments run on Stripe test keys until you add your own to .env. Nothing is mocked — the catalogue, reviews and orders are real database rows.",
  },
  {
    title: "Project Management System",
    solves: "A task tracker for small teams, but built properly: every company that signs up gets its own tenant, and the isolation is enforced in the database with Postgres row-level security — not just in application code. There's a task board, per-project statistics, real-time updates over Socket.IO, and a test suite covering unit, integration and e2e.",
    tech: ["Next.js 14", "NestJS", "Supabase", "PostgreSQL RLS", "Socket.IO", "Jest"],
    github: "https://github.com/Mahmod-mourad/Project-management-system",
    live: "https://pms-web-lilac.vercel.app",
    emoji: "\uD83D\uDCCB",
    gallery: [
      ["screenshots/pms/dashboard.png", "Dashboard — live stats and charts"],
      ["screenshots/pms/projects.png", "Projects — create, edit, search, filter"],
      ["screenshots/pms/tasks.png", "Tasks — status, priority, due dates"],
      ["screenshots/pms/users.png", "User management — admin only"],
    ],
    run: [
      "# 1) Local database (Supabase CLI)",
      "npx supabase start",
      "# 2) Schema and seed data — apply in order",
      'psql "$DB_URL" -f scripts/01-tenants-and-plans.sql',
      'psql "$DB_URL" -f scripts/02-profiles-projects-tasks.sql',
      'psql "$DB_URL" -f scripts/03-notifications.sql',
      'psql "$DB_URL" -f scripts/04-seed-demo-data.sql',
      "# 3) Backend (NestJS on 3001) — needs Supabase URL + service role key",
      "cd backend",
      "SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_SERVICE_ROLE_KEY=... npm run start:dev",
      "# 4) Frontend",
      "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 npm run dev",
      "# App: http://localhost:3000",
    ],
    note: "Demo login: admin@demo.localhost / DemoPassword123! — there's also a member account, same password, at member@demo.localhost.",
  },
  {
    title: "Car Rental System",
    solves: "An RTL-first car booking platform. Filters on transmission, fuel, seats and price; a radius search that finds cars near a specific branch using PostGIS; a booking flow with payments and refunds; reviews with owner replies; and an admin dashboard for the fleet. The whole thing — PostGIS included — starts with one docker compose command.",
    tech: ["Next.js", "NestJS", "PostgreSQL + PostGIS", "TypeORM", "Swagger", "Docker"],
    github: "https://github.com/Mahmod-mourad/Car-Rental-System",
    live: "https://mahmod-mourad.github.io/demo-hub/#car-rental",
    emoji: "\uD83D\uDE97",
    gallery: [
      ["screenshots/car-rental/home.png", "Home — Arabic RTL layout"],
      ["screenshots/car-rental/cars.png", "Cars listing — real data from the database"],
      ["screenshots/car-rental/car-detail.png", "Car details — specs, daily rate, similar cars"],
      ["screenshots/car-rental/swagger.png", "Swagger — the full API documented"],
    ],
    run: [
      "# One command: PostGIS, migrations, seed data, web app and API.",
      "git clone https://github.com/Mahmod-mourad/Car-Rental-System.git",
      "cd Car-Rental-System",
      "docker compose up --build",
      "# Web app: http://localhost:3000 · API: :3001 · Swagger: :3001/api",
    ],
  },
  {
    title: "Booking Platform",
    description: "Cross-platform booking app with React Native mobile, Next.js admin dashboard, and Node.js + Supabase backend. Real-time sync, role-based auth (RLS), shipped to production for users across Europe and the Middle East.",
    tech: ["React Native", "Next.js", "Node.js", "Supabase", "PostgreSQL"],
    github: "#",
    emoji: "\uD83D\uDCF1",
  },
  {
    title: "ERP System",
    description: "Full-stack ERP covering inventory, HR workflows, finance, and operational dashboards. React frontend, NestJS + PostgreSQL backend, deployed on AWS with Docker and CI/CD.",
    tech: ["NestJS", "React", "PostgreSQL", "Docker", "AWS", "Node.js"],
    github: "#",
    emoji: "\uD83C\uDFE2",
  },
  {
    title: "Clinic Management System",
    description: "End-to-end clinic platform: patient records, appointment scheduling, and billing. NestJS + MongoDB backend, React frontend, JWT + OAuth2 auth.",
    tech: ["NestJS", "MongoDB", "React", "Node.js"],
    github: "#",
    emoji: "\uD83C\uDFE5",
  },
  {
    title: "Real Estate Platform",
    description: "Frontend for property listings, search & filter, and residential unit sales. Reusable TypeScript component library with Tailwind CSS, REST API integration with performance optimisations.",
    tech: ["React.js", "TypeScript", "Tailwind CSS", "Next.js"],
    github: "#",
    emoji: "\uD83C\uDFE0",
  },
];

const EDUCATION = [
  {
    type: "Degree",
    title: "B.Sc. Computer Science",
    institution: "Benha University",
    date: "January 2020 – January 2024",
    details: "Faculty of Artificial Intelligence",
  },
];

const CERTIFICATIONS = [
  {
    title: "Full Stack Development Professional Diploma",
    issuer: "Route Academy",
    date: "2024",
    details: "MERN Stack · Express.js · GraphQL · Modern Web Architecture",
  },
  {
    title: "Angular Development Specialization",
    issuer: "ITI",
    date: "2024",
    details: "Angular Framework · TypeScript · Component Architecture",
  },
];

const SKILLS_GROUPS = [
  { label: "Frontend", items: ["React.js", "Next.js", "Angular", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "NestJS", "Express.js", "REST APIs", "GraphQL"] },
  { label: "Mobile", items: ["React Native", "iOS & Android", "Expo"] },
  { label: "Databases", items: ["PostgreSQL", "MongoDB", "Supabase", "Redis"] },
  { label: "Tools & DevOps", items: ["AWS", "Docker", "CI/CD", "Git & GitHub", "Cursor/Claude"] },
  { label: "Soft Skills & Langs", items: ["English (B2) & Arabic (C2)", "Problem Solving", "Leadership", "Team Working", "Agile & SOLID"] },
];

/* ─── HOOKS ──────────────────────────────────────────────── */
function useScrollSpy() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const handler = () => {
      const sections = NAV_LINKS.map(n => document.getElementById(n.toLowerCase())).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        if (window.scrollY >= sections[i].offsetTop - 200) { setActive(NAV_LINKS[i]); break; }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── SMALL COMPONENTS ───────────────────────────────────── */
function FadeSection({ children, delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function NumberedHeading({ num, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "48px", whiteSpace: "nowrap" }}>
      <h2 style={{ fontSize: "clamp(2rem,4vw,2.5rem)", fontWeight: 800, fontFamily: T.fontHeading, color: T.textMain, letterSpacing: "-0.02em" }}>
        <span className="text-gradient" style={{ marginRight: "12px", fontSize: "0.8em", fontWeight: 700, fontFamily: T.fontMono }}>{num}.</span>
        {text}
      </h2>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)", maxWidth: "400px" }} />
    </div>
  );
}

function TechTag({ tag }) {
  return (
    <span style={{
      fontFamily: T.fontMono, fontSize: "0.75rem",
      color: T.accent2, background: "rgba(34, 211, 238, 0.08)",
      border: `1px solid rgba(34, 211, 238, 0.2)`,
      padding: "4px 12px", borderRadius: "100px",
      display: "inline-block", margin: "4px 6px 4px 0",
      letterSpacing: "0.05em"
    }}>{tag}</span>
  );
}

/* ─── EXPERIENCE TABS ─────────────────────────────────────── */
function ExperienceSection() {
  const [tab, setTab] = useState(0);
  const exp = EXPERIENCE[tab];
  return (
    <div className="experience-container" style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
      {/* Tab list */}
      <div className="glass-card exp-tabs" style={{ display: "flex", flexDirection: "column", minWidth: "200px", overflow: "hidden", padding: "8px" }}>
        {EXPERIENCE.map((e, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            background: tab === i ? "rgba(255,255,255,0.08)" : "transparent",
            border: "none", borderRadius: "8px",
            padding: "16px 20px", textAlign: "left",
            cursor: "pointer", fontFamily: T.fontHeading, fontSize: "1rem", fontWeight: tab === i ? 600 : 400,
            color: tab === i ? T.textMain : T.textMuted,
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            position: "relative", overflow: "hidden"
          }}
            onMouseEnter={e => { if (tab !== i) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
            onMouseLeave={e => { if (tab !== i) { e.currentTarget.style.background = "transparent"; } }}
          >
            {tab === i && <div className="tab-indicator" style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "3px", background: T.accent1, borderRadius: "0 4px 4px 0", boxShadow: "0 0 10px #c084fc" }} />}
            {e.company}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass-card" style={{ flex: 1, padding: "40px", position: "relative" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: "100px", height: "100px", background: T.accent2, filter: "blur(60px)", opacity: 0.15, pointerEvents: "none" }} />
        <h3 style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: T.fontHeading, color: T.textMain, marginBottom: "8px" }}>
          {exp.title}{" "}
          <span className="text-gradient">@ {exp.company}</span>
        </h3>
        <p style={{ fontFamily: T.fontMono, fontSize: "0.85rem", color: T.textMuted, marginBottom: "24px" }}>{exp.range} <span style={{ opacity: 0.5 }}>// {exp.location}</span></p>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          {exp.bullets.map((b, i) => (
            <li key={i} style={{ display: "flex", gap: "16px", color: T.textMuted, fontSize: "1rem", lineHeight: 1.6 }}>
              <span className="text-gradient" style={{ flexShrink: 0, marginTop: "2px", fontSize: "1.2rem" }}>✦</span>
              {b}
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "auto" }}>
          {exp.tech.map(t => <TechTag key={t} tag={t} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURED PROJECT CARD ──────────────────────────────── */
function FeaturedProject({ proj, index }) {
  return (
    <Tilt>
    <div className="glass-card proj-card" style={{ padding: "40px", marginBottom: "40px", position: "relative", overflow: "hidden" }}>
      {/* Background glow specific to card */}
      <div style={{ position: "absolute", bottom: -50, left: index % 2 === 0 ? -50 : "auto", right: index % 2 !== 0 ? -50 : "auto", width: "150px", height: "150px", background: index % 2 === 0 ? T.accent1 : T.accent2, filter: "blur(80px)", opacity: 0.15, pointerEvents: "none", borderRadius: "50%" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
            {proj.emoji}
          </div>
          <div>
            <p style={{ fontFamily: T.fontMono, fontSize: "0.8rem", color: T.accent1, marginBottom: "4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Featured</p>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: T.fontHeading, color: T.textMain }}>{proj.title}</h3>
          </div>
        </div>
        {proj.live && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href={proj.live} className="glass-btn" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", fontSize: "0.9rem", fontFamily: T.fontMono, color: T.accent2, borderColor: "rgba(34, 211, 238, 0.3)" }}>
              Live Demo ↗
            </a>
            {proj.github && proj.github !== "#" && (
              <a href={proj.github} className="glass-btn" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", fontSize: "0.9rem", fontFamily: T.fontMono, color: T.textMain }}>
                GitHub ↗
              </a>
            )}
          </div>
        )}
        {!proj.live && proj.github && proj.github !== "#" && (
          <a href={proj.github} className="glass-btn float-btn" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", fontSize: "0.9rem", fontFamily: T.fontMono, color: T.textMain }}>
            GitHub ↗
          </a>
        )}
      </div>
      <p style={{ color: T.textMuted, fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "32px", maxWidth: "800px" }}><b style={{ color: T.textMain }}>What it solves: </b>{proj.solves || proj.description}</p>
      {proj.gallery && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginBottom: "32px" }}>
          {proj.gallery.map(([src, caption]) => (
            <a key={src} href={src.replace("screenshots/", "screenshots/")} target="_blank" rel="noopener noreferrer" style={{ display: "block", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)" }}>
              <img src={src} alt={caption} loading="eager" decoding="async" style={{ width: "100%", display: "block", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top", transition: "transform 0.4s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
              <div style={{ padding: "10px 14px", fontSize: "0.8rem", color: T.textMuted, borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: T.fontBody }}>{caption}</div>
            </a>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {proj.tech.map(t => <TechTag key={t} tag={t} />)}
      </div>
      {proj.run && (
        <div style={{ marginTop: "32px" }}>
          <h4 style={{ fontFamily: T.fontMono, fontSize: "0.85rem", color: T.accent2, margin: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>// How to run</h4>
          <pre style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "18px", overflowX: "auto", fontFamily: T.fontMono, fontSize: "0.85rem", lineHeight: 1.9, direction: "ltr", textAlign: "left", margin: 0 }}>
            {proj.run.map((line, i) => line.startsWith("# ")
              ? <span key={i} style={{ display: "block", color: "#64748b", whiteSpace: "pre-wrap" }}>{line}</span>
              : <span key={i} style={{ display: "block", color: "#e2e8f0", whiteSpace: "pre-wrap" }}>{line}</span>)}
          </pre>
        </div>
      )}
      {proj.note && (
        <div style={{ background: "rgba(192, 132, 252, 0.08)", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: "10px", padding: "12px 16px", fontSize: "0.9rem", color: T.textMuted, marginTop: "16px", lineHeight: 1.6, fontFamily: T.fontBody }}>
          {proj.note}
        </div>
      )}
    </div>
    </Tilt>
  );
}

/* ─── EDUCATION / CERT CARD ──────────────────────────────── */
function EduCard({ item }) {
  return (
    <div className="glass-card small-proj" style={{ padding: "32px", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "2rem", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.2))" }}>{item.type === "Degree" ? "🎓" : "📜"}</span>
      </div>
      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: T.fontHeading, color: T.textMain, marginBottom: "8px" }}>{item.title}</h3>
      <p style={{ fontFamily: T.fontMono, fontSize: "0.85rem", color: T.accent2, marginBottom: "16px" }}>{item.institution || item.issuer} <span style={{ color: T.textMuted }}>// {item.date}</span></p>
      <p style={{ color: T.textMuted, fontSize: "0.95rem", lineHeight: 1.6, flex: 1 }}>{item.details}</p>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────── */
export default function Portfolio() {
  const active = useScrollSpy();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 50), { passive: true });
  }, []);

  return (
    <div style={{ background: T.bg, color: T.textMain, fontFamily: T.fontBody, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      {/* GLOBAL CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;500;700;800&family=Fira+Code:wght@400;500&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${T.bg}; color: ${T.textMain}; }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        
        ::selection { background: rgba(192, 132, 252, 0.3); color: #fff; }
        a { text-decoration: none; }

        /* Gradients & Text */
        .text-gradient {
          background: linear-gradient(135deg, ${T.accent1}, ${T.accent2});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Glassmorphism Classes */
        .glass-card {
          background: rgba(15, 15, 20, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .proj-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(192, 132, 252, 0.1);
        }
        .small-proj:hover {
          transform: translateY(-8px);
          border-color: rgba(34, 211, 238, 0.3);
        }
        .small-proj:hover span:last-child {
          color: ${T.accent2} !important;
        }

        .glass-btn {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; transition: all 0.3s ease;
          cursor: pointer;
        }
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .float-btn { animation: float-subtle 4s ease-in-out infinite alternate; }

        /* Background Blobs */
        .blob {
          position: fixed; filter: blur(120px); z-index: 0; opacity: 0.4;
          border-radius: 50%; animation: float-extreme 25s infinite ease-in-out alternate;
          pointer-events: none;
        }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(192,132,252,0.4) 0%, transparent 70%); }
        .blob-2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%); animation-delay: -5s; }
        .blob-3 { top: 40%; left: 40%; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%); animation-delay: -10s; }

        /* Keyframes */
        @keyframes float-extreme { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(5%, 10%) scale(1.1); } }
        @keyframes float-subtle { 0% { transform: translateY(0); } 100% { transform: translateY(-4px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        
        .hero-elem { animation: fadeUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) both; }
        .hero-elem:nth-child(1) { animation-delay: 0.1s; }
        .hero-elem:nth-child(2) { animation-delay: 0.2s; }
        .hero-elem:nth-child(3) { animation-delay: 0.3s; }
        .hero-elem:nth-child(4) { animation-delay: 0.4s; }
        .hero-elem:nth-child(5) { animation-delay: 0.5s; }

        /* Responsive */
        @media(max-width: 900px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .header-container { padding: 0 24px !important; }
          .main-content { padding: 0 24px !important; }
          .bento-grid { grid-template-columns: 1fr !important; }
          .experience-container { flex-direction: column !important; }
          .exp-tabs { flex-direction: row !important; overflow-x: auto !important; width: 100%; white-space: nowrap; }
          .exp-tabs button { flex: 0 0 auto; text-align: center !important; }
          .tab-indicator { top: auto !important; bottom: 0 !important; left: 20% !important; right: 20% !important; width: auto !important; height: 3px !important; border-radius: 4px 4px 0 0 !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .about-img-container { width: 100% !important; max-width: 280px; margin: 0 auto; }
          .hero-buttons { flex-direction: column !important; width: 100%; }
          .hero-buttons a { width: 100%; text-align: center; }
        }
        @media(max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .hero-elem h1 { font-size: 3rem !important; }
        }
        .mobile-menu-btn { display: none; background: none; border: none; color: ${T.textMain}; cursor: pointer; z-index: 101; }
        
        .mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(9, 9, 11, 0.98); backdrop-filter: blur(20px); z-index: 99;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 24px; padding: 24px;
          opacity: 0; pointer-events: none; transition: all 0.3s;
        }
        .mobile-menu.open {
          opacity: 1; pointer-events: auto;
        }

        /* ── New FX ── */
        .tw-cursor { animation: blink 1s step-end infinite; color: #22d3ee; font-weight: 600; }

        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        .marquee {
          overflow: hidden; white-space: nowrap; position: relative; margin: 0 auto; max-width: 100%;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          padding: 18px 0; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .marquee-inner { display: inline-block; animation: marquee-scroll 32s linear infinite; }
        .marquee:hover .marquee-inner { animation-play-state: paused; }
        @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .proj-card::before {
          content: ""; position: absolute; inset: 0; border-radius: 24px; padding: 1px; pointer-events: none;
          background: linear-gradient(135deg, rgba(192,132,252,0.55), rgba(34,211,238,0.45), transparent 70%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0; transition: opacity .45s;
        }
        .proj-card:hover::before { opacity: 1; }

        .terminal-card { animation: float-slow 7s ease-in-out infinite; }
        @keyframes float-slow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

        .stat-value {
          background: linear-gradient(135deg, #c084fc, #22d3ee);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }

        .to-top {
          position: fixed; bottom: 28px; right: 28px; width: 48px; height: 48px; border-radius: 14px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #f8fafc;
          font-size: 1.3rem; cursor: pointer; z-index: 120; backdrop-filter: blur(10px); transition: all .3s;
        }
        .to-top:hover { background: rgba(192,132,252,0.22); border-color: #c084fc; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(192,132,252,0.25); }
      `}</style>

      {/* BACKGROUND ELEMENTS */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <ScrollProgress />
      <CursorGlow />
      <div className="grid-bg" />

      {/* TOP NAV BAR */}
      <header className="header-container" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 64px",
        background: scrolled ? "rgba(9, 9, 11, 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        transition: "all 0.4s",
      }}>
        <div style={{ fontFamily: T.fontHeading, fontSize: "1.4rem", fontWeight: 800, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", color: T.bg, fontSize: "1rem" }}>
            M
          </div>
          <span className="text-gradient">Mourad.</span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {NAV_LINKS.map((n, i) => (
            <button key={n} onClick={() => document.getElementById(n.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: T.fontBody, fontSize: "0.9rem", fontWeight: 500,
                color: active === n ? T.textMain : T.textMuted,
                transition: "color 0.3s", position: "relative"
              }}
              onMouseEnter={e => e.currentTarget.style.color = T.textMain}
              onMouseLeave={e => e.currentTarget.style.color = active === n ? T.textMain : T.textMuted}
            >
              <span style={{ fontFamily: T.fontMono, color: T.accent1, fontSize: "0.8em", marginRight: "6px" }}>0{i + 1}.</span>
              {n}
              {active === n && <div style={{ position: "absolute", bottom: "-6px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: T.accent2, boxShadow: "0 0 8px #22d3ee" }} />}
            </button>
          ))}
          <a href="https://wa.me/201030796415?text=Hello%20Mahmoud,%20I%20would%20like%20to%20contact%20you!" target="_blank" rel="noopener noreferrer" className="glass-btn" style={{
            fontFamily: T.fontBody, fontSize: "0.9rem", fontWeight: 600, color: T.textMain,
            padding: "10px 24px", marginLeft: "16px"
          }}>
            Hire Me
          </a>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginLeft: "8px" }}>
            <a href="https://github.com/Mahmod-mourad" target="_blank" rel="noopener noreferrer" style={{ color: T.textMuted, transition: "color 0.3s" }} onMouseEnter={e => e.currentTarget.style.color = T.textMain} onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/mahmoud-mourad-946a59263/" target="_blank" rel="noopener noreferrer" style={{ color: T.textMuted, transition: "color 0.3s" }} onMouseEnter={e => e.currentTarget.style.color = T.textMain} onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((n, i) => (
          <button key={n} onClick={() => {
            setMobileMenuOpen(false);
            document.getElementById(n.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
          }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: T.fontHeading, fontSize: "1.5rem", fontWeight: 600,
              color: active === n ? T.textMain : T.textMuted,
            }}
          >
            <span style={{ fontFamily: T.fontMono, color: T.accent1, fontSize: "0.8em", marginRight: "8px" }}>0{i + 1}.</span>
            {n}
          </button>
        ))}
        <a href="https://wa.me/201030796415?text=Hello%20Mahmoud,%20I%20would%20like%20to%20contact%20you!" target="_blank" rel="noopener noreferrer" className="glass-btn" style={{
          fontFamily: T.fontBody, fontSize: "1.1rem", fontWeight: 600, color: T.textMain,
          padding: "12px 32px", marginTop: "16px"
        }}>
          Hire Me
        </a>
        <div style={{ display: "flex", gap: "24px", alignItems: "center", marginTop: "24px" }}>
          <a href="https://github.com/Mahmod-mourad" target="_blank" rel="noopener noreferrer" style={{ color: T.textMuted }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="https://www.linkedin.com/in/mahmoud-mourad-946a59263/" target="_blank" rel="noopener noreferrer" style={{ color: T.textMuted }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </div>
      </div>

      {/* ── MAIN SCROLL AREA ── */}
      <main className="main-content" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 10 }}>

        {/* ── HERO ── */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "80px", position: "relative" }}>
          <div className="glass-card hero-elem" style={{ display: "inline-flex", alignItems: "center", padding: "8px 18px", borderRadius: "100px", marginBottom: "40px", alignSelf: "flex-start", border: "1px solid rgba(192,132,252,0.3)", gap: "10px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 10px #34d399", animation: "blink 2s infinite" }} />
            <span style={{ fontFamily: T.fontMono, fontSize: "0.85rem", color: T.textMuted }}>Open to full-time & remote opportunities</span>
          </div>

          <div style={{ display: "flex", gap: "60px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1.25", minWidth: "320px" }}>
              <h1 className="hero-elem" style={{ fontSize: "clamp(3rem, 7vw, 5.2rem)", fontWeight: 800, fontFamily: T.fontHeading, color: T.textMain, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: "20px" }}>
                Hi, I'm <span className="text-gradient">Mahmoud.</span><br />
                <span style={{ fontSize: "0.55em", fontWeight: 700, color: T.textMuted }}>I build</span>{" "}
                <span style={{ fontSize: "0.62em" }}><Typewriter words={["scalable web apps.", "mobile experiences.", "APIs that hold up.", "full-stack products."]} /></span>
              </h1>
              <p className="hero-elem" style={{ maxWidth: "540px", fontSize: "clamp(1rem, 1.8vw, 1.15rem)", lineHeight: 1.85, color: T.textMuted, marginBottom: "40px" }}>
                Full-stack developer based in Cairo, Egypt. I take products from an empty repo to production — Next.js and React Native up front, NestJS and PostgreSQL behind, Docker and CI/CD in between. 3+ years shipping across Europe and the Middle East.
              </p>

              <div className="hero-elem hero-buttons" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "56px" }}>
                <a href="#projects" className="glass-btn" onClick={e => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }} style={{
                  fontFamily: T.fontBody, fontSize: "1rem", fontWeight: 600, color: T.bg,
                  padding: "16px 36px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", border: "none",
                  boxShadow: "0 10px 30px rgba(192, 132, 252, 0.3)"
                }}>View Work</a>
                <a href="https://drive.google.com/drive/folders/1lGdLzReirWqYMAcw5ou_AKkAAml8w_UQ" target="_blank" rel="noopener noreferrer" className="glass-btn" style={{
                  fontFamily: T.fontBody, fontSize: "1rem", fontWeight: 600, color: T.textMain,
                  padding: "16px 36px", border: "1px solid rgba(192, 132, 252, 0.5)"
                }}>Download CV</a>
                <a href="https://wa.me/201030796415?text=Hello%20Mahmoud,%20I%20would%20like%20to%20contact%20you!" target="_blank" rel="noopener noreferrer" className="glass-btn" style={{
                  fontFamily: T.fontBody, fontSize: "1rem", fontWeight: 600, color: T.textMain, padding: "16px 36px"
                }}>Contact Me</a>
              </div>
<div className="hero-elem stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", maxWidth: "660px" }}>
                <div className="glass-card" style={{ padding: "22px 14px", textAlign: "center", borderRadius: "16px" }}>
                  <div className="stat-value" style={{ fontFamily: T.fontHeading, fontSize: "1.9rem", fontWeight: 800, marginBottom: "4px" }}><CountUp to={3} suffix="+" /></div>
                  <div style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: T.textMuted, fontWeight: 500 }}>Years Experience</div>
                </div>
                <div className="glass-card" style={{ padding: "22px 14px", textAlign: "center", borderRadius: "16px" }}>
                  <div className="stat-value" style={{ fontFamily: T.fontHeading, fontSize: "1.9rem", fontWeight: 800, marginBottom: "4px" }}><CountUp to={5} suffix="+" /></div>
                  <div style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: T.textMuted, fontWeight: 500 }}>Products Shipped</div>
                </div>
                <div className="glass-card" style={{ padding: "22px 14px", textAlign: "center", borderRadius: "16px" }}>
                  <div className="stat-value" style={{ fontFamily: T.fontHeading, fontSize: "1.9rem", fontWeight: 800, marginBottom: "4px" }}><CountUp to={10} suffix="+" /></div>
                  <div style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: T.textMuted, fontWeight: 500 }}>Open-Source Repos</div>
                </div>
                <div className="glass-card" style={{ padding: "22px 14px", textAlign: "center", borderRadius: "16px" }}>
                  <div className="stat-value" style={{ fontFamily: T.fontHeading, fontSize: "1.9rem", fontWeight: 800, marginBottom: "4px" }}><CountUp to={150} suffix="+" /></div>
                  <div style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: T.textMuted, fontWeight: 500 }}>Tests Written</div>
                </div>
              </div>
            </div>

            {/* Terminal visual */}
            <div className="terminal-card hero-elem" style={{ flex: "0.85", minWidth: "300px", maxWidth: "430px", margin: "0 auto" }}>
              <div className="glass-card" style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ff5f57" }} />
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#febc2e" }} />
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#28c840" }} />
                  <span style={{ fontFamily: T.fontMono, fontSize: "0.72rem", color: T.textMuted, marginLeft: "10px" }}>mahmoud@dev — zsh</span>
                </div>
                <div style={{ padding: "22px 22px 26px", fontFamily: T.fontMono, fontSize: "0.84rem", lineHeight: 2 }}>
                  <div style={{ color: T.textMuted }}><span style={{ color: "#34d399" }}>➜</span> <span style={{ color: T.accent1 }}>~</span> whoami</div>
                  <div style={{ color: T.textMain }}>mahmoud-mourad · full-stack developer</div>
                  <div style={{ color: T.textMuted, marginTop: "6px" }}><span style={{ color: "#34d399" }}>➜</span> <span style={{ color: T.accent1 }}>~</span> cat stack.txt</div>
                  <div style={{ color: T.textMain }}>Next.js · NestJS · React Native · PostgreSQL</div>
                  <div style={{ color: T.textMuted, marginTop: "6px" }}><span style={{ color: "#34d399" }}>➜</span> <span style={{ color: T.accent1 }}>~</span> npm run deploy --prod</div>
                  <div style={{ color: T.accent2 }}>✓ build passed — 151 tests, 0 failures</div>
                  <div style={{ color: T.textMuted, marginTop: "6px" }}><span style={{ color: "#34d399" }}>➜</span> <span style={{ color: T.accent1 }}>~</span> status</div>
                  <div style={{ color: "#34d399" }}>● available · let's build something</div>
                  <div style={{ color: T.textMuted, marginTop: "6px" }}><span style={{ color: "#34d399" }}>➜</span> <span className="tw-cursor">▊</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

<div className="marquee">
          <div className="marquee-inner">
            {(() => { const once = ["Next.js", "React", "TypeScript", "NestJS", "Node.js", "React Native", "PostgreSQL", "Supabase", "Stripe", "Socket.IO", "Prisma", "Docker", "AWS", "Tailwind CSS", "GraphQL", "CI/CD"]; const doubled = [...once, ...once]; return doubled.map((t, idx) => (<span key={idx} style={{ fontFamily: T.fontMono, fontSize: "0.85rem", color: T.textMuted, margin: "0 30px" }}><span style={{ color: T.accent1, marginRight: "8px" }}>◆</span>{t}</span>)); })()}
          </div>
        </div>
        <div style={{ height: "40px" }} />
                {/* ── ABOUT ── */}
        <section id="about" style={{ padding: "120px 0" }}>
          <FadeSection>
            <NumberedHeading num="01" text="About Me" />
            <div style={{ display: "flex", gap: "60px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: "300px" }}>
                <p style={{ lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "20px", color: T.textMuted }}>
                  Hello! I'm Mahmoud, a developer passionate about crafting high-end digital solutions. With <b style={{ color: T.textMain }}>3+ years</b> of experience, I excel at turning complex problems into elegant, performant applications.
                </p>
                <p style={{ lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "20px", color: T.textMuted }}>
                  I've built systems ranging from medical ERPs to real estate portals and cross-platform mobile booking apps. Currently, I collaborate with an innovative team in <b className="text-gradient">Germany</b>, architecting scalable solutions on AWS and deploying seamless React Native experiences.
                </p>
                <div className="glass-card" style={{ padding: "24px", marginTop: "32px", display: "inline-block" }}>
                  <p style={{ fontFamily: T.fontMono, fontSize: "0.85rem", color: T.accent2, marginBottom: "16px" }}>// Core Arsenal</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
                    {["React & Next.js", "Node.js & NestJS", "TypeScript", "PostgreSQL", "React Native", "Docker & AWS"].map(t => (
                      <div key={t} style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: T.fontBody, fontSize: "0.95rem", color: T.textMain, fontWeight: 500 }}>
                        <span style={{ color: T.accent1 }}>✦</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ flexShrink: 0, position: "relative", width: "100%", maxWidth: "280px", margin: "0 auto" }}>
                <div className="glass-card about-img-container" style={{ width: "100%", height: "360px", padding: "12px", position: "relative", zIndex: 1 }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "16px", background: "linear-gradient(180deg, rgba(192, 132, 252, 0.1), rgba(34, 211, 238, 0.1))", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <img src={`${import.meta.env.BASE_URL}me.jpg`} alt="Mahmoud Mourad" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
                <div style={{ position: "absolute", inset: "-2px", background: "linear-gradient(135deg, #c084fc, #22d3ee)", borderRadius: "24px", zIndex: 0, opacity: 0.3, filter: "blur(20px)" }} />
              </div>
            </div>
          </FadeSection>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" style={{ padding: "120px 0" }}>
          <FadeSection>
            <NumberedHeading num="02" text="Where I've Worked" />
            <ExperienceSection />
          </FadeSection>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" style={{ padding: "120px 0" }}>
          <FadeSection>
            <NumberedHeading num="03" text="Selected Works" />
            <p style={{ fontFamily: T.fontMono, fontSize: "0.9rem", color: T.textMuted, marginBottom: "28px" }}>
              The first three are open source — the links work, clone them and run them. Screenshots below are from the real apps running, with the exact commands to get each one up locally.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {PROJECTS.map((p, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <FeaturedProject proj={p} index={i} />
                </FadeSection>
              ))}
            </div>
          </FadeSection>
        </section>

        {/* ── EDUCATION & CERTIFICATIONS ── */}
        <section id="education" style={{ padding: "120px 0" }}>
          <FadeSection>
            <NumberedHeading num="04" text="Education & Certifications" />
            <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
              {EDUCATION.map((p, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <EduCard item={p} />
                </FadeSection>
              ))}
              {CERTIFICATIONS.map((p, i) => (
                <FadeSection key={i + 1} delay={(i + 1) * 0.1}>
                  <EduCard item={p} />
                </FadeSection>
              ))}
            </div>
          </FadeSection>
        </section>

        {/* ── SKILLS BENTO ── */}
        <section id="skills" style={{ padding: "120px 0" }}>
          <FadeSection>
            <NumberedHeading num="05" text="Technical Arsenal" />
            <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {SKILLS_GROUPS.map((g, i) => (
                <FadeSection key={i} delay={i * 0.1} style={{ height: "100%" }}>
                  <div className="glass-card" style={{ padding: "32px", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <span style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(192,132,252,0.1)", color: T.accent1, borderRadius: "8px", fontSize: "1.2rem" }}>
                        {i === 0 ? "🖥" : i === 1 ? "⚙️" : i === 2 ? "📱" : i === 3 ? "💾" : i === 4 ? "☁️" : "📐"}
                      </span>
                      <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.2rem", fontWeight: 700, color: T.textMain }}>{g.label}</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                      {g.items.map(s => (
                        <div key={s} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.95rem", color: T.textMuted, fontWeight: 500 }}>
                          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: T.accent2 }} /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </FadeSection>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ padding: "160px 0 200px", textAlign: "center" }}>
          <FadeSection>
            <p style={{ fontFamily: T.fontMono, fontSize: "1rem", color: T.accent1, marginBottom: "24px" }}>06. What's Next?</p>
            <h2 style={{ fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 800, fontFamily: T.fontHeading, color: T.textMain, letterSpacing: "-0.03em", marginBottom: "32px" }}>
              Get In Touch
            </h2>
            <p style={{ maxWidth: "600px", margin: "0 auto 48px", fontSize: "1.1rem", lineHeight: 1.8, color: T.textMuted }}>
              I'm currently open to new opportunities. Whether you have an exciting full-time role, a remote gig, or just want to chat about tech, my inbox is always open!
            </p>
            <a href="https://wa.me/201030796415?text=Hello%20Mahmoud,%20I%20would%20like%20to%20contact%20you!" target="_blank" rel="noopener noreferrer" className="glass-btn float-btn" style={{
              fontFamily: T.fontBody, fontSize: "1.1rem", fontWeight: 600, color: T.textMain,
              padding: "20px 56px", display: "inline-block"
            }}>
              Say Hello
            </a>

            <div style={{ marginTop: "120px" }}>
              <p style={{ fontFamily: T.fontMono, fontSize: "0.85rem", color: T.textMuted, opacity: 0.7 }}>
                Designed & Built with <span style={{ color: T.accent1 }}>♥</span> by Mahmoud Mourad © 2026
              </p>
            </div>
          </FadeSection>
        </section>
      </main>

      <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </div >
  );
}
