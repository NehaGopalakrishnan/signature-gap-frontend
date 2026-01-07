import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Upload() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const handleContinue = () => {
    if (!text || text.length < 50) {
      alert("Please paste at least 50 characters of contract text.");
      return;
    }

    // 🔑 Store TEXT for Processing.jsx
    sessionStorage.setItem("extractedText", text);

    navigate("/mask");
  };

  return (
    <div style={ui.page}>
      <Card>
        <div style={ui.card}>
          <h2 style={ui.heading}>Upload Contract Text</h2>

          <p style={ui.text}>
            Paste the contract text below.  
            (PDF upload can be added later — this is the MVP-safe flow)
          </p>

          <textarea
            rows="10"
            placeholder="Paste full contract text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              marginTop: "12px"
            }}
          />

          <div style={{ marginTop: "24px" }}>
            <button style={ui.primaryButton} onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
