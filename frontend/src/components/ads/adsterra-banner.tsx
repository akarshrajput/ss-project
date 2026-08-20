"use client";

import { useEffect, useRef } from "react";

interface AdsterraBannerProps {
  type: "300x250" | "728x90" | "native";
  className?: string;
}

export function AdsterraBanner({ type, className = "" }: AdsterraBannerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let adHtml = "";

    if (type === "300x250") {
      adHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { background: transparent; display: flex; justify-content: center; align-items: center; min-height: 250px; overflow: hidden; }
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
    } else if (type === "728x90") {
      adHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { background: transparent; display: flex; justify-content: center; align-items: center; min-height: 90px; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '6e4b1ace19a6ea05b1ed41bd8ccae281',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/6e4b1ace19a6ea05b1ed41bd8ccae281/invoke.js"></script>
          </body>
        </html>
      `;
    } else if (type === "native") {
      adHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { background: transparent; display: flex; justify-content: center; align-items: center; min-height: 90px; overflow: hidden; width: 100%; }
              #container-1bd2e123239998dc695c8d725d5f053d { width: 100%; }
            </style>
          </head>
          <body>
            <script async="async" data-cfasync="false" src="https://pl30889663.effectivecpmnetwork.com/1bd2e123239998dc695c8d725d5f053d/invoke.js"></script>
            <div id="container-1bd2e123239998dc695c8d725d5f053d"></div>
          </body>
        </html>
      `;
    }

    if (iframeRef.current) {
      iframeRef.current.srcdoc = adHtml;
    }
  }, [type]);

  const width = type === "728x90" ? "728px" : type === "300x250" ? "300px" : "100%";
  const height = type === "728x90" ? "90px" : type === "300x250" ? "250px" : "120px";

  return (
    <div
      className={`my-6 flex flex-col items-center justify-center overflow-hidden rounded-xl ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "8px",
        maxWidth: "100%",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "4px",
          display: "block",
        }}
      >
        Advertisement
      </span>
      <iframe
        ref={iframeRef}
        title={`Adsterra ${type} banner`}
        style={{
          width,
          height,
          maxWidth: "100%",
          border: "none",
          overflow: "hidden",
          background: "transparent",
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
