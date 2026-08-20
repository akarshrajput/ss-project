"use client";

import { useEffect, useRef } from "react";

export function SideBanners() {
  const leftRef = useRef<HTMLIFrameElement>(null);
  const rightRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const bannerHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              background: transparent;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 250px;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : 'ddb9e8676a21d0ff0d0886d19d8d5529',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/ddb9e8676a21d0ff0d0886d19d8d5529/invoke.js"></script>
        </body>
      </html>
    `;

    if (leftRef.current) {
      leftRef.current.srcdoc = bannerHtml;
    }
    if (rightRef.current) {
      rightRef.current.srcdoc = bannerHtml;
    }
  }, []);

  return (
    <>
      {/* Left Side Skyscraper/Box Banner (Wider for full 300x250 display) */}
      <aside
        aria-label="Sponsored Content Left"
        className="hidden 2xl:flex fixed left-3 top-24 z-20 flex-col items-center pointer-events-auto"
        style={{ width: "316px" }}
      >
        <div
          style={{
            width: "100%",
            background: "rgba(14, 24, 33, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "10px 6px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 36px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px 6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Sponsored
            </span>
          </div>
          <iframe
            ref={leftRef}
            title="Left Adsterra Banner"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden", background: "transparent", display: "block", margin: "0 auto" }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </aside>

      {/* Right Side Skyscraper/Box Banner (Wider for full 300x250 display) */}
      <aside
        aria-label="Sponsored Content Right"
        className="hidden 2xl:flex fixed right-3 top-24 z-20 flex-col items-center pointer-events-auto"
        style={{ width: "316px" }}
      >
        <div
          style={{
            width: "100%",
            background: "rgba(14, 24, 33, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "10px 6px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 36px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px 6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Sponsored
            </span>
          </div>
          <iframe
            ref={rightRef}
            title="Right Adsterra Banner"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden", background: "transparent", display: "block", margin: "0 auto" }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </aside>
    </>
  );
}
