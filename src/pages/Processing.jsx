import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        // 1️⃣ Get extracted text from sessionStorage
        const extractedText = sessionStorage.getItem("extractedText");

        if (!extractedText || extractedText.length < 50) {
          alert("No valid document text found. Please upload again.");
          navigate("/upload");
          return;
        }

        // 2️⃣ Call backend /api/analyze (JSON ONLY)
        const response = await fetch(`${BACKEND_URL}/api/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: extractedText,
            contract_name: "Uploaded Contract",
            user_role: "general"
          })
        });

        if (!response.ok) {
          throw new Error("Backend returned an error");
        }

        const data = await response.json();

        // 3️⃣ Store analysis for Result page
        sessionStorage.setItem("analysis", JSON.stringify(data));

        navigate("/result");
      } catch (err) {
        console.error(err);
        alert("Failed to connect to backend");
        navigate("/upload");
      }
    };

    analyzeDocument();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is analyzing your contract for risks…</p>
      <p style={{ fontSize: "13px", color: "gray" }}>
        This usually takes a few seconds
      </p>
    </div>
  );
}
