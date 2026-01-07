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

        const formData = new FormData();
        formData.append("file", file); // 🔑 MUST be "file"

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/api/upload",
          {
            method: "POST",
            body: formData
          }
        );

        if (!response.ok) {
          const err = await response.json();
          alert(err.message || "Document analysis failed");
          navigate("/upload");
          return;
        }

        const backendData = await response.json();

        // Save analysis for Result page
        sessionStorage.setItem(
          "analysis",
          JSON.stringify(backendData.analysis)
        );

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
      <p style={{ fontSize: "13px", color: "gray" }}>
        This may take up to 60 seconds
      </p>
    </div>
  );
}
