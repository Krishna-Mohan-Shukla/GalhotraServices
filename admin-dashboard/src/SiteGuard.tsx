import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function SiteGuard({ children }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [message, setMessage] = useState("Website is disabled");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Krishna-Mohan-Shukla/site-control/main/status.json",
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.active === true) {
          setAllowed(true);
        } else {
          setMessage(data.message || "Website temporarily unavailable");
          setAllowed(false);
        }
      })
      .catch(() => {
        // fallback → site open
        setAllowed(true);
      });
  }, []);

  if (allowed === null) return null;

  if (!allowed) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>🚫 Website Disabled</h1>
        <p style={{ fontSize: "16px", maxWidth: "420px" }}>{message}</p>
        <p style={{ marginTop: "20px", opacity: 0.7 }}>
          Please contact administrator
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
