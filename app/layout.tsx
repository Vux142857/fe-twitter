import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/Components/Provider";
import IconDaisy from "@/public/iconDS.svg"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My tweet",
  description: "Made with <3",
  icons: IconDaisy,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
