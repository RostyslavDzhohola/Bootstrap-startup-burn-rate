import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Burn Rate Calculator",
  description: "Calculate your startup burn rate and runway",
};

/**
 * Root layout - minimal structure.
 * Site-specific styling (Header, background) is handled by (site)/layout.tsx
 * Embed routes use their own layout.tsx
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ cssLayerName: "clerk" }}>
      <html lang="en" suppressHydrationWarning className="h-full">
        <head>
          <Script
            defer
            data-website-id="dfid_qiYc6tCjMD2lRZkfylWl9"
            data-domain="bootstrap-startup-burn-rate.vercel.app"
            src="https://datafa.st/js/script.js"
            strategy="afterInteractive"
          />
        </head>
        <body
          className="antialiased m-0 p-0"
          suppressHydrationWarning
          style={{ margin: 0, padding: 0, backgroundColor: "transparent" }}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
