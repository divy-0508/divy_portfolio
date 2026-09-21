import { useState, useRef } from "react";
import { useState, useRef, useEffect } from "react";

const API_URL = "https://next-word-port.onrender.com"; // ← paste your Render link here

export default function WordPredictor() {
    const [text, setText] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debounceRef = useRef(null);
    useEffect(() => {
        fetch(`${API_URL}/health`).catch(() => { });
    }, []);

    async function predict(input) {
        if (!input.trim()) { setPredictions([]); return; }
        setLoading(true); setError("");
        try {
            const res = await fetch(`${API_URL}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input }),
            });
            const data = await res.json();
            setPredictions(data.predictions || []);
        } catch {
            setError("Could not reach the model. It may be waking up — try again in a moment.");
            setPredictions([]);
        }
        setLoading(false);
    }

    function handleInput(e) {
        const val = e.target.value;
        setText(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => predict(val), 500);
    }

    function appendWord(word) {
        const newText = text.trimEnd() + " " + word;
        setText(newText);
        predict(newText);
    }

    return (
        <div style={{ background: "#FAF7F2", border: "1px solid #E0D5C5", borderRadius: 16, padding: "24px 26px", marginTop: 28 }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5C8C5A", fontWeight: 600, marginBottom: 16 }}>
                ✦ Live Demo — LSTM Next Word Predictor
            </p>

            {/* Text input */}
            <div style={{ position: "relative", marginBottom: 16 }}>
                <textarea
                    value={text}
                    onChange={handleInput}
                    placeholder="Start typing anything… the model predicts what comes next"
                    rows={3}
                    style={{ width: "100%", background: "#F7F4EE", border: "1px solid #DDD0BC", borderRadius: 10, padding: "13px 16px", color: "#2C2415", fontFamily: "'DM Sans'", fontSize: 15, outline: "none", resize: "vertical", lineHeight: 1.7, fontWeight: 300 }}
                    onFocus={e => e.target.style.borderColor = "#5C8C5A"}
                    onBlur={e => e.target.style.borderColor = "#DDD0BC"}
                />
                {loading && (
                    <div style={{ position: "absolute", bottom: 14, right: 14, width: 16, height: 16, border: "2px solid #E0D5C5", borderTop: "2px solid #5C8C5A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
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
                                    fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 500,
                                    padding: "8px 18px", borderRadius: 40, cursor: "pointer",
                                    border: "1px solid #DDD0BC", background: "#F7F4EE", color: "#2C2415",
                                    transition: "all 0.2s",
                                    opacity: 0.4 + (p.confidence * 0.6), // dimmer = less confident
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#5C8C5A"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#5C8C5A"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#F7F4EE"; e.currentTarget.style.color = "#2C2415"; e.currentTarget.style.borderColor = "#DDD0BC"; }}
                                title={`Confidence: ${(p.confidence * 100).toFixed(1)}%`}
                            >
                                {p.word}
                                <span style={{ fontSize: 10, color: "#A89070", marginLeft: 6 }}>
                                    {(p.confidence * 100).toFixed(0)}%
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#C4895A", marginTop: 12, fontWeight: 300 }}>{error}</p>
            )}

            <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#C4A882", marginTop: 16, fontWeight: 300, fontStyle: "italic" }}>
                Powered by an LSTM model trained on text sequences · hosted on Render
            </p>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}