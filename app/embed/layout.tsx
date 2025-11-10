import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Countdown Timer Embed",
  description: "Embeddable countdown timer",
};

/**
 * Minimal layout for embed routes.
 * Excludes Header and provides clean structure for iframe embedding.
 */
export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className="antialiased m-0 p-0"
        suppressHydrationWarning
        style={{ margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}

