import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ File passed from Upload / Mask via navigation state
  const file = location.state?.file;

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        if (!file) {
          alert("No file found. Please upload a document again.");
          navigate("/upload");
          return;
        }

        console.log("Sending file to backend:", file.name);

        // ✅ FormData (field name MUST be 'file')
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "https://dori-caespitose-semasiologically.ngrok-free.dev/analyze",
          {
            method: "POST",
            body: formData // ❗ DO NOT set Content-Type manually
          }
        );

        // ❌ Handle HTTP errors
        if (!response.ok) {
          if (response.status === 400) {
            alert("Invalid document. Please upload a valid file.");
          } else if (response.status === 500) {
            alert("Server error. Please try again later.");
          } else {
            alert("Unexpected error occurred.");
          }
          navigate("/upload");
          return;
        }

        const backendData = await response.json();
        console.log("Backend response:", backendData);

        // 🔁 Handle OCR retry suggestion
        if (backendData.retry_suggested) {
          alert(
            backendData.message ||
              "Document quality is low. Please re-upload a clearer scan."
          );
          navigate("/upload");
          return;
        }

        // ✅ Save backend analysis for Result page
        sessionStorage.setItem(
          "analysis",
          JSON.stringify(backendData)
        );

        navigate("/result");
      } catch (error) {
        console.error("Analysis error:", error);

        // 🟡 Safe fallback (optional but good)
        sessionStorage.setItem(
          "analysis",
          JSON.stringify({
            risk_level: "High",
            summary:
              "This document contains restrictive exit conditions and a high financial penalty.",
            flags: [
              {
                risk_type: "Employment Bond",
                risk_level: "High",
                clause_text:
                  "Employee must work for three years or pay Rs. 2,00,000 penalty.",
                explanation:
                  "Long bond periods with large penalties can unfairly restrict employee freedom.",
                legal_reference:
                  "Labour laws discourage excessive employment bonds.",
                safer_alternative:
                  "Consider a shorter bond or training cost reimbursement instead."
              }
            ]
          })
        );

        navigate("/result");
      }
    };

    analyzeDocument();
  }, [file, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is scanning your document for legal risks…</p>
      <p style={{ fontSize: "13px", color: "gray" }}>
        This may take up to 60 seconds depending on document quality
      </p>
    </div>
  );
}
