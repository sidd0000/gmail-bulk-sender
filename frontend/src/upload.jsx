import { useState } from "react";
import axios from "axios";

function UploadPage({ sessionId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1]; // get base64 content
      try {
        await axios.post("http://localhost:5000/send", {
          sessionId,
          csvFile: base64,
        });
        setMessage("CSV sent successfully!");
      } catch (err) {
        setMessage("Error sending CSV: " + err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload CSV to send via Gmail</h2>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={!file}>Send CSV</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadPage;
