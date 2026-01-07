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
          alert("No document found");
          navigate("/upload");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/api/upload-and-extract",
          {
            method: "POST",
            body: formData
          }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error(err);
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
  }, [file, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔍 Analyzing Document</h2>
      <p>AI is scanning your document…</p>
    </div>
  );
}
