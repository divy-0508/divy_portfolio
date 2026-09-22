import { useState, useRef, useEffect } from "react";

const API_URL = "https://next-word-port.onrender.com"; // ← your Render link

export async function predictNextWord(text) {
  if (!text.trim()) return [];
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data.predictions || [];
  } catch {
    return [];
  }
}

export default function WordPredictor() {
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [ghost, setGhost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
  }, []);

  async function predict(input) {
    if (!input.trim()) { setPredictions([]); setGhost(""); return; }
    setLoading(true); setError("");
    const results = await predictNextWord(input);
    if (results.length > 0) {
      setPredictions(results);
      setGhost(results[0].word);
    } else {
      setPredictions([]); setGhost("");
      setError("Could not reach the model — it may be waking up, try again.");
    }
    setLoading(false);
  }

  function handleInput(e) {
    const val = e.target.value;
    setText(val);
    setGhost("");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => predict(val), 500);
  }

  function handleKeyDown(e) {
    if ((e.key === "Tab" || e.key === "ArrowRight") && ghost) {
      e.preventDefault();
      const newText = text.trimEnd() + " " + ghost;
      setText(newText);
      setGhost("");
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => predict(newText), 500);
    }
  }

  function appendWord(word) {
    const newText = text.trimEnd() + " " + word;
    setText(newText);
    setGhost("");
    predict(newText);
    textareaRef.current?.focus();
  }

  const lastWord = ghost ? ghost : "";

  return (
    <div style={{ background: "#FAF7F2", border: "1px solid #E0D5C5", borderRadius: 16, padding: "24px 26px", marginTop: 28 }}>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5C8C5A", fontWeight: 600, marginBottom: 6 }}>
        ✦ Live Demo — LSTM Next Word Predictor
      </p>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#A89070", marginBottom: 16, fontWeight: 300 }}>
        Type anything · press <kbd style={{ background: "#EDE6DA", border: "1px solid #DDD0BC", borderRadius: 4, padding: "1px 6px", fontSize: 11 }}>Tab</kbd> to accept suggestion
      </p>

      {/* Ghost text layer + textarea stacked */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        {/* Ghost layer — sits behind textarea, shows accepted + ghost word */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          padding: "13px 16px", fontFamily: "'DM Sans'", fontSize: 15,
          lineHeight: 1.7, fontWeight: 300, pointerEvents: "none",
          whiteSpace: "pre-wrap", wordBreak: "break-word", borderRadius: 10,
          color: "transparent",
        }}>
          {text.trimEnd()}
          {lastWord && (
            <span style={{ color: "#B0A090" }}>{" " + lastWord}</span>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Start typing… model predicts the next word"
          rows={3}
          style={{
            position: "relative", width: "100%",
            background: lastWord ? "rgba(247,244,238,0.85)" : "#F7F4EE",
            border: "1px solid #DDD0BC", borderRadius: 10,
            padding: "13px 16px", color: "#2C2415",
            fontFamily: "'DM Sans'", fontSize: 15, outline: "none",
            resize: "vertical", lineHeight: 1.7, fontWeight: 300,
            transition: "border 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "#5C8C5A"}
          onBlur={e => e.target.style.borderColor = "#DDD0BC"}
        />
        {loading && (
          <div style={{ position: "absolute", bottom: 14, right: 14, width: 14, height: 14, border: "2px solid #E0D5C5", borderTop: "2px solid #5C8C5A", borderRadius: "50%", animation: "wpspin 0.8s linear infinite" }} />
        )}
      </div>

      {/* Prediction chips */}
      {predictions.length > 0 && (
        <div>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#A89070", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>
            Top predictions — click to append
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {predictions.map((p, i) => (
              <button key={i} onClick={() => appendWord(p.word)}
                style={{
                  fontFamily: "'DM Sans'", fontSize: 13, fontWeight: i === 0 ? 600 : 400,
                  padding: "7px 16px", borderRadius: 40, cursor: "pointer",
                  border: i === 0 ? "1px solid #5C8C5A" : "1px solid #DDD0BC",
                  background: i === 0 ? "rgba(92,140,90,0.08)" : "#F7F4EE",
                  color: i === 0 ? "#5C8C5A" : "#6B5A42",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#5C8C5A"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#5C8C5A"; }}
                onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? "rgba(92,140,90,0.08)" : "#F7F4EE"; e.currentTarget.style.color = i === 0 ? "#5C8C5A" : "#6B5A42"; e.currentTarget.style.borderColor = i === 0 ? "#5C8C5A" : "#DDD0BC"; }}
                title={`${(p.confidence * 100).toFixed(1)}% confidence`}
              >
                {p.word}
                <span style={{ fontSize: 10, marginLeft: 5, opacity: 0.6 }}>{(p.confidence * 100).toFixed(0)}%</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#C4895A", marginTop: 12, fontWeight: 300 }}>{error}</p>}
      <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4A882", marginTop: 16, fontWeight: 300, fontStyle: "italic" }}>
        LSTM model · hosted on Render · predictions update as you type
      </p>
      <style>{`@keyframes wpspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}