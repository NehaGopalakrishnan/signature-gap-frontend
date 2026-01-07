import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        // ✅ Get pasted contract text
        const text = sessionStorage.getItem("extractedText");

        if (!text || text.trim().length < 50) {
          alert("No valid contract text found. Please upload again.");
          navigate("/upload");
          return;
        }

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/analyze",
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

        if (!response.ok) {
          const err = await response.text();
          console.error("Backend error:", err);
          alert("Backend rejected the request.");
          navigate("/upload");
          return;
        }

        const result = await response.json();

        // ✅ Store only analysis object
        sessionStorage.setItem(
          "analysis",
          JSON.stringify(result.analysis)
        );

        navigate("/result");
      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to connect to backend.");
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

