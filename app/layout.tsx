import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Nishtha Jain";
const description =
  "Nishtha Jain — computer science engineer in Ludhiana. Production web platforms, LLM and RAG pipelines, and the security work underneath them.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nishtha-jain.vercel.app"),
  title: { default: title, template: "%s · Nishtha Jain" },
  description,
  authors: [{ name: "Nishtha Jain" }],
  keywords: [
    "Nishtha Jain",
    "software engineer",
    "machine learning",
    "RAG",
    "React",
    "Ludhiana",
  ],
  openGraph: { title, description, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* The name and the line under it are the first things painted. */}
        <link
          rel="preload"
          href="/fonts/bluu-next-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/bluu-next-700-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="grain">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
