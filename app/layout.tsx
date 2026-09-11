import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "./site-data";

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#171412",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
