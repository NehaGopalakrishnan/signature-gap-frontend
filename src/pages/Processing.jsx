import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        // 🔹 TEMP MVP TEXT (backend expects JSON)
        const sampleText =
          "Employee must work for three years or pay a penalty of 2 lakh rupees.";

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: sampleText
            })
          }
        );

        if (!response.ok) {
          throw new Error("Backend error");
        }

        const data = await response.json();

        sessionStorage.setItem("analysis", JSON.stringify(data));
        navigate("/result");
      } catch (err) {
        alert("Failed to connect to backend");
        console.error(err);
      }
    };

    analyzeDocument();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is scanning your document for legal risks…</p>
    </div>
  );
}
