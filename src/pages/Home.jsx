import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Card>
        {/* ✅ LOGO */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <img
            src={logo}
            alt="Signature Gap Logo"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain"
            }}
          />
        </div>

        {/* TITLE */}
        <h1 style={{ textAlign: "center" }}>Signature Gap</h1>

        {/* DESCRIPTION */}
        <p style={{ color: "#555", lineHeight: "1.6", textAlign: "center" }}>
          Millions of people sign legal documents they cannot understand.
          Signature Gap helps you identify risks and understand documents
          before you sign.
        </p>

        {/* CTA BUTTON */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/upload")}
            style={{
              marginTop: "25px",
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Get Started
          </button>
        </div>

        {/* DISCLAIMER */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "gray",
            textAlign: "center"
          }}
        >
          This tool provides legal literacy, not legal advice.
        </p>
      </Card>
    </div>
  );
}
