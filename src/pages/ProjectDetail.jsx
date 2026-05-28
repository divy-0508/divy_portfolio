import { useState } from "react";
import { useData } from "../hooks/useData";

export default function ProjectDetail({ project, onBack }) {
  const { data } = useData();
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [mailDraft, setMailDraft] = useState("");
  const [mailLoading, setMailLoading] = useState(false);
  const [visitorCtx, setVisitorCtx] = useState("");
  const [tab, setTab] = useState("overview");

  if (!project) return null;

  const iStyle = { width: "100%", background: "#FAF7F2", border: "1px solid #DDD0BC", borderRadius: 10, padding: "12px 16px", color: "#2C2415", fontFamily: "'DM Sans'", fontSize: 14, outline: "none", fontWeight: 300 };

  async function genSummary() {
    setSummaryLoading(true); setSummary("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "Write a concise 3-paragraph technical summary of a student ML/AI project. Paragraph 1: what it does. Paragraph 2: how it works. Paragraph 3: what makes it interesting. Engaging tone, written for a technical reader.",
          messages: [{ role: "user", content: `Project: ${project.name}\nDescription: ${project.description}\nStack: ${project.tech.join(", ")}\n${project.videoDescription ? "Video context: " + project.videoDescription : ""}` }],
        }),
      });
      const j = await res.json();
      setSummary(j.content?.[0]?.text || "Error.");
    } catch { setSummary("Failed to generate. Try again."); }
    setSummaryLoading(false);
  }

  async function genMail() {
    setMailLoading(true); setMailDraft("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `Write a professional follow-up email from a portfolio visitor to ${data.personal.name} (CS student, AI/ML). Reference the specific project. Warm, genuine, concise. Format: Subject: ...\n\n[body]`,
          messages: [{ role: "user", content: `Project: ${project.name} — ${project.tagline}\nContext: ${visitorCtx || "Interested in this project"}` }],
        }),
      });
      const j = await res.json();
      setMailDraft(j.content?.[0]?.text || "Error.");
    } catch { setMailDraft("Failed to generate."); }
    setMailLoading(false);
  }

  function getYTId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
    return m ? m[1] : null;
  }
  const ytId = getYTId(project.video);

  const TABS = ["overview", "ai summary", ...(project.isMailing ? ["follow-up mailer"] : [])];

  return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", background: "#F7F4EE", minHeight: "100vh", color: "#2C2415" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .tab-btn { transition: all 0.2s; }
        .back-btn:hover { background: #EDE6DA !important; color: #2C2415 !important; }
        .copy-btn:hover { background: rgba(92,140,90,0.1) !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(247,244,238,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #E8DFD0", padding: "0 40px", height: 58, display: "flex", alignItems: "center", gap: 16 }}>
        <button className="back-btn" onClick={onBack}
          style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 500, color: "#8B7355", background: "none", border: "1px solid #DDD0BC", borderRadius: 8, padding: "7px 16px", cursor: "pointer", transition: "all 0.2s" }}>
          ← Back
        </button>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#C4A882" }}>Projects</span>
        <span style={{ color: "#DDD0BC" }}>·</span>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#8B7355" }}>{project.name}</span>
      </nav>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "52px 32px 80px", animation: "fadeUp 0.45s ease" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 11, padding: "3px 12px", borderRadius: 20, background: "rgba(92,140,90,0.1)", color: "#5C8C5A", border: "1px solid rgba(92,140,90,0.2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{project.category}</span>
            {project.highlight && <span style={{ fontFamily: "'DM Sans'", fontSize: 11, padding: "3px 12px", borderRadius: 20, background: "rgba(196,137,90,0.1)", color: "#C4895A", border: "1px solid rgba(196,137,90,0.2)" }}>Featured</span>}
            {project.isMailing && <span style={{ fontFamily: "'DM Sans'", fontSize: 11, padding: "3px 12px", borderRadius: 20, background: "rgba(92,140,90,0.1)", color: "#5C8C5A", border: "1px solid rgba(92,140,90,0.2)" }}>Live AI Demo</span>}
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1510", marginBottom: 12, lineHeight: 1.15 }}>{project.name}</h1>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 17, color: "#8B7355", fontWeight: 300, lineHeight: 1.65 }}>{project.tagline}</p>
        </div>

        {/* Tech */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 28 }}>
          {project.tech.map(t => <span key={t} style={{ fontFamily: "'DM Sans'", fontSize: 12, padding: "5px 13px", borderRadius: 20, background: "#EDE6DA", border: "1px solid #DDD0BC", color: "#6B5A42" }}>{t}</span>)}
        </div>

        {/* Links */}
        {(project.github || project.live) && (
          <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
            {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans'", fontSize: 13, padding: "9px 20px", borderRadius: 40, border: "1px solid #DDD0BC", color: "#6B5A42", textDecoration: "none", background: "#FAF7F2" }}>GitHub ↗</a>}
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans'", fontSize: 13, padding: "9px 20px", borderRadius: 40, background: "#2C2415", color: "#F7F4EE", textDecoration: "none" }}>Live Demo ↗</a>}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #E0D5C5", marginBottom: 36, gap: 0 }}>
          {TABS.map(t => (
            <button key={t} className="tab-btn" onClick={() => setTab(t)}
              style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: tab === t ? 600 : 400, padding: "11px 20px", background: "none", border: "none", cursor: "pointer", color: tab === t ? "#2C2415" : "#A89070", borderBottom: tab === t ? "2px solid #5C8C5A" : "2px solid transparent", marginBottom: -1, textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 16, color: "#5A4835", lineHeight: 1.9, fontWeight: 300, marginBottom: 36 }}>{project.description}</p>

            {ytId ? (
              <div style={{ marginBottom: 36 }}>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#A89070", marginBottom: 12, fontWeight: 500 }}>Demo Video</p>
                <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #E0D5C5", aspectRatio: "16/9" }}>
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{ display: "block" }} />
                </div>
                {project.videoDescription && <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#A89070", marginTop: 10, lineHeight: 1.7, fontStyle: "italic" }}>{project.videoDescription}</p>}
              </div>
            ) : null}

            <button onClick={() => setTab("ai summary")}
              style={{ fontFamily: "'DM Sans'", display: "inline-flex", alignItems: "center", gap: 8, background: "#FAF7F2", border: "1px solid #DDD0BC", color: "#5C8C5A", padding: "11px 22px", borderRadius: 40, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              ✦ Generate AI Summary →
            </button>
          </div>
        )}

        {/* AI SUMMARY */}
        {tab === "ai summary" && (
          <div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#A89070", marginBottom: 24, lineHeight: 1.7, fontWeight: 300 }}>
              AI-generated technical summary. Swap in your own summarizer — replace <code style={{ color: "#5C8C5A", fontSize: 12, background: "#EDE6DA", padding: "1px 6px", borderRadius: 4 }}>genSummary()</code> in <code style={{ color: "#5C8C5A", fontSize: 12, background: "#EDE6DA", padding: "1px 6px", borderRadius: 4 }}>ProjectDetail.jsx</code>.
            </p>
            {!summary ? (
              <button onClick={genSummary} disabled={summaryLoading}
                style={{ fontFamily: "'DM Sans'", background: summaryLoading ? "#A89070" : "#2C2415", color: "#F7F4EE", border: "none", padding: "13px 30px", borderRadius: 40, fontSize: 14, fontWeight: 500, cursor: summaryLoading ? "wait" : "pointer" }}>
                {summaryLoading ? "Generating…" : "✦ Summarize this project"}
              </button>
            ) : (
              <div style={{ background: "#FAF7F2", border: "1px solid #DDD0BC", borderRadius: 14, padding: "24px 26px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#5C8C5A", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>AI Summary</span>
                  <button onClick={() => setSummary("")} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070", background: "none", border: "none", cursor: "pointer" }}>Regenerate</button>
                </div>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#4A3D2C", lineHeight: 1.9, whiteSpace: "pre-wrap", fontWeight: 300 }}>{summary}</p>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(summary)}
                  style={{ marginTop: 14, fontFamily: "'DM Sans'", fontSize: 12, color: "#5C8C5A", background: "none", border: "1px solid rgba(92,140,90,0.3)", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>Copy</button>
              </div>
            )}
          </div>
        )}

        {/* FOLLOW-UP MAILER */}
        {tab === "follow-up mailer" && project.isMailing && (
          <div>
            <div style={{ background: "rgba(92,140,90,0.07)", border: "1px solid rgba(92,140,90,0.2)", borderRadius: 12, padding: "18px 20px", marginBottom: 28 }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#5C8C5A", fontWeight: 600, marginBottom: 5 }}>✦ Live demo — this is the actual project</p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#6B5A42", lineHeight: 1.7, fontWeight: 300 }}>The Follow-Up Mailer runs right here. Describe your context and it'll draft a contextual email about this project. Swap in your own code when ready.</p>
            </div>
            <textarea value={visitorCtx} onChange={e => setVisitorCtx(e.target.value)}
              placeholder="e.g. I want to collaborate on a similar RAG system, I have questions about the multilingual support..."
              rows={3} style={{ ...iStyle, resize: "vertical", lineHeight: 1.7, marginBottom: 14 }} />
            <button onClick={genMail} disabled={mailLoading}
              style={{ fontFamily: "'DM Sans'", background: mailLoading ? "#A89070" : "#5C8C5A", color: "#fff", border: "none", padding: "12px 26px", borderRadius: 40, fontSize: 13, fontWeight: 500, cursor: mailLoading ? "wait" : "pointer" }}>
              {mailLoading ? "Drafting email…" : "✦ Draft Follow-Up Email"}
            </button>
            {mailDraft && (
              <div style={{ marginTop: 22, background: "#FAF7F2", border: "1px solid #DDD0BC", borderRadius: 14, padding: "22px 24px" }}>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#5C8C5A", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Drafted Email</p>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#4A3D2C", lineHeight: 1.9, whiteSpace: "pre-wrap", fontWeight: 300 }}>{mailDraft}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button onClick={() => navigator.clipboard.writeText(mailDraft)}
                    style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#5C8C5A", background: "none", border: "1px solid rgba(92,140,90,0.3)", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>Copy</button>
                  <button onClick={() => setMailDraft("")}
                    style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070", background: "none", border: "none", cursor: "pointer" }}>Regenerate</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
