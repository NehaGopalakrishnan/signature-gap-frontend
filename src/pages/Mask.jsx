import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Mask() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get file passed from Upload page
  const file = location.state?.file;

  const handleConfirm = () => {
    if (!file) {
      alert("No file found. Please upload a document again.");
      navigate("/upload");
      return;
    }

    // ✅ Pass file forward to Processing
    navigate("/processing", {
      state: { file }
    });
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
