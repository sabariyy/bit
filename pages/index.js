import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mergedUrl, setMergedUrl] = useState("");

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleMerge = async () => {
    if (files.length === 0) return alert("Please select files to merge.");

    setLoading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const response = await fetch("/api/merge", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);
    if (data.url) {
      setMergedUrl(data.url);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Merge HTML Files - Multi Pages per Sheet</h1>
      <input type="file" multiple onChange={handleFileChange} accept=".html" />
      <button onClick={handleMerge} disabled={loading}>
        {loading ? "Merging..." : "Merge Files"}
      </button>
      {mergedUrl && (
        <div>
          <p>Download your merged file:</p>
          <a href={mergedUrl} download="merged.html">
            Click Here
          </a>
        </div>
      )}
    </div>
  );
      }
