import { useState } from "react";
import { useData } from "../hooks/useData";
import { ADMIN_PASSWORD } from "../data/portfolioData";

export default function Admin({ onBack }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [section, setSection] = useState("personal");
  const { data, update, resetToDefault } = useData();

  const iS = { width: "100%", background: "#FAF7F2", border: "1px solid #DDD0BC", borderRadius: 10, padding: "11px 14px", color: "#2C2415", fontFamily: "'DM Sans'", fontSize: 14, outline: "none", fontWeight: 300 };
  const lS = { display: "block", fontFamily: "'DM Sans'", fontSize: 11, color: "#A89070", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7, fontWeight: 500 };
  const btnP = { background: "#2C2415", color: "#F7F4EE", border: "none", padding: "11px 26px", borderRadius: 40, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans'" };

  function login() {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); }
    else { setErr(true); setTimeout(() => setErr(false), 1400); }
  }

  if (!authed) return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", background: "#F7F4EE", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes shake{0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}}`}</style>
      <div style={{ textAlign: "center", maxWidth: 360, padding: "0 28px" }}>
        <div style={{ fontSize: 36, marginBottom: 20 }}>🔒</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1A1510", marginBottom: 8 }}>Admin Panel</h2>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#A89070", marginBottom: 28, fontWeight: 300 }}>Enter your passcode to manage portfolio content</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Passcode" style={{ ...iS, textAlign: "center", fontSize: 18, letterSpacing: "0.2em", marginBottom: 14, animation: err ? "shake 0.3s ease" : "none", borderColor: err ? "#C4895A" : "#DDD0BC" }} />
        {err && <p style={{ fontFamily: "'DM Sans'", color: "#C4895A", fontSize: 13, marginBottom: 12 }}>Incorrect passcode</p>}
        <button onClick={login} style={{ ...btnP, width: "100%", marginBottom: 14 }}>Enter</button>
        <button onClick={onBack} style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#A89070", background: "none", border: "none", cursor: "pointer" }}>← Back to portfolio</button>
      </div>
    </div>
  );

  const sections = ["personal", "contact", "projects", "skills", "timeline"];

  return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", background: "#F7F4EE", minHeight: "100vh", color: "#2C2415", display: "flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} .sb-btn:hover{background:#EDE6DA!important;}`}</style>
      <div style={{ width: 210, borderRight: "1px solid #E0D5C5", padding: "24px 14px", flexShrink: 0, height: "100vh", position: "sticky", top: 0, overflow: "auto" }}>
        <button onClick={onBack} style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#A89070", background: "none", border: "none", cursor: "pointer", marginBottom: 28, display: "flex", alignItems: "center", gap: 5 }}>← Portfolio</button>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4A882", marginBottom: 10, fontWeight: 500, paddingLeft: 10 }}>Sections</p>
        {sections.map(s => (
          <button key={s} className="sb-btn" onClick={() => setSection(s)}
            style={{ display: "block", width: "100%", textAlign: "left", fontFamily: "'DM Sans'", fontSize: 13, fontWeight: section === s ? 600 : 400, padding: "9px 12px", borderRadius: 8, marginBottom: 3, background: section === s ? "#EDE6DA" : "none", color: section === s ? "#2C2415" : "#8B7355", border: "none", cursor: "pointer", textTransform: "capitalize" }}>
            {s}
          </button>
        ))}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #E0D5C5" }}>
          <button onClick={() => { if (confirm("Reset all content to defaults?")) resetToDefault(); }}
            style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4895A", background: "none", border: "1px solid rgba(196,137,90,0.3)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", width: "100%" }}>
            Reset to defaults
          </button>
        </div>
      </div>
      <div style={{ flex: 1, padding: "36px 44px", overflow: "auto" }}>
        <div style={{ maxWidth: 680 }}>
          {section === "personal"  && <PersonalEd  data={data.personal}  onSave={v => update("personal", v)}  iS={iS} lS={lS} btnP={btnP} />}
          {section === "contact"   && <ContactEd   data={data.contact}   onSave={v => update("contact", v)}   iS={iS} lS={lS} btnP={btnP} />}
          {section === "projects"  && <ProjectsEd  data={data.projects}  onSave={v => update("projects", v)}  iS={iS} lS={lS} btnP={btnP} />}
          {section === "skills"    && <SkillsEd    data={data.skills}    onSave={v => update("skills", v)}    iS={iS} lS={lS} btnP={btnP} />}
          {section === "timeline"  && <TimelineEd  data={data.timeline}  onSave={v => update("timeline", v)}  iS={iS} lS={lS} btnP={btnP} />}
        </div>
      </div>
    </div>
  );
}

