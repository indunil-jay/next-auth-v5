import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "next-auth-v5",
  description: "learning and make reference how to use next-auth v5 ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );

  {
    //when use client session
    //const session = await auth()
    /*return <SessionProvider session={session}>
<html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
</SessionProvider> */
  }
}
