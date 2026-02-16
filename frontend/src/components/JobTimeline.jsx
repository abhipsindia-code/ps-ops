import { useState, useEffect } from "react";
import "./jobrow.css";
import { API_BASE } from "../api";

export default function JobTimeline({ history = [] }) {
  const [activeImage, setActiveImage] = useState(null);
  const [imageMap, setImageMap] = useState({});

  const token = localStorage.getItem("token");

  const actionIcon = (action) => {
    switch (action) {
      case "CREATED":
        return "🆕";
      case "COMMENT":
        return "💬";
      case "ASSIGNED":
        return "👤";
      default:
        return "📌";
    }
  };

  // 🔐 Fetch protected images with token
  useEffect(() => {
    async function loadImages() {
      const newImageMap = {};

      for (const item of history) {
        if (item.attachments?.length > 0) {
          for (const att of item.attachments) {
            if (att.type === "IMAGE") {
              const res = await fetch(
                `${API_BASE}/api/attachments/${att.id}/view`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (res.ok) {
                const blob = await res.blob();
                newImageMap[att.id] = URL.createObjectURL(blob);
              }
            }
          }
        }
      }

      setImageMap(newImageMap);
    }

    if (history.length) loadImages();
  }, [history]);

  return (
    <>
      <div className="job-timeline">
        <h3>Timeline</h3>

        {history.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-icon">
              {actionIcon(item.action)}
            </div>

            <div className="timeline-content">
              <div className="timeline-meta">
                <strong>{item.created_by || "System"}</strong>
                <span>
                  {new Date(item.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <div className="timeline-message">
                {item.message}
              </div>

              {item.attachments?.length > 0 && (
                <div className="timeline-attachments">
                  {item.attachments.map((att) =>
                    att.type === "IMAGE" ? (
                      <img
                        key={att.id}
                        src={imageMap[att.id]}
                        alt={att.file_name}
                        className="attachment-thumb"
                        onClick={() =>
                          setActiveImage(imageMap[att.id])
                        }
                      />
                    ) : (
                      <a
                        key={att.id}
                        href={`${API_BASE}/api/attachments/${att.id}/view`}
                        target="_blank"
                        rel="noreferrer"
                        className="attachment-file"
                      >
                        📄 {att.file_name}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeImage && (
        <div
          className="image-modal"
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            className="image-modal-content"
            alt="Preview"
          />
        </div>
      )}
    </>
  );
}