function Sec({ title, children }) {
  return <div><h2 style={{ fontFamily: "'Lora'", fontSize: 26, fontWeight: 700, color: "#1A1510", marginBottom: 28, letterSpacing: "-0.01em" }}>{title}</h2>{children}</div>;
}
function F({ label, lS, children }) {
  return <div style={{ marginBottom: 18 }}><label style={lS}>{label}</label>{children}</div>;
}
function Save({ onClick, btnP }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { onClick(); setOk(true); setTimeout(() => setOk(false), 2000); }}
      style={{ ...btnP, background: ok ? "#5C8C5A" : "#2C2415", transition: "background 0.3s" }}>
      {ok ? "✓ Saved!" : "Save Changes"}
    </button>
  );
}
function SmBtn({ onClick, label, color = "#5C8C5A" }) {
  return <button onClick={onClick} style={{ fontFamily: "'DM Sans'", fontSize: 12, color, background: `${color}10`, border: `1px solid ${color}28`, borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>{label}</button>;
}

function PersonalEd({ data, onSave, iS, lS, btnP }) {
  const [f, setF] = useState({ ...data });
  return (
    <Sec title="Personal Info">
      <F label="Full Name" lS={lS}><input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={iS} /></F>
      <F label="Role / Title" lS={lS}><input value={f.role} onChange={e => setF(p => ({ ...p, role: e.target.value }))} style={iS} /></F>
      <F label="Tagline" lS={lS}><input value={f.tagline} onChange={e => setF(p => ({ ...p, tagline: e.target.value }))} style={iS} /></F>
      <F label="College" lS={lS}><input value={f.college} onChange={e => setF(p => ({ ...p, college: e.target.value }))} style={iS} /></F>
      <F label="Year & Branch" lS={lS}><input value={f.year} onChange={e => setF(p => ({ ...p, year: e.target.value }))} style={iS} /></F>
      <F label="Bio" lS={lS}><textarea value={f.bio} onChange={e => setF(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...iS, resize: "vertical" }} /></F>
      <Save onClick={() => onSave(f)} btnP={btnP} />
    </Sec>
  );
}

function ContactEd({ data, onSave, iS, lS, btnP }) {
  const [f, setF] = useState({ ...data });
  return (
    <Sec title="Contact Links">
      {["email","github","linkedin","kaggle","resume"].map(k => (
        <F key={k} label={k.charAt(0).toUpperCase()+k.slice(1)} lS={lS}>
          <input value={f[k]||""} onChange={e => setF(p => ({ ...p, [k]: e.target.value }))} style={iS} placeholder={k === "email" ? "you@email.com" : "https://..."} />
        </F>
      ))}
      <Save onClick={() => onSave(f)} btnP={btnP} />
    </Sec>
  );
}

function ProjectsEd({ data, onSave, iS, lS, btnP }) {
  const [items, setItems] = useState(data.map(p => ({ ...p })));
  const [editing, setEditing] = useState(null);
  const upd = (id, k, v) => setItems(ps => ps.map(p => p.id === id ? { ...p, [k]: v } : p));
  const del = id => { if (confirm("Delete?")) setItems(ps => ps.filter(p => p.id !== id)); };
  const add = () => {
    const n = { id: `p${Date.now()}`, name: "New Project", tagline: "", description: "", tech: [], github: "", live: "", video: "", videoDescription: "", category: "ML", highlight: false, isMailing: false };
    setItems(ps => [...ps, n]); setEditing(n.id);
  };
  const p = editing ? items.find(x => x.id === editing) : null;
  return (
    <Sec title="Projects">
      {!editing ? (
        <>
          {items.map(proj => (
            <div key={proj.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "#FAF7F2", border: "1px solid #E0D5C5", borderRadius: 10, marginBottom: 8 }}>
              <div>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500, color: "#1A1510" }}>{proj.name}</p>
                <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070" }}>{proj.category}{proj.isMailing?" · AI Demo":""}{proj.highlight?" · Featured":""}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <SmBtn onClick={() => setEditing(proj.id)} label="Edit" />
                <SmBtn onClick={() => del(proj.id)} label="Delete" color="#C4895A" />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={add} style={{ ...btnP, background: "#5C8C5A" }}>+ Add Project</button>
            <Save onClick={() => onSave(items)} btnP={btnP} />
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => setEditing(null)} style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#A89070", background: "none", border: "none", cursor: "pointer", marginBottom: 22 }}>← Back to list</button>
          <F label="Name" lS={lS}><input value={p.name} onChange={e => upd(p.id,"name",e.target.value)} style={iS} /></F>
          <F label="Tagline" lS={lS}><input value={p.tagline} onChange={e => upd(p.id,"tagline",e.target.value)} style={iS} /></F>
          <F label="Description" lS={lS}><textarea value={p.description} onChange={e => upd(p.id,"description",e.target.value)} rows={4} style={{ ...iS, resize: "vertical" }} /></F>
          <F label="Tech Stack (comma-separated)" lS={lS}><input value={p.tech.join(", ")} onChange={e => upd(p.id,"tech",e.target.value.split(",").map(t=>t.trim()).filter(Boolean))} style={iS} /></F>
          <F label="Category" lS={lS}><input value={p.category} onChange={e => upd(p.id,"category",e.target.value)} style={iS} /></F>
          <F label="GitHub URL" lS={lS}><input value={p.github} onChange={e => upd(p.id,"github",e.target.value)} style={iS} placeholder="https://github.com/..." /></F>
          <F label="Live Demo URL" lS={lS}><input value={p.live} onChange={e => upd(p.id,"live",e.target.value)} style={iS} /></F>
          <F label="YouTube Video URL" lS={lS}><input value={p.video} onChange={e => upd(p.id,"video",e.target.value)} style={iS} placeholder="https://youtube.com/watch?v=..." /></F>
          <F label="Video Description" lS={lS}><textarea value={p.videoDescription} onChange={e => upd(p.id,"videoDescription",e.target.value)} rows={2} style={{ ...iS, resize: "vertical" }} /></F>
          <div style={{ display: "flex", gap: 24, marginBottom: 22 }}>
            <label style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#6B5A42", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={p.highlight} onChange={e => upd(p.id,"highlight",e.target.checked)} /> Featured
            </label>
            <label style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#6B5A42", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={p.isMailing} onChange={e => upd(p.id,"isMailing",e.target.checked)} /> Show Mailer tab
            </label>
          </div>
          <Save onClick={() => { onSave(items); setEditing(null); }} btnP={btnP} />
        </div>
      )}
    </Sec>
  );
}

function SkillsEd({ data, onSave, iS, lS, btnP }) {
  const [skills, setSkills] = useState({ ...data });
  const [newCat, setNewCat] = useState("");
  return (
    <Sec title="Skills">
      {Object.entries(skills).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <label style={lS}>{cat}</label>
            <button onClick={() => { const s={...skills}; delete s[cat]; setSkills(s); }} style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4895A", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
          </div>
          <input value={items.join(", ")} onChange={e => setSkills(s => ({ ...s, [cat]: e.target.value.split(",").map(x=>x.trim()).filter(Boolean) }))} style={iS} placeholder="Skill 1, Skill 2" />
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input value={newCat} onChange={e => setNewCat(e.target.value)} style={{ ...iS, flex: 1 }} placeholder="New category name" onKeyDown={e => { if (e.key==="Enter"&&newCat.trim()) { setSkills(s=>({...s,[newCat.trim()]:[]})); setNewCat(""); }}} />
        <button onClick={() => { if (newCat.trim()) { setSkills(s=>({...s,[newCat.trim()]:[]})); setNewCat(""); }}} style={{ ...btnP, padding: "11px 18px", background: "#5C8C5A" }}>Add</button>
      </div>
      <Save onClick={() => onSave(skills)} btnP={btnP} />
    </Sec>
  );
}

function TimelineEd({ data, onSave, iS, lS, btnP }) {
  const [items, setItems] = useState(data.map(t => ({ ...t })));
  const [editing, setEditing] = useState(null);
  const upd = (id, k, v) => setItems(ts => ts.map(t => t.id === id ? { ...t, [k]: v } : t));
  const del = id => { if (confirm("Delete this chapter?")) setItems(ts => ts.filter(t => t.id !== id)); };
  const add = () => {
    const n = { id: `t${Date.now()}`, year: "2026", emoji: "⭐", title: "New chapter", subtitle: "", story: "", tags: [], mood: "curious" };
    setItems(ts => [...ts, n]); setEditing(n.id);
  };
  const item = editing ? items.find(x => x.id === editing) : null;
  return (
    <Sec title="Timeline / Story">
      {!editing ? (
        <>
          {items.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "#FAF7F2", border: "1px solid #E0D5C5", borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{t.emoji}</span>
                <div>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500, color: "#1A1510" }}>{t.title}</p>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070" }}>{t.year}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <SmBtn onClick={() => setEditing(t.id)} label="Edit" />
                <SmBtn onClick={() => del(t.id)} label="Delete" color="#C4895A" />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={add} style={{ ...btnP, background: "#5C8C5A" }}>+ Add Chapter</button>
            <Save onClick={() => onSave(items)} btnP={btnP} />
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => setEditing(null)} style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#A89070", background: "none", border: "none", cursor: "pointer", marginBottom: 22 }}>← Back</button>
          <F label="Year / Period" lS={lS}><input value={item.year} onChange={e => upd(item.id,"year",e.target.value)} style={iS} /></F>
          <F label="Emoji" lS={lS}><input value={item.emoji} onChange={e => upd(item.id,"emoji",e.target.value)} style={{ ...iS, width: 60 }} /></F>
          <F label="Title" lS={lS}><input value={item.title} onChange={e => upd(item.id,"title",e.target.value)} style={iS} /></F>
          <F label="Subtitle" lS={lS}><input value={item.subtitle} onChange={e => upd(item.id,"subtitle",e.target.value)} style={iS} /></F>
          <F label="Story" lS={lS}><textarea value={item.story} onChange={e => upd(item.id,"story",e.target.value)} rows={5} style={{ ...iS, resize: "vertical" }} /></F>
          <F label="Tags (comma-separated)" lS={lS}><input value={item.tags.join(", ")} onChange={e => upd(item.id,"tags",e.target.value.split(",").map(t=>t.trim()).filter(Boolean))} style={iS} /></F>
          <F label="Mood (curious / electric / mindblown / proud / building)" lS={lS}><input value={item.mood} onChange={e => upd(item.id,"mood",e.target.value)} style={iS} /></F>
          <Save onClick={() => { onSave(items); setEditing(null); }} btnP={btnP} />
        </div>
      )}
    </Sec>
  );
}
