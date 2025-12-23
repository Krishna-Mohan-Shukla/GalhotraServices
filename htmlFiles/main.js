(function () {
    const STATUS_URL =
      "https://raw.githubusercontent.com/Krishna-Mohan-Shukla/site-control/main/status.json";
  
    fetch(STATUS_URL, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.active !== true) {
          document.body.innerHTML = `
            <div style="
              height:100vh;
              display:flex;
              justify-content:center;
              align-items:center;
              flex-direction:column;
              font-family:Arial, sans-serif;
              background:#f9fafb;
              text-align:center;
              padding:20px;
            ">
              <h1 style="font-size:32px; color:#dc2626;">
                🚫 Website Disabled
              </h1>
              <p style="max-width:420px; margin-top:12px; font-size:16px;">
                ${data.message || "This website is temporarily unavailable."}
              </p>
              <p style="margin-top:20px; font-size:14px; opacity:0.6;">
                Please contact administrator
              </p>
            </div>
          `;
        }
      })
      .catch(() => {
        // Agar GitHub down ho jaye → site ON rahe
      });
  })();
  