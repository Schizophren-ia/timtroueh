import type { Metadata } from "next";
import "./globals.css";
import "./student-theme.css";

export const metadata: Metadata = {
  title: "Nhà trọ UEH · Gần trường, gần bạn",
  description: "Tìm phòng trọ cho sinh viên UEH theo cơ sở học, ngân sách và khoảng cách. Xem chi phí, tiện nghi và cẩm nang thuê trọ để an tâm bắt đầu hành trình đại học.",
  icons: {
    icon: "/assets/ueh-logo.png",
    shortcut: "/assets/ueh-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
