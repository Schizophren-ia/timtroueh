import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TìmTrọ UEH · Tìm một nơi để gọi là nhà",
  description: "Tìm phòng trọ sinh viên theo campus, ngân sách và khoảng cách. Chi phí minh bạch, đánh giá và thông tin xác thực trong bản mô phỏng TìmTrọ UEH.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
