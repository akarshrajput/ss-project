import { ImageResponse } from "next/og";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "64px",
					background:
						"radial-gradient(circle at 90% 10%, rgba(34, 211, 238, 0.35), transparent 45%), linear-gradient(145deg, #020617 0%, #0f172a 70%, #020617 100%)",
					color: "#f8fafc",
					fontFamily: "sans-serif",
				}}
			>
				<div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#67e8f9" }}>
					Songify
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
					<div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
						<span>Text to Audio and</span>
						<span>AI Music Generation</span>
					</div>
					<div style={{ fontSize: 32, color: "#cbd5e1" }}>
						Speech, tone control, poem to audio, and artist-free music workflows.
					</div>
				</div>
			</div>
		),
		{
			...size,
		},
	);
}
