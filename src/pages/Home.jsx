import { useState, useEffect, useRef } from "react";
import { useData } from "../hooks/useData";

const MOOD_ACCENT = {
  curious: "#5C8C5A", electric: "#C4895A", mindblown: "#8B6F47",
  proud: "#7B9E8A", building: "#A67C52",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style
    }}>{children}</div>
  );
}

export default function Home({ onProjectClick, onAdminClick }) {
  const { data } = useData();
  const { personal, timeline, projects, skills, contact } = data;
  const [activeCat, setActiveCat] = useState(Object.keys(skills)[0]);
  const [hoveredProj, setHoveredProj] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", background: "#F7F4EE", minHeight: "100vh", color: "#2C2415" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #F0EBE2; } ::-webkit-scrollbar-thumb { background: #C4A882; border-radius: 2px; }
        body { background: #F7F4EE; }
        .nav-link { transition: color 0.2s; } .nav-link:hover { color: #5C8C5A !important; }
        .proj-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .proj-card:hover { transform: translateY(-4px); }
        .skill-pill { transition: all 0.2s; cursor: default; }
        .skill-pill:hover { background: #5C8C5A !important; color: #fff !important; border-color: #5C8C5A !important; }
        .contact-link { transition: all 0.25s; }
        .contact-link:hover { background: #5C8C5A !important; color: #fff !important; border-color: #5C8C5A !important; }
        .cat-btn { transition: all 0.2s; }
        .tl-dot-ring { transition: box-shadow 0.3s; }
        @keyframes heroFade { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatGently { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @media(max-width:640px){
          .hero-name{font-size:44px!important;}
          .hero-cols{grid-template-columns:1fr!important;}
          .proj-grid{grid-template-columns:1fr!important;}
          .tl-item{padding-left:48px!important;}
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(247,244,238,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid #E8DFD0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#hero" style={{ fontFamily: "'Lora'", fontWeight: 700, fontSize: 20, color: "#2C2415", textDecoration: "none", letterSpacing: "-0.02em" }}>
          DB<span style={{ color: "#5C8C5A" }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {[["#story","Story"],["#projects","Projects"],["#skills","Skills"],["#contact","Say Hello"]].map(([href, label]) => (
            <a key={href} href={href} className="nav-link" style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 500, color: "#7A6A55", padding: "8px 14px", borderRadius: 8, textDecoration: "none" }}>{label}</a>
          ))}
          <button onClick={onAdminClick} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070", background: "none", border: "1px solid #DDD0BC", borderRadius: 8, padding: "6px 12px", cursor: "pointer", marginLeft: 8 }}>⚙</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 40px 60px", position: "relative", overflow: "hidden" }}>
        {/* Decorative texture blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(92,140,90,0.08) 0%, transparent 70%)", top: "-100px", right: "-100px" }} />
          <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,137,90,0.07) 0%, transparent 70%)", bottom: "5%", left: "-80px" }} />
          <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.04 }} viewBox="0 0 1200 120" preserveAspectRatio="none" height="120">
            <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="#5C8C5A"/>
          </svg>
        </div>

        <div style={{ maxWidth: 880, margin: "0 auto", width: "100%", animation: "heroFade 0.9s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5C8C5A", display: "inline-block", animation: "floatGently 2.5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#8B7355", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
              3rd Year · IMS Engineering College · Open to opportunities
            </span>
          </div>

          <h1 className="hero-name" style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em", color: "#1A1510", marginBottom: 8 }}>
            Divyansh
          </h1>
          <h1 className="hero-name" style={{ fontSize: 68, fontWeight: 400, fontStyle: "italic", lineHeight: 1.06, letterSpacing: "-0.03em", color: "#8B6F47", marginBottom: 32 }}>
            Bansal.
          </h1>

          <p style={{ fontFamily: "'DM Sans'", fontSize: 18, fontWeight: 300, color: "#6B5A42", lineHeight: 1.75, maxWidth: 520, marginBottom: 48 }}>
            {personal.bio}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 72 }}>
            <a href="#projects" style={{ fontFamily: "'DM Sans'", background: "#2C2415", color: "#F7F4EE", padding: "13px 30px", borderRadius: 40, fontSize: 14, fontWeight: 500, textDecoration: "none", letterSpacing: "0.01em", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#5C8C5A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#2C2415"; }}>
              See my projects
            </a>
            <a href="#story" style={{ fontFamily: "'DM Sans'", color: "#8B7355", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, padding: "13px 4px" }}>
              Read my story <span style={{ fontSize: 18 }}>↓</span>
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid #E0D5C5", paddingTop: 32, flexWrap: "wrap" }}>
            {[["15+", "ML Models built"], ["5+", "Hackathons entered"], ["2025–26", "Journey so far"], ["CSE", "Computer Science"]].map(([num, label], i) => (
              <div key={i} style={{ paddingRight: 40, marginBottom: 12 }}>
                <div style={{ fontFamily: "'Lora'", fontSize: 28, fontWeight: 600, color: "#2C2415", letterSpacing: "-0.02em" }}>{num}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070", marginTop: 2, fontWeight: 400 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ background: "#2C2415", padding: "14px 0", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}>
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {["Python", "TensorFlow", "LangChain", "RAG", "CNN", "LSTM", "Flask", "Sklearn", "NLP", "Computer Vision", "Streamlit", "Gemini API"].map(s => (
                <span key={s} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 28px", borderRight: "1px solid #3D3425", whiteSpace: "nowrap" }}>{s}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STORY TIMELINE ── */}
      <section id="story" style={{ padding: "100px 40px", maxWidth: 860, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A89070", marginBottom: 14, fontWeight: 500 }}>the journey</p>
          <h2 style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1510", marginBottom: 8, lineHeight: 1.1 }}>My Story</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 16, color: "#8B7355", fontWeight: 300, marginBottom: 64, lineHeight: 1.7 }}>
            Not a resume. The actual thing — the curiosity, the breakthroughs, the stuck moments.
          </p>
        </Reveal>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 18, top: 12, bottom: 12, width: 1, background: "linear-gradient(to bottom, #C4A882 0%, rgba(196,168,130,0.15) 100%)" }} />

          {timeline.map((item, i) => {
            const accent = MOOD_ACCENT[item.mood] || "#5C8C5A";
            return (
              <Reveal key={item.id} delay={i * 0.08}>
                <div className="tl-item" style={{ display: "flex", gap: 36, marginBottom: 60, paddingLeft: 0 }}>
                  <div style={{ flexShrink: 0, width: 38, paddingTop: 3 }}>
                    <div className="tl-dot-ring" style={{ width: 36, height: 36, borderRadius: "50%", background: "#F7F4EE", border: `2px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: `0 0 0 5px ${accent}14` }}>
                      {item.emoji}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, color: accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.year}</span>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4A882" }}>· {item.subtitle}</span>
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 600, color: "#1A1510", letterSpacing: "-0.01em", marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h3>
                    <p style={{ fontFamily: "'DM Sans'", fontSize: 15, fontWeight: 300, color: "#6B5A42", lineHeight: 1.85, marginBottom: 16 }}>{item.story}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {item.tags.map(t => (
                        <span key={t} style={{ fontFamily: "'DM Sans'", fontSize: 11, padding: "3px 11px", borderRadius: 20, background: `${accent}12`, color: accent, border: `1px solid ${accent}22`, letterSpacing: "0.04em" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ background: "#F0EBE2", padding: "100px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A89070", marginBottom: 14, fontWeight: 500 }}>things i've built</p>
            <h2 style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1510", marginBottom: 8, lineHeight: 1.1 }}>Projects</h2>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 16, color: "#8B7355", fontWeight: 300, marginBottom: 56, lineHeight: 1.7 }}>
              Click any card to open the full project — with AI summary, demo video, and more.
            </p>
          </Reveal>

          <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))", gap: 18 }}>
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <div className="proj-card"
                  onClick={() => onProjectClick(p)}
                  onMouseEnter={() => setHoveredProj(p.id)}
                  onMouseLeave={() => setHoveredProj(null)}
                  style={{ background: hoveredProj === p.id ? "#fff" : "#FAF7F2", border: `1px solid ${hoveredProj === p.id ? "#C4A882" : "#E8DFD0"}`, borderRadius: 16, padding: "22px 22px 18px", cursor: "pointer", position: "relative", boxShadow: hoveredProj === p.id ? "0 8px 32px rgba(139,111,71,0.12)" : "none" }}>
                  {p.highlight && <span style={{ position: "absolute", top: 16, right: 16, fontFamily: "'DM Sans'", fontSize: 10, color: "#C4895A", background: "rgba(196,137,90,0.1)", border: "1px solid rgba(196,137,90,0.25)", padding: "2px 9px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>Featured</span>}
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#A89070", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>{p.category}</span>
                  <h3 style={{ fontFamily: "'Lora'", fontSize: 17, fontWeight: 600, color: "#1A1510", marginBottom: 8, lineHeight: 1.35, paddingRight: p.highlight ? 60 : 0 }}>{p.name}</h3>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8B7355", lineHeight: 1.65, marginBottom: 18, fontWeight: 300 }}>{p.tagline}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {p.tech.slice(0, 2).map(t => <span key={t} style={{ fontFamily: "'DM Sans'", fontSize: 10, padding: "2px 9px", borderRadius: 20, background: "#EDE6DA", color: "#8B7355" }}>{t}</span>)}
                      {p.tech.length > 2 && <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#C4A882" }}>+{p.tech.length - 2}</span>}
                    </div>
                    <span style={{ color: "#C4A882", fontSize: 16, transition: "transform 0.2s", transform: hoveredProj === p.id ? "translateX(3px)" : "none" }}>→</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "100px 40px", maxWidth: 860, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A89070", marginBottom: 14, fontWeight: 500 }}>what I work with</p>
          <h2 style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1510", marginBottom: 48, lineHeight: 1.1 }}>Skills</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
            {Object.keys(skills).map(cat => (
              <button key={cat} className="cat-btn" onClick={() => setActiveCat(cat)}
                style={{ fontFamily: "'DM Sans'", padding: "8px 18px", borderRadius: 40, fontSize: 13, fontWeight: 500, border: "1px solid", borderColor: activeCat === cat ? "#5C8C5A" : "#DDD0BC", background: activeCat === cat ? "#5C8C5A" : "transparent", color: activeCat === cat ? "#fff" : "#8B7355", cursor: "pointer" }}>
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, minHeight: 60 }}>
            {(skills[activeCat] || []).map(s => (
              <span key={s} className="skill-pill" style={{ fontFamily: "'DM Sans'", padding: "9px 20px", borderRadius: 40, fontSize: 14, background: "#FAF7F2", border: "1px solid #E0D5C5", color: "#6B5A42", fontWeight: 400 }}>{s}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: "#F0EBE2", padding: "100px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A89070", marginBottom: 14, fontWeight: 500 }}>reach out</p>
            <h2 style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1510", marginBottom: 12, lineHeight: 1.1 }}>Say Hello</h2>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 16, color: "#8B7355", fontWeight: 300, marginBottom: 48, lineHeight: 1.7 }}>
              Open to collabs, hackathon teams, project discussions,<br />or just a good conversation about ML.
            </p>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 36, paddingTop: 36, borderTop: "1px solid #DDD0BC" }}>
              {contact.email && <CLink href={`mailto:${contact.email}`} label="Email" />}
              {contact.github && <CLink href={contact.github} label="GitHub" />}
              {contact.linkedin && <CLink href={contact.linkedin} label="LinkedIn" />}
              {contact.kaggle && <CLink href={contact.kaggle} label="Kaggle" />}
              {contact.resume && <CLink href={contact.resume} label="Resume ↓" />}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#2C2415", padding: "48px 40px 36px", color: "#A89070" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ fontFamily: "'Lora'", fontWeight: 700, fontSize: 22, color: "#F7F4EE", marginBottom: 8, letterSpacing: "-0.01em" }}>
                DB<span style={{ color: "#5C8C5A" }}>.</span>
              </div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 300, lineHeight: 1.7, maxWidth: 280, color: "#7A6A55" }}>
                Portfolio of Divyansh Bansal — CS student, AI/ML explorer, IMS Engineering College.
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A4E3C", marginBottom: 14 }}>Credits</p>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#7A6A55", lineHeight: 2 }}>
                <div>
                  <span style={{ color: "#C4A882" }}>Content & vision</span>
                  {" — "}Divyansh Bansal
                </div>
                <div>
                  <span style={{ color: "#C4A882" }}>Design & development</span>
                  {" — "}Claude (Anthropic) · Sonnet 4
                </div>
                <div>
                  <span style={{ color: "#C4A882" }}>Expression detection</span>
                  {" — "}face-api.js by @justadudewhohacks
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #3D3425", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#5A4E3C" }}>
              © {new Date().getFullYear()} Divyansh Bansal. Built with React + Vite.
            </p>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#5A4E3C", fontStyle: "italic" }}>
              Designed & developed by Claude Sonnet 4 · Anthropic
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CLink({ href, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="contact-link"
      style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 500, padding: "11px 22px", borderRadius: 40, border: "1px solid #DDD0BC", color: "#6B5A42", textDecoration: "none", background: "#FAF7F2" }}>
      {label}
    </a>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const { data } = useData();

  const iStyle = { width: "100%", background: "#FAF7F2", border: "1px solid #DDD0BC", borderRadius: 10, padding: "13px 16px", color: "#2C2415", fontFamily: "'DM Sans'", fontSize: 14, outline: "none", transition: "border 0.2s", fontWeight: 300 };

  async function gen() {
    if (!msg.trim()) return;
    setLoading(true); setDraft("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You help ${data.personal.name}, a CS engineering student specializing in ML/AI, draft warm, genuine replies to portfolio messages. 3–4 sentences, natural tone. Return only the reply text.`,
          messages: [{ role: "user", content: `Visitor: ${name || "Someone"}\nMessage: ${msg}\n\nDraft a warm reply from Divyansh.` }],
        }),
      });
      const j = await res.json();
      setDraft(j.content?.[0]?.text || "Error generating.");
    } catch { setDraft("Could not connect. Try again."); }
    setLoading(false);
  }

  return (
    <div style={{ background: "#FAF7F2", border: "1px solid #E0D5C5", borderRadius: 18, padding: "28px 28px 24px" }}>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A89070", marginBottom: 20, fontWeight: 500 }}>Send a message · AI drafts a reply for Divyansh</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={iStyle}
          onFocus={e => e.target.style.borderColor = "#5C8C5A"} onBlur={e => e.target.style.borderColor = "#DDD0BC"} />
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="What's on your mind?" rows={4}
          style={{ ...iStyle, resize: "vertical", lineHeight: 1.7 }}
          onFocus={e => e.target.style.borderColor = "#5C8C5A"} onBlur={e => e.target.style.borderColor = "#DDD0BC"} />
        <button onClick={gen} disabled={loading || !msg.trim()}
          style={{ alignSelf: "flex-start", fontFamily: "'DM Sans'", background: loading ? "#A89070" : "#2C2415", color: "#F7F4EE", border: "none", padding: "12px 26px", borderRadius: 40, fontSize: 13, fontWeight: 500, cursor: loading ? "wait" : "pointer", transition: "background 0.2s" }}>
          {loading ? "Drafting…" : "✦ Draft AI Reply"}
        </button>
      </div>
      {draft && (
        <div style={{ marginTop: 20, background: "#F0EBE2", border: "1px solid #DDD0BC", borderRadius: 12, padding: "18px 20px" }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#5C8C5A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>AI-Drafted Reply</p>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#4A3D2C", lineHeight: 1.85, whiteSpace: "pre-wrap", fontWeight: 300 }}>{draft}</p>
          <button onClick={() => navigator.clipboard.writeText(draft)}
            style={{ marginTop: 12, fontFamily: "'DM Sans'", fontSize: 12, color: "#5C8C5A", background: "none", border: "1px solid rgba(92,140,90,0.3)", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
