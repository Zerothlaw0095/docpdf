import axios from "axios";
import React, { useState } from "react";

interface Props {
  setSummary: (text: string) => void;
  setLoading: (val: boolean) => void;
}

const FileUpload: React.FC<Props> = ({ setSummary, setLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/summarize-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(res.data.summary);
    } catch (err) {
      alert("Error uploading file!");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSummarize = async () => {
    if (!text.trim()) return alert("Please enter some text first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("text", text);

    try {
      const res = await axios.post("http://127.0.0.1:8000/summarize-text", formData);
      setSummary(res.data.summary);
    } catch (err) {
      alert("Error summarizing text!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload PDF File</h3>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Summarize PDF</button>

      <hr />

      <h3>Or Paste Text</h3>
      <textarea
        rows={8}
        cols={80}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text here..."
      ></textarea>
      <br />
      <button onClick={handleTextSummarize}>Summarize Text</button>
    </div>
  );
};

export default FileUpload;
