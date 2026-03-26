import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WENBrowser - 极客职场个人导航",
  description: "基于 Chromium 深度定制的个人导航门户，专为办公环境设计的“三段式防御”体系。",
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
