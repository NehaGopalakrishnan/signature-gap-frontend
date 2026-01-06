import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        console.log("Sending TEXT to backend...");

        // 🟢 MVP TEXT (until backend supports file upload)
        const textPayload = {
          text: "Employee must pay 2 lakh if they resign early"
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
          throw new Error("Backend error");
        }

        const backendData = await response.json();
        console.log("Backend response:", backendData);

        // Normalize backend response for Result page
        const analysisData = {
          risk_level: backendData.risk_level || "Medium",
          summary: backendData.summary || "No summary available",
          flags: []
        };

        sessionStorage.setItem(
          "analysis",
          JSON.stringify(analysisData)
        );

        navigate("/result");
      } catch (error) {
        console.error("FETCH ERROR:", error);
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
