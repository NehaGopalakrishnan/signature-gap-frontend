import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Mask() {
  const navigate = useNavigate();

  // ✅ Get TEXT stored from Upload.jsx
  const text = sessionStorage.getItem("extractedText");

  const handleConfirm = () => {
    if (!text || text.trim().length < 50) {
      alert("No document found. Please upload the contract again.");
      navigate("/upload");
      return;
    }

    // ✅ Just move forward (Processing will read from sessionStorage)
    navigate("/processing");
  };

  return (
    <div style={ui.page}>
      <Card>
        <div style={ui.card}>
          <h2 style={ui.heading}>Privacy Masking</h2>

          <p style={ui.text}>
            Before analysis, sensitive personal information will be automatically
            masked to protect your privacy.
          </p>

          <div
            style={{
              marginTop: "16px",
              padding: "14px",
              backgroundColor: "#eef2ff",
              borderRadius: "10px",
              color: "#1e3a8a",
              fontSize: "14px"
            }}
          >
            🔒 Names, ID numbers, contact details, and bank information are not stored
            and are processed temporarily.
          </div>

          <div style={{ marginTop: "28px" }}>
            <button style={ui.primaryButton} onClick={handleConfirm}>
              Confirm & Analyze
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
