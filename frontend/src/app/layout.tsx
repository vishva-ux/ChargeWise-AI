import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChargeWise - Smart EV Station Locator & AI Route Planner',
  description: 'Mobile-first EV charging station locator and route planner powered by Java Spring Boot, PostGIS, and LLM orchestration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="bg-[#65C5B0] text-slate-800 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
