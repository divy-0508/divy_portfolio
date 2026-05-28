import { useEffect, useRef, useState } from "react";

const REACTIONS = {
  happy:     { emoji: "😄", line: "You're smiling already — you'll love what's inside.", accent: "#5C8C5A" },
  surprised: { emoji: "😮", line: "Surprised? The best part is still ahead.", accent: "#8B6F47" },
  neutral:   { emoji: "😌", line: "Calm and focused. Let's get into it.", accent: "#5C8C5A" },
  sad:       { emoji: "🥺", line: "Chin up — there's exciting work ahead.", accent: "#7B9E8A" },
  angry:     { emoji: "😤", line: "That energy? Channel it. You'll fit right in.", accent: "#C4895A" },
  fearful:   { emoji: "😨", line: "No scary stuff here. Just ML models and late nights.", accent: "#7B9E8A" },
  disgusted: { emoji: "😏", line: "Fair reaction to another portfolio. This one's different.", accent: "#8B6F47" },
  default:   { emoji: "👋", line: "Welcome. Divyansh is glad you stopped by.", accent: "#5C8C5A" },
};

export default function EmotionWelcome({ onEnter }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState("intro"); // intro | loading | detecting | done | error
  const [emotion, setEmotion] = useState("default");
  const [dots, setDots] = useState(1);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setDots(d => d >= 3 ? 1 : d + 1), 500);
    return () => clearInterval(t);
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(intervalRef.current);
    clearTimeout(timerRef.current);
  }

  async function startDetection() {
    setPhase("loading");
    try {
      if (!window.faceapi) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const BASE = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
      await Promise.all([
        window.faceapi.nets.tinyFaceDetector.loadFromUri(BASE),
        window.faceapi.nets.faceExpressionNet.loadFromUri(BASE),
      ]);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 320, height: 240 } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await new Promise(r => { videoRef.current.onloadedmetadata = r; });
      await videoRef.current.play();
      setPhase("detecting");

      let tries = 0;
      intervalRef.current = setInterval(async () => {
        tries++;
        try {
          const r = await window.faceapi
            .detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions({ inputSize: 160 }))
            .withFaceExpressions();
          if (r?.expressions) {
            const top = Object.entries(r.expressions).sort((a, b) => b[1] - a[1])[0][0];
            setEmotion(top);
            setPhase("done");
            stopStream();
          } else if (tries > 30) {
            setEmotion("default");
            setPhase("done");
            stopStream();
          }
        } catch {}
      }, 350);

      timerRef.current = setTimeout(() => {
        if (phase !== "done") { setEmotion("default"); setPhase("done"); stopStream(); }
      }, 12000);
    } catch {
      setPhase("error");
      stopStream();
    }
  }

  useEffect(() => () => stopStream(), []);

  const reaction = REACTIONS[emotion] || REACTIONS.default;
  const dotStr = ".".repeat(dots);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#F7F4EE",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Lora', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .ew-skip:hover { background: rgba(0,0,0,0.06) !important; }
        .ew-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(92,140,90,0.25) !important; }
        .ew-start:hover { background: #4a7a48 !important; }
      `}</style>

      <button className="ew-skip" onClick={() => { stopStream(); onEnter(); }}
        style={{ position: "absolute", top: 20, right: 20, fontFamily: "'DM Sans'", fontSize: 13, color: "#999", background: "transparent", border: "1px solid #ddd", borderRadius: 20, padding: "6px 16px", cursor: "pointer", transition: "background 0.2s" }}>
        skip
      </button>

      <video ref={videoRef} style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} muted playsInline />

      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 32px", animation: "fadeSlideUp 0.6s ease" }}>

        {phase === "intro" && (
          <>
            <div style={{ fontSize: 52, marginBottom: 20, animation: "breathe 3s ease-in-out infinite" }}>🤖</div>
            <h2 style={{ fontSize: 28, fontWeight: 600, color: "#2C2C2C", marginBottom: 10, letterSpacing: "-0.02em" }}>
              Before you enter —
            </h2>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#888", lineHeight: 1.7, marginBottom: 32, fontWeight: 300 }}>
              One of my projects detects facial expressions in real-time.<br />
              Want to see it working live, right now?
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="ew-start" onClick={startDetection}
                style={{ fontFamily: "'DM Sans'", background: "#5C8C5A", color: "#fff", border: "none", padding: "13px 28px", borderRadius: 40, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }}>
                Yes, detect my expression
              </button>
              <button onClick={onEnter}
                style={{ fontFamily: "'DM Sans'", background: "transparent", color: "#999", border: "1px solid #ddd", padding: "13px 24px", borderRadius: 40, fontSize: 14, cursor: "pointer" }}>
                Just enter →
              </button>
            </div>
          </>
        )}

        {phase === "loading" && (
          <>
            <div style={{ width: 48, height: 48, border: "2px solid #e8e0d4", borderTop: "2px solid #5C8C5A", borderRadius: "50%", margin: "0 auto 28px", animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 20, color: "#2C2C2C", fontWeight: 500, marginBottom: 8 }}>Loading models{dotStr}</p>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#aaa", fontWeight: 300 }}>face-api.js · runs entirely in your browser</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </>
        )}

        {phase === "detecting" && (
          <>
            <div style={{ width: 80, height: 80, border: "3px solid #E8E0D4", borderTop: `3px solid #5C8C5A`, borderRadius: "50%", margin: "0 auto 28px", animation: "spin 1.2s linear infinite" }} />
            <p style={{ fontSize: 20, color: "#2C2C2C", fontWeight: 500, marginBottom: 8 }}>Reading your expression{dotStr}</p>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#aaa", fontWeight: 300 }}>Look at your camera for a moment</p>
          </>
        )}

        {phase === "done" && (
          <>
            <div style={{ fontSize: 68, marginBottom: 18, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>{reaction.emoji}</div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#bbb", marginBottom: 12 }}>
              expression detected · {emotion}
            </p>
            <p style={{ fontSize: 22, fontWeight: 500, color: "#2C2C2C", lineHeight: 1.5, marginBottom: 32, letterSpacing: "-0.01em" }}>
              {reaction.line}
            </p>
            <button className="ew-btn" onClick={onEnter}
              style={{ fontFamily: "'DM Sans'", background: reaction.accent, color: "#fff", border: "none", padding: "14px 36px", borderRadius: 40, fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "all 0.25s", boxShadow: `0 4px 16px ${reaction.accent}40` }}>
              Enter Portfolio →
            </button>
          </>
        )}

        {phase === "error" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📷</div>
            <p style={{ fontSize: 20, fontWeight: 500, color: "#2C2C2C", marginBottom: 8 }}>Camera not available</p>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#aaa", lineHeight: 1.7, marginBottom: 28, fontWeight: 300 }}>No worries — you can still explore the portfolio.<br />The expression detection is live on the project page.</p>
            <button className="ew-btn" onClick={onEnter}
              style={{ fontFamily: "'DM Sans'", background: "#5C8C5A", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 40, fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.25s", boxShadow: "0 4px 16px rgba(92,140,90,0.25)" }}>
              Enter Portfolio →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
