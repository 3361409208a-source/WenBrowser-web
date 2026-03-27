import type { Metadata } from "next";
import "./globals.css";

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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
