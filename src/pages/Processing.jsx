import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();
  const location = useLocation();

  const file = location.state?.file;

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        if (!file) {
          alert("No file found. Please upload a document again.");
          navigate("/upload");
          return;
        }

        // ✅ TEMP MVP: Convert file name to text placeholder
        // (Backend currently expects TEXT, not file)
        const textPayload = {
          text: `Analyze this legal document: ${file.name}`
        };

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(textPayload)
          }
        );

        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        const backendData = await response.json();

        sessionStorage.setItem(
          "analysis",
          JSON.stringify(backendData)
        );

        navigate("/result");
      } catch (error) {
        console.error(error);
        alert("Failed to connect to backend. Please try again.");
        navigate("/upload");
      }
    };

    analyzeDocument();
  }, [file, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is scanning your document for legal risks…</p>
      <p style={{ fontSize: "13px", color: "gray" }}>
        This usually takes a few seconds
      </p>
    </div>
  );
}
