import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { ui } from "../styles/ui";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Input mode: 'text' or 'pdf'
  const [inputMode, setInputMode] = useState("text");
  
  // Text input state
  const [text, setText] = useState("");
  
  // PDF upload state
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  // Contract options
  const [contractName, setContractName] = useState("");
  const [userRole, setUserRole] = useState("general");

  // Character count
  const charCount = text.trim().length;
  const minChars = 50;

  // User role options
  const roleOptions = [
    { value: "general", label: "General (Balanced Analysis)" },
    { value: "employee", label: "Employee" },
    { value: "employer", label: "Employer" },
    { value: "freelancer", label: "Freelancer" },
    { value: "tenant", label: "Tenant" },
    { value: "landlord", label: "Landlord" }
  ];

  // Handle text continue
  const handleTextContinue = () => {
    if (charCount < minChars) {
      alert(`Please paste at least ${minChars} characters of contract text.`);
      return;
    }

    // Store data for Processing page
    sessionStorage.setItem("extractedText", text);
    sessionStorage.setItem("contractName", contractName || "Contract");
    sessionStorage.setItem("userRole", userRole);
    sessionStorage.setItem("inputMode", "text");

    navigate("/processing");
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setUploadError("");

    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.includes("pdf")) {
      setUploadError("Please upload a PDF file only.");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setUploadError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
    
    // Auto-set contract name from filename
    if (!contractName) {
      const nameWithoutExt = selectedFile.name.replace(".pdf", "");
      setContractName(nameWithoutExt);
    }
  };

  // Handle PDF upload and analysis
  const handlePDFUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // First, check document clarity
      const clarityFormData = new FormData();
      clarityFormData.append("file", file);

      const clarityResponse = await fetch(
        "https://legal-backend-fah0.onrender.com/api/v1/check-document-clarity",
        {
          method: "POST",
          body: clarityFormData
        }
      );

      const clarityResult = await clarityResponse.json();

      if (!clarityResult.success) {
        setUploadError(clarityResult.message || "Failed to check document clarity.");
        setIsUploading(false);
        return;
      }

      // If document needs reupload, show warning
      if (clarityResult.needs_reupload) {
        const proceed = window.confirm(
          `⚠️ Document Quality Warning:\n\n${clarityResult.message}\n\nSuggestions:\n${clarityResult.suggestions.join("\n")}\n\nDo you want to proceed anyway?`
        );

        if (!proceed) {
          setIsUploading(false);
          return;
        }
      }

      // Now upload and analyze
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const params = new URLSearchParams({
        contract_name: contractName || file.name.replace(".pdf", ""),
        user_role: userRole,
        language: "en-IN",
        generate_audio: "false",
        force_reupload: "true"
      });

      const uploadResponse = await fetch(
        `https://legal-backend-fah0.onrender.com/api/upload?${params}`,
        {
          method: "POST",
          body: uploadFormData
        }
      );

      const result = await uploadResponse.json();

      if (!result.success) {
        // Check if it needs reupload
        if (result.needs_reupload) {
          setUploadError(
            `Document quality issue: ${result.message}\n\nPlease upload a clearer document.`
          );
          setIsUploading(false);
          return;
        }
        
        setUploadError(result.error || "Analysis failed. Please try again.");
        setIsUploading(false);
        return;
      }

      // Store results and navigate to result page directly
      sessionStorage.setItem("analysis", JSON.stringify(result.analysis));
      sessionStorage.setItem("questions", JSON.stringify(result.questions));
      sessionStorage.setItem("metadata", JSON.stringify(result.metadata));
      sessionStorage.setItem("downloadOptions", JSON.stringify(result.download_options));
      sessionStorage.setItem("contractName", contractName || file.name);
      sessionStorage.setItem("inputMode", "pdf");

      navigate("/result");

    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Network error. Please check your connection and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Clear file selection
  const clearFile = () => {
    setFile(null);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={styles.page}>
      <Card>
        <div style={styles.cardContent}>
          <h2 style={styles.heading}>📄 Upload Contract</h2>
          <p style={styles.subtitle}>
            Analyze your contract for risks, red flags, and key terms
          </p>

          {/* Input Mode Toggle */}
          <div style={styles.toggleContainer}>
            <button
              style={{
                ...styles.toggleButton,
                ...(inputMode === "text" ? styles.toggleActive : {})
              }}
              onClick={() => setInputMode("text")}
            >
              📝 Paste Text
            </button>
            <button
              style={{
                ...styles.toggleButton,
                ...(inputMode === "pdf" ? styles.toggleActive : {})
              }}
              onClick={() => setInputMode("pdf")}
            >
              📄 Upload PDF
            </button>
          </div>

          {/* Contract Name Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contract Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Employment Agreement, Rental Contract"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* User Role Select */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Role</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              style={styles.select}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p style={styles.hint}>
              This helps the AI provide role-specific insights
            </p>
          </div>

          {/* TEXT INPUT MODE */}
          {inputMode === "text" && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Contract Text</label>
              <textarea
                rows="12"
                placeholder="Paste your full contract text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={styles.textarea}
              />
              <div style={styles.charCountContainer}>
                <span
                  style={{
                    ...styles.charCount,
                    color: charCount >= minChars ? "#10b981" : "#ef4444"
                  }}
                >
                  {charCount} / {minChars} minimum characters
                  {charCount >= minChars && " ✓"}
                </span>
              </div>

              <button
                style={{
                  ...styles.primaryButton,
                  ...(charCount < minChars ? styles.buttonDisabled : {})
                }}
                onClick={handleTextContinue}
                disabled={charCount < minChars}
              >
                Continue to Analysis →
              </button>
            </div>
          )}

          {/* PDF UPLOAD MODE */}
          {inputMode === "pdf" && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Upload PDF Document</label>

              {/* Upload Area */}
              <div
                style={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />

                {!file ? (
                  <>
                    <div style={styles.uploadIcon}>📤</div>
                    <p style={styles.uploadText}>
                      Click to upload or drag and drop
                    </p>
                    <p style={styles.uploadHint}>PDF only, max 10MB</p>
                  </>
                ) : (
                  <div style={styles.fileInfo}>
                    <div style={styles.fileIcon}>📄</div>
                    <div style={styles.fileDetails}>
                      <p style={styles.fileName}>{file.name}</p>
                      <p style={styles.fileSize}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      style={styles.clearButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {uploadError && (
                <div style={styles.errorBox}>
                  <span style={styles.errorIcon}>⚠️</span>
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Button */}
              <button
                style={{
                  ...styles.primaryButton,
                  ...(!file || isUploading ? styles.buttonDisabled : {})
                }}
                onClick={handlePDFUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Analyzing...
                  </>
                ) : (
                  "Upload & Analyze →"
                )}
              </button>
            </div>
          )}

          {/* Tips Section */}
          <div style={styles.tipsBox}>
            <h4 style={styles.tipsTitle}>💡 Tips for Best Results</h4>
            <ul style={styles.tipsList}>
              <li>Include the complete contract text for accurate analysis</li>
              <li>For PDFs, ensure the document is clear and readable</li>
              <li>Select your role for personalized insights</li>
              <li>Analysis works best with contracts in English</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Inline CSS for spinner */}
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
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center"
  },
  cardContent: {
    maxWidth: "600px",
    width: "100%",
    padding: "32px"
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "8px",
    textAlign: "center"
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "32px"
  },
  toggleContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    backgroundColor: "#f3f4f6",
    padding: "4px",
    borderRadius: "12px"
  },
  toggleButton: {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "transparent",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  toggleActive: {
    backgroundColor: "white",
    color: "#4f46e5",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  inputGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box"
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    backgroundColor: "white",
    cursor: "pointer",
    boxSizing: "border-box"
  },
  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px"
  },
  textarea: {
    width: "100%",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    lineHeight: "1.6",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  charCountContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
    marginBottom: "16px"
  },
  charCount: {
    fontSize: "13px",
    fontWeight: "500"
  },
  uploadArea: {
    border: "2px dashed #d1d5db",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "#fafafa",
    marginBottom: "16px"
  },
  uploadIcon: {
    fontSize: "48px",
    marginBottom: "12px"
  },
  uploadText: {
    fontSize: "16px",
    color: "#374151",
    fontWeight: "500",
    marginBottom: "4px"
  },
  uploadHint: {
    fontSize: "13px",
    color: "#9ca3af"
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left"
  },
  fileIcon: {
    fontSize: "40px"
  },
  fileDetails: {
    flex: 1
  },
  fileName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "2px"
  },
  fileSize: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  clearButton: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    color: "#dc2626",
    fontSize: "14px"
  },
  errorIcon: {
    flexShrink: 0
  },
  primaryButton: {
    width: "100%",
    padding: "14px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block"
  },
  tipsBox: {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "12px",
    padding: "16px 20px",
    marginTop: "24px"
  },
  tipsTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: "8px"
  },
  tipsList: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#3b82f6",
    lineHeight: "1.8"
  }
};
