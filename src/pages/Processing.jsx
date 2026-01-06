import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        console.log("Sending text to backend for analysis...");

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: "Employee must pay 2 lakh if they resign early"
            })
          }
        );

        if (!response.ok) {
          throw new Error("Backend returned an error");
        }

        const backendData = await response.json();
        console.log("Backend response:", backendData);

        sessionStorage.setItem(
          "analysis",
          JSON.stringify({
            risk_level: backendData.risk_level || "Unknown",
            summary: backendData.summary || "No summary returned.",
            flags: backendData.flags || []
          })
        );

        navigate("/result");
      } catch (error) {
        console.error("Analysis error:", error);
        alert("Failed to connect to backend. Please try again.");
        navigate("/upload");
      }
    };

    analyzeDocument();
  }, [navigate]);

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
