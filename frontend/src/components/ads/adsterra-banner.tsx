"use client";

import { useEffect, useRef } from "react";
import { AD_CONFIG } from "./ad-config";

export type BannerType = "300x250" | "728x90" | "native" | "responsive";

interface AdsterraBannerProps {
  type: BannerType;
  className?: string;
  label?: boolean;
}

export function AdsterraBanner({ type, className = "", label = true }: AdsterraBannerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let adHtml = "";

    if (type === "300x250") {
      adHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { background: transparent; display: flex; justify-content: center; align-items: center; min-height: 250px; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${AD_CONFIG.banner300x250Key}',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="${AD_CONFIG.invokeHost}/${AD_CONFIG.banner300x250Key}/invoke.js"></script>
          </body>
        </html>
      `;
    } else if (type === "728x90") {
      adHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { background: transparent; display: flex; justify-content: center; align-items: center; min-height: 90px; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${AD_CONFIG.banner728x90Key}',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="${AD_CONFIG.invokeHost}/${AD_CONFIG.banner728x90Key}/invoke.js"></script>
          </body>
        </html>
      `;
    } else if (type === "native") {
      adHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { background: transparent; display: flex; justify-content: center; align-items: center; min-height: 90px; overflow: hidden; width: 100%; }
              #${AD_CONFIG.nativeContainerId} { width: 100%; }
            </style>
          </head>
          <body>
            <script async="async" data-cfasync="false" src="${AD_CONFIG.nativeBannerScript}"></script>
            <div id="${AD_CONFIG.nativeContainerId}"></div>
          </body>
        </html>
      `;
    }

    if (iframeRef.current && adHtml) {
      iframeRef.current.srcdoc = adHtml;
    }
  }, [type]);

  if (type === "responsive") {
    return (
      <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
        <div className="hidden md:block w-full">
          <AdsterraBanner type="728x90" label={label} />
        </div>
        <div className="block md:hidden w-full">
          <AdsterraBanner type="300x250" label={label} />
        </div>
      </div>
    );
  }

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
      {label && (
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
          Sponsored
        </span>
      )}
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
