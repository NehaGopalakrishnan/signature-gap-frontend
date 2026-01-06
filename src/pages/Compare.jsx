import { useState } from "react";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Compare() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [result, setResult] = useState(null);

  const handleCompare = () => {
    if (!fileA || !fileB) {
      alert("Please upload both documents");
      return;
    }

    // 🔹 MVP comparison logic (placeholder)
    const better =
      fileA.size < fileB.size ? "Document A" : "Document B";

    setResult({
      better,
      reason:
        "The smaller document is likely more concise and user-friendly."
    });
  };

  return (
    <div style={ui.page}>
      <Card>
        <div style={ui.card}>
          <h2 style={ui.heading}>Compare Two Documents</h2>

          <p style={ui.text}>
            Upload two legal documents to compare which one is more concise and
            potentially more user-friendly.
          </p>

          {/* DOCUMENT UPLOADS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "24px"
            }}
          >
            {/* Document A */}
            <div>
              <h4 style={ui.subHeading}>Document A</h4>

              <div
                style={{
                  padding: "16px",
                  border: "2px dashed #c7d2fe",
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  textAlign: "center"
                }}
              >
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFileA(e.target.files[0])}
                />
              </div>

              {fileA && (
                <p style={{ ...ui.text, color: "#16a34a", marginTop: "8px" }}>
                  Selected: <strong>{fileA.name}</strong>
                </p>
              )}
            </div>

            {/* Document B */}
            <div>
              <h4 style={ui.subHeading}>Document B</h4>

              <div
                style={{
                  padding: "16px",
                  border: "2px dashed #c7d2fe",
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  textAlign: "center"
                }}
              >
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFileB(e.target.files[0])}
                />
              </div>

              {fileB && (
                <p style={{ ...ui.text, color: "#16a34a", marginTop: "8px" }}>
                  Selected: <strong>{fileB.name}</strong>
                </p>
              )}
            </div>
          </div>

          {/* COMPARE BUTTON */}
          <div style={{ marginTop: "28px" }}>
            <button style={ui.secondaryButton} onClick={handleCompare}>
              Compare Documents
            </button>
          </div>

          {/* RESULT */}
          {result && (
            <div
              style={{
                marginTop: "32px",
                padding: "20px",
                backgroundColor: "#ecfeff",
                borderRadius: "12px",
                border: "1px solid #67e8f9"
              }}
            >
              <h3 style={ui.subHeading}>Comparison Result</h3>

              <p style={ui.text}>
                <strong>{result.better}</strong> is more user-friendly.
              </p>

              <p style={ui.mutedText}>{result.reason}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
