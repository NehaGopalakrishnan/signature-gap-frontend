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

        // ✅ Call backend EXACTLY as specified
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

        if (!response.ok) {
          const errText = await response.text();
          console.error("Backend error:", errText);
          throw new Error("Backend error");
        }

        const result = await response.json();

        // ✅ Store backend response for Result page
        sessionStorage.setItem("analysis", JSON.stringify(result));

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
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is scanning your contract for legal risks…</p>
    </div>
  );
}
