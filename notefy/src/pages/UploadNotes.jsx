import { useState } from "react";
import API from "../api";

function UploadNotes() {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const form = new FormData();
    form.append("file", file);
    try {
      const { data } = await API.post("/notes/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload successful: " + data.note.fileName);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
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
