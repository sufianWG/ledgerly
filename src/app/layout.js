import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/shared/ThemeProvider";
import { Bounce, ToastContainer } from "react-toastify";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Digital Life Lessons",
  description: "A quiet space to preserve the lessons life has taught you, and to learn from what it's taught others.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          {children}
          <ToastContainer position="top-right" transition={Bounce} ></ToastContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
