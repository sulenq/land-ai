import Link from "next/link";

export default function ShareNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#fee2e2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            marginBottom: "10px",
            color: "#111",
          }}
        >
          Share Tidak Ditemukan
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#888",
            marginBottom: "24px",
          }}
        >
          Link share ini tidak valid atau sudah kadaluarsa.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#006aff",
            color: "#ffffff",
            padding: "9px 18px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
