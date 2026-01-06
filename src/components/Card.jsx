export default function Card({ children }) {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "60px auto",
      padding: "32px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif"
    }}>
      {children}
    </div>
  );
}
