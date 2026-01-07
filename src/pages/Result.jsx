import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Result() {
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const navigate = useNavigate();

  // ✅ Parse sessionStorage safely with useMemo
  const data = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("analysis");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error("Failed to parse analysis data:", err);
    }
    return {
      risk_level: "Unknown",
      summary: "No analysis available.",
      flags: [],
      user_warnings: []
    };
  }, []);

  // ✅ Risk color helper
  const riskColor = useCallback((level) => {
    switch (level) {
      case "High":
        return "#dc2626";
      case "Medium":
        return "#f59e0b";
      default:
        return "#16a34a";
    }
  }, []);

  // ✅ Fallback warnings with safe access
  const warnings = useMemo(() => {
    if (data.user_warnings && data.user_warnings.length > 0) {
      return data.user_warnings;
    }
    if (data.flags && data.flags.length > 0) {
      return data.flags.slice(0, 3).map(
        (f) => f?.explanation || "Please review this clause carefully"
      );
    }
    return ["Please review the document carefully before signing."];
  }, [data.user_warnings, data.flags]);

  // ✅ Translation function
  const fetchSarvamTranslation = useCallback(async (lang) => {
    if (lang === "en") {
      setTranslatedText("");
      return;
    }

    try {
      setIsTranslating(true);

      const res = await fetch(
        "https://legal-backend-fah0.onrender.com/api/translate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: data.summary,
            target_language: lang
          })
        }
      );

      if (!res.ok) {
        throw new Error(`Translation failed: ${res.status}`);
      }

      const result = await res.json();
      setTranslatedText(result.translated_text || "");
    } catch (err) {
      console.error("Translation error:", err);
      alert("Translation failed. Please try again.");
      setLanguage("en"); // Reset to English on failure
    } finally {
      setIsTranslating(false);
    }
  }, [data.summary]);

  // ✅ Final display text
  const finalText = useMemo(() => {
    return language === "en" || !translatedText
      ? data.summary
      : translatedText;
  }, [language, translatedText, data.summary]);

  // ✅ Audio playback with cleanup
  const playAudio = useCallback(() => {
    if (!finalText) return;

    const utterance = new SpeechSynthesisUtterance(finalText);
    
    const langMap = {
      ta: "ta-IN",
      hi: "hi-IN",
      en: "en-US"
    };
    utterance.lang = langMap[language] || "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [finalText, language]);

  // ✅ Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // ✅ Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  // ✅ Download summary
  const downloadSummary = useCallback(() => {
    const content = `DOCUMENT RISK SUMMARY
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
  }, [data.risk_level, finalText]);

  // ✅ Handle language change
  const handleLanguageChange = useCallback((e) => {
    const lang = e.target.value;
    setLanguage(lang);
    fetchSarvamTranslation(lang);
  }, [fetchSarvamTranslation]);

  return (
    <div style={ui.page}>
      <Card>
        <div style={ui.card}>
          <h2 style={ui.heading}>Document Risk Summary</h2>

          <p style={{ ...ui.text, marginBottom: "12px" }}>
            <strong>Overall Risk:</strong>{" "}
            <span
              style={{
                fontWeight: 600,
                color: riskColor(data.risk_level)
              }}
            >
              {data.risk_level}
            </span>
          </p>

          {isTranslating ? (
            <p style={ui.mutedText}>Translating…</p>
          ) : (
            <p style={ui.text}>{finalText}</p>
          )}

          {/* ACTIONS */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <button
              style={ui.primaryButton}
              onClick={() => setShowModal(true)}
              aria-haspopup="dialog"
            >
              Proceed to Sign
            </button>

            <button
              style={ui.secondaryButton}
              onClick={downloadSummary}
            >
              Download Summary
            </button>

            <button
              style={ui.secondaryButton}
              onClick={() => navigate("/compare")}
            >
              Compare Documents
            </button>
          </div>

          {/* AUDIO & LANGUAGE */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <label htmlFor="language-select" style={{ display: "none" }}>
              Select Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
              style={ui.select}
              disabled={isTranslating}
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
            </select>

            <button
              style={ui.dangerButton}
              onClick={playAudio}
              disabled={isTranslating}
              aria-label="Play audio"
            >
              🔊 Play Audio
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            style={{
              ...ui.card,
              maxWidth: "420px",
              position: "relative"
            }}
          >
            <h3 id="modal-title" style={ui.subHeading}>
              Before you sign
            </h3>
            <ul style={{ ...ui.text, paddingLeft: "20px" }}>
              {warnings.map((w, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  {w}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                style={ui.primaryButton}
                onClick={() => setShowModal(false)}
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
