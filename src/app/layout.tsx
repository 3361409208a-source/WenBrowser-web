import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEN Browser",
  description: "个人导航网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
