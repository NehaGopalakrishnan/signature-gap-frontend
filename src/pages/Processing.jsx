import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        const text = sessionStorage.getItem("extractedText");

        if (!text) {
          alert("No contract text found. Please upload again.");
          navigate("/upload");
          return;
        }

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/api/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text,
              contract_name: "Uploaded Contract",
              user_role: "employee"
            })
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
      <p>AI is scanning your contract for legal risks…</p>
    </div>
  );
}
