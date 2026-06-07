import type { Metadata } from "next";
import "./globals.css";
import { GOOGLE_FONT_FAMILIES } from "@/lib/themes";
import { DesignProvider } from "@/lib/DesignContext";

export const metadata: Metadata = {
  title: "WizDesigner",
  description:
    "Self-serve design discovery for wholesale B2B storefronts on WizShop.",
};

const fontHref =
  "https://fonts.googleapis.com/css2?" +
  GOOGLE_FONT_FAMILIES.map((f) => `family=${f}`).join("&") +
  "&display=swap";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={fontHref} />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <DesignProvider>{children}</DesignProvider>
      </body>
    </html>
  );
}
