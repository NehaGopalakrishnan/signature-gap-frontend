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

        // ❗ Restrict supported formats
        const allowedTypes = ["text/plain", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
          alert("Please upload a TXT or text-based PDF file only.");
          navigate("/upload");
          return;
        }

        // ✅ Read file as text
        const text = await file.text();

        if (!text || text.trim().length < 50) {
          alert("Document text is too short or unreadable.");
          navigate("/upload");
          return;
        }

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/analyze",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
          }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error(err);
          throw new Error("Backend error");
        }

        const data = await response.json();
        sessionStorage.setItem("analysis", JSON.stringify(data));
        navigate("/result");

      } catch (err) {
        console.error(err);
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
