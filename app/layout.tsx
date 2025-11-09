import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Burn Rate Calculator",
  description: "Calculate your startup burn rate and runway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ cssLayerName: "clerk" }}>
      <html
        lang="en"
        suppressHydrationWarning
        className="h-full overflow-hidden"
      >
        <body
          className="antialiased h-full overflow-hidden"
          suppressHydrationWarning
        >
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
