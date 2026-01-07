import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();

  // Styles object for cleaner JSX
  const styles = {
    container: {
      backgroundColor: "#f4f6f8",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    logoWrapper: {
      textAlign: "center",
      marginBottom: "16px",
    },
    logo: {
      width: "100px",
      height: "100px",
      objectFit: "contain",
    },
    title: {
      textAlign: "center",
      color: "#1f2937",
      marginBottom: "12px",
    },
    description: {
      color: "#555",
      lineHeight: "1.6",
      textAlign: "center",
      maxWidth: "400px",
      margin: "0 auto",
    },
    buttonWrapper: {
      textAlign: "center",
    },
    button: {
      marginTop: "25px",
      padding: "12px 24px",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.2s ease, transform 0.2s ease",
    },
    disclaimer: {
      marginTop: "20px",
      fontSize: "12px",
      color: "gray",
      textAlign: "center",
    },
  };

  // Button hover handler
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "#1d4ed8";
    e.target.style.transform = "translateY(-2px)";
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "#2563eb";
    e.target.style.transform = "translateY(0)";
  };

  return (
    <div style={styles.container}>
      <Card>
        {/* LOGO */}
        <div style={styles.logoWrapper}>
          <img
            src={logo}
            alt="Signature Gap Logo"
            style={styles.logo}
          />
        </div>

        {/* TITLE */}
        <h1 style={styles.title}>Signature Gap</h1>

        {/* DESCRIPTION */}
        <p style={styles.description}>
          Millions of people sign legal documents they cannot understand.
          Signature Gap helps you identify risks and understand documents
          before you sign.
        </p>

        {/* CTA BUTTON */}
        <div style={styles.buttonWrapper}>
          <button
            onClick={() => navigate("/upload")}
            style={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Get Started
          </button>
        </div>

        {/* DISCLAIMER */}
        <p style={styles.disclaimer}>
          This tool provides legal literacy, not legal advice.
        </p>
      </Card>
    </div>
  );
}
