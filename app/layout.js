import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntdThemeProvider from "./components/AntdThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gemini Chat - AI Assistant",
  description: "Beautiful chat interface powered by Google Gemini AI with Ant Design",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdThemeProvider>{children}</AntdThemeProvider>
      </body>
    </html>
  );
}
