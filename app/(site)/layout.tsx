import Header from "../components/Header";

/**
 * Site-specific layout for main application routes.
 * Adds Header and background styling that should not appear in embed routes.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen h-full bg-linear-to-br from-slate-50 via-white to-blue-50">
      <Header />
      {children}
    </div>
  );
}
