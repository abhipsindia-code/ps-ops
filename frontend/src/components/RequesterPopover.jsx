export default function RequesterCard({ contact, onClose }) {
  if (!contact) return null;

  return (
    <div
      style={{
        marginTop: "8px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        maxWidth: "360px",
      }}
    >
      {/* Header / cover */}
<div
  style={{
    height: "110px",
    background: "linear-gradient(135deg,#8b8cf9,#60a5fa,#f472b6)",
    padding: "16px",
    display: "flex",
    alignItems: "flex-end",
  }}
>
  <div>
    <div
      style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#ffffff",
        lineHeight: 1.2,
      }}
    >
      {contact.name}
    </div>

    {contact.company && (
      <div
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.85)",
          marginTop: "2px",
        }}
      >
        {contact.company.type} · {contact.company.code}
      </div>
    )}
  </div>
</div>


      {/* Content */}
      <div style={{ padding: "14px" }}>
        {/* Close */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {contact.phone && (
          <div style={{ fontSize: "16px", marginBottom: "6px" }}>
            📞 {contact.phone}
          </div>
        )}

        {contact.email && (
          <div style={{ fontSize: "14px", marginBottom: "14px" }}>
            ✉️ {contact.email}
          </div>
        )}

        <div style={{ textAlign: "right" }}>
          <button
            onClick={() => {
              if (contact.phone) {
                window.open(`https://wa.me/91${contact.phone}`);
              }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#22c55e",
              color: "#ffffff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }} 
          > {/* WhatsApp Icon */} <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" > <path d="M20.52 3.48A11.91 11.91 0 0012 0C5.37 0 .01 5.37.01 12c0 2.11.55 4.16 1.6 5.98L0 24l6.2-1.63A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52zm-8.52 18.44c-1.85 0-3.67-.5-5.26-1.44l-.38-.23-3.68.97.98-3.58-.25-.37A9.9 9.9 0 012.1 12C2.1 6.54 6.55 2.1 12 2.1c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.9 7c0 5.45-4.44 9.92-9.89 9.92zm5.44-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.77-1.64-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.1 4.48.71.3 1.27.48 1.7.61.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" /> </svg>
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
