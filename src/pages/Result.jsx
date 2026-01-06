import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Result() {
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const navigate = useNavigate();

  const data =
    JSON.parse(sessionStorage.getItem("analysis")) || {
      risk_level: "Unknown",
      summary: "No analysis available.",
      flags: [],
      user_warnings: []
    };

  // Risk color
  const riskColor = (level) => {
    if (level === "High") return "#dc2626";
    if (level === "Medium") return "#f59e0b";
    return "#16a34a";
  };

  // Fallback warnings
  const warnings =
    data.user_warnings && data.user_warnings.length > 0
      ? data.user_warnings
      : data.flags?.slice(0, 3).map(
          (f) => f.explanation || "Please review this clause carefully"
        );

  // 🔁 Sarvam Translation
  const fetchSarvamTranslation = async (lang) => {
    if (lang === "en") {
      setTranslatedText("");
      return;
    }

    try {
      setIsTranslating(true);

      const res = await fetch("https://legal-backend-fah0.onrender.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.summary,
          target_language: lang
        })
      });

      const result = await res.json();
      setTranslatedText(result.translated_text);
    } catch {
      alert("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const finalText =
    language === "en" || !translatedText
      ? data.summary
      : translatedText;

  // 🔊 Audio
  const playAudio = () => {
    if (!finalText) return;

    const utterance = new SpeechSynthesisUtterance(finalText);
    utterance.lang =
      language === "ta" ? "ta-IN" :
      language === "hi" ? "hi-IN" :
      "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // 📄 Download
  const downloadSummary = () => {
    const content = `
DOCUMENT RISK SUMMARY
=====================

Overall Risk Level: ${data.risk_level}

Summary:
${finalText}

Disclaimer:
For legal literacy only. Not legal advice.
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document_summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={ui.page}>
      <Card>
        <div style={ui.card}>
          <h2 style={ui.heading}>Document Risk Summary</h2>

          <p style={{ ...ui.text, marginBottom: "12px" }}>
            <strong>Overall Risk:</strong>{" "}
            <span style={{ fontWeight: 600, color: riskColor(data.risk_level) }}>
              {data.risk_level}
            </span>
          </p>

          {isTranslating ? (
            <p style={ui.mutedText}>Translating using Sarvam AI…</p>
          ) : (
            <p style={ui.text}>{finalText}</p>
          )}

          {/* ACTIONS */}
          <div style={{ marginTop: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={ui.primaryButton} onClick={() => setShowModal(true)}>
              Proceed to Sign
            </button>

            <button style={ui.secondaryButton} onClick={downloadSummary}>
              Download Summary
            </button>

            <button style={ui.secondaryButton} onClick={() => navigate("/compare")}>
              Compare Documents
            </button>
          </div>

          {/* AUDIO */}
          <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <select
              value={language}
              onChange={(e) => {
                const lang = e.target.value;
                setLanguage(lang);
                fetchSarvamTranslation(lang);
              }}
              style={ui.select}
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
            </select>

            <button style={ui.dangerButton} onClick={playAudio}>
              🔊 Play Translated Audio
            </button>
          </div>

          <p style={{ ...ui.mutedText, marginTop: "28px" }}>
            This tool provides legal literacy only and does not replace legal advice.
          </p>
        </div>
      </Card>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ ...ui.card, maxWidth: "420px" }}>
            <h3 style={ui.subHeading}>Before you sign</h3>
            <ul style={ui.text}>
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button style={ui.primaryButton} onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

