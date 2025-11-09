import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import SummaryResult from "./components/SummaryResult";

const App: React.FC = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ fontFamily: "Arial", padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h1>📄 Academic Document Summarizer</h1>
      <p>Upload a PDF or paste text below to generate a summary using your Hugging Face model.</p>

      <FileUpload setSummary={setSummary} setLoading={setLoading} />
      {loading && <p>⏳ Summarizing... please wait.</p>}
      {summary && <SummaryResult summary={summary} />}
    </div>
  );
};

export default App;
