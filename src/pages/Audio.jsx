import Card from "../components/Card";

export default function Audio() {
  // Read backend response OR fallback
  const data =
    JSON.parse(sessionStorage.getItem("analysis")) || {
      summary:
        "This document may contain clauses that negatively impact the signer."
    };

  return (
    <div style={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Card>
        <h2>Audio Explanation</h2>

        {/* Summary text */}
        <p style={{ marginTop: "15px", lineHeight: "1.6" }}>
          {data.summary}
        </p>

        {/* Audio player or fallback */}
        {data.audio_url ? (
          <div style={{ marginTop: "20px" }}>
            <audio controls src={data.audio_url} />
          </div>
        ) : (
          <p
            style={{
              marginTop: "20px",
              fontSize: "14px",
              color: "gray"
            }}
          >
            Audio explanation will be available in the full version.
          </p>
        )}

        {/* Disclaimer */}
        <p
          style={{
            marginTop: "25px",
            fontSize: "12px",
            color: "gray"
          }}
        >
          Audio explanations are generated for accessibility and awareness
          purposes only.
        </p>
      </Card>
    </div>
  );
}
