import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        const text = sessionStorage.getItem("extractedText");

        if (!text || text.trim().length < 50) {
          alert("No valid contract text found. Please upload again.");
          navigate("/upload");
          return;
        }

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: text,
            contract_name: "Contract",
            user_role: "general"
          })
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend error:", errorText);
          alert("Backend rejected the request");
          navigate("/upload");
          return;
        }

        const result = await response.json();

        // Store ONLY what Result page expects
        sessionStorage.setItem(
          "analysis",
          JSON.stringify(result.analysis)
        );

        navigate("/result");
      } catch (err) {
        console.error("Network error:", err);
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
