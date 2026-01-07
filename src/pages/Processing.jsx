import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        // ✅ Get text from sessionStorage
        const text = sessionStorage.getItem("extractedText");

        if (!text || text.trim().length < 50) {
          alert("No valid contract text found. Please upload again.");
          navigate("/upload");
          return;
        }

        // ✅ Call backend (FINAL correct endpoint)
        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/api/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: text,
              contract_name: "Contract",
              user_role: "general"
            })
          }
        );

        // 🔴 Log backend errors properly
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend error:", errorText);
          alert("Backend rejected the request. Check console.");
          navigate("/upload");
          return;
        }

        const result = await response.json();

        // ✅ STORE ONLY analysis (THIS IS THE KEY FIX)
        sessionStorage.setItem(
          "analysis",
          JSON.stringify(result.analysis)
        );

        navigate("/result");
      } catch (error) {
        console.error("Network / CORS error:", error);
        alert("Failed to connect to backend");
        navigate("/upload");
      }
    };

    analyzeDocument();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is scanning your contract for legal risks…</p>
    </div>
  );
}
