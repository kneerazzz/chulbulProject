import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Toaster } from "sonner"
import Providers from "./providers";


export const metadata: Metadata = {
  title: "SkillSprint",
  description: "Get your daily plan for learning constantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="dark"
      >
      <Providers>
        <Navbar />
        {children}
        <Toaster richColors position="top-right" />
        <Footer />
      </Providers>
      </body>
    </html>
  );
}
