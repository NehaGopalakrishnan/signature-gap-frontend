import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Please upload a file under 5MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleContinue = () => {
    if (!selectedFile) {
      alert("Please upload a document before continuing.");
      return;
    }

    // ✅ Pass file via navigation state (safe, in-memory)
    navigate("/mask", {
      state: { file: selectedFile }
    });
  };

  return (
    <div style={ui.page}>
      <Card>
        <div style={ui.card}>
          <h2 style={ui.heading}>Upload Your Document</h2>

          <p style={ui.text}>
            Upload a legal document such as a contract, agreement, or official notice.
            Both scanned and digital documents are supported.
          </p>

          {/* Upload Box */}
          <div
            style={{
              marginTop: "20px",
              padding: "24px",
              border: "2px dashed #c7d2fe",
              borderRadius: "12px",
              backgroundColor: "#f8fafc",
              textAlign: "center"
            }}
          >
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              style={{ marginBottom: "12px" }}
            />

            <p style={ui.mutedText}>
              Supported formats: PDF, JPG, PNG (max 5MB)
            </p>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <p style={{ ...ui.text, marginTop: "16px", color: "#16a34a" }}>
              Selected file: <strong>{selectedFile.name}</strong>
            </p>
          )}

          {/* Continue */}
          <div style={{ marginTop: "28px" }}>
            <button style={ui.primaryButton} onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
