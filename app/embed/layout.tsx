/**
 * Minimal layout for embed routes.
 * Excludes Header and provides clean structure for iframe embedding.
 * This layout wraps children only - no HTML/body tags (handled by root layout).
 */
export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

