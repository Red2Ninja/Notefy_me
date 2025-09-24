import { useState } from "react";
import API from "../api";

function UploadNotes() {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    console.log("Uploading file:", file.name);
    // later: send file to backend → S3
    alert(`File "${file.name}" ready to be uploaded`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Notes</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
export default UploadNotes;
