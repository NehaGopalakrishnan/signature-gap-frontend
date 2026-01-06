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
          alert("No document found. Please upload again.");
          navigate("/upload");
          return;
        }

        // 🔹 Read file as text (MVP-safe)
        const text = await file.text();

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
          }
        );

        if (!response.ok) {
          throw new Error("Backend error");
        }

        const backendData = await response.json();

        sessionStorage.setItem(
          "analysis",
          JSON.stringify(backendData)
        );

        navigate("/result");
      } catch (error) {
        console.error(error);
        alert("Failed to connect to backend");
        navigate("/upload");
      }
    };

    analyzeDocument();
  }, [file, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is scanning your document for legal risks…</p>
    </div>
  );
}

