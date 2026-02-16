import { useState, useRef } from "react";
import "../styles/JobUpdateComposer.css";

export default function JobUpdateComposer({ onSubmit }) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  function handleUpdate() {
    if (!message.trim()) return;

    onSubmit?.({
      message,
      files,
    });

    setMessage("");
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="job-update-composer">
      <textarea
        className="job-update-textarea"
        placeholder="Describe the latest update on the job"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />

      <div className="job-update-actions">
        <div className="job-update-left">
          <button onClick={() => fileInputRef.current.click()}>
            📎 Attach Files & Photos
            {files.length > 0 && ` (${files.length})`}
          </button>

          <button className="icon-btn" disabled>
            🎙️ <span>Record Voice Note</span>
          </button>
        </div>

        <div className="job-update-right">
          <button className="btn-primary" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
