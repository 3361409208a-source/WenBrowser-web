import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: "WEN | Portal",
  description: "Elegant personal workspace, cinematic stealth portal.",
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      }
    ],
    apple: [
      {
        url: "/logo.png",
        href: "/logo.png",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <script
          defer
          src="/_vercel/insights/script.js"
          data-sdkn="@vercel/analytics/next"
          data-sdkv="2.0.1"
        />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden min-h-screen bg-black`}>
        {children}
      </body>
    </html>
  );
}
