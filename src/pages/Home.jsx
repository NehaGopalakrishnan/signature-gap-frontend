import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Card>
        <h1>Signature Gap</h1>

        <p style={{ color: "#555", lineHeight: "1.6" }}>
          Millions of people sign legal documents they cannot understand.
          Signature Gap helps you identify risks and understand documents
          before you sign.
        </p>

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

        <p style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "gray"
        }}>
          This tool provides legal literacy, not legal advice.
        </p>
      </Card>
    </div>
  );
}
