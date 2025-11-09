import React from "react";

interface Props {
  summary: string;
}

const SummaryResult: React.FC<Props> = ({ summary }) => {
  return (
    <div style={{ marginTop: "20px", background: "#f4f4f4", padding: "20px", borderRadius: "10px" }}>
      <h2>🧠 Summary</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
    </div>
  );
};

export default SummaryResult;
