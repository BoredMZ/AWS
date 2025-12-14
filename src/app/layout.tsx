import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Philippine Weather Station Dashboard",
  description: "Real-time Automatic Weather Station data from Philippine PAGASA and partner agencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50">
        <div className="min-h-screen">
          {children}
        </div>
        <footer className="bg-blue-900 text-white p-4 text-center text-sm mt-12">
          <p>🇵🇭 Philippine Automatic Weather Station Network - Real-time Data Monitoring</p>
          <p className="text-gray-300 mt-2">Data provided by PAGASA and Partner Agencies</p>
        </footer>
      </body>
    </html>
  );
}
