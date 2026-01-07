import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("analyzing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const analyzeDocument = async () => {
      try {
        // ✅ Get pasted contract text
        const text = sessionStorage.getItem("extractedText");
        const contractName = sessionStorage.getItem("contractName") || "Contract";
        const userRole = sessionStorage.getItem("userRole") || "general";

        if (!text || text.trim().length < 50) {
          alert("No valid contract text found. Please upload again.");
          navigate("/upload");
          return;
        }

        setProgress(20);
        setStatus("connecting");

        // ✅ FIXED: Correct API endpoint is /api/analyze
        const response = await fetch(
          "https://legal-backend-fah0.onrender.com/api/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: text,
              contract_name: contractName,
              user_role: userRole
            })
          }
        );

        setProgress(60);
        setStatus("processing");

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: "Unknown error" }));
          console.error("Backend error:", err);
          alert(err.error || "Backend rejected the request.");
          navigate("/upload");
          return;
        }

        const result = await response.json();

        setProgress(90);
        setStatus("saving");

        // ✅ Check if analysis was successful
        if (!result.success) {
          alert(result.error || "Analysis failed. Please try again.");
          navigate("/upload");
          return;
        }

        // ✅ Store all relevant data from response
        sessionStorage.setItem("analysis", JSON.stringify(result.analysis));
        sessionStorage.setItem("questions", JSON.stringify(result.questions));
        sessionStorage.setItem("metadata", JSON.stringify(result.metadata));
        sessionStorage.setItem("downloadOptions", JSON.stringify(result.download_options));

        setProgress(100);
        setStatus("complete");

        // Small delay for UX before navigating
        setTimeout(() => {
          navigate("/result");
        }, 500);

      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to connect to backend. Please check your internet connection.");
        navigate("/upload");
      }
    };

    analyzeDocument();
  }, [navigate]);

  // Status messages
  const statusMessages = {
    analyzing: "🔍 Preparing your document...",
    connecting: "🌐 Connecting to AI server...",
    processing: "🤖 AI is analyzing your contract...",
    saving: "💾 Saving results...",
    complete: "✅ Analysis complete!"
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.spinner}></div>
        </div>
        
        <h2 style={styles.title}>Analyzing Document</h2>
        <p style={styles.status}>{statusMessages[status]}</p>
        
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
        </div>
        <p style={styles.progressText}>{progress}%</p>
        
        <p style={styles.subtitle}>
          This may take a few moments. Please don't close this page.
        </p>
      </div>
      
      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "20px"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%"
  },
  iconContainer: {
    marginBottom: "24px"
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto"
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: "8px"
  },
  status: {
    fontSize: "16px",
    color: "#4f46e5",
    marginBottom: "24px",
    fontWeight: "500"
  },
  progressContainer: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "8px"
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4f46e5",
    borderRadius: "4px",
    transition: "width 0.3s ease"
  },
  progressText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px"
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    margin: 0
  }
};

