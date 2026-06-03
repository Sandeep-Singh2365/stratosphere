import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Stratosphere | Global Intelligence & Policy Analysis",
  description:
    "Stratosphere delivers daily geopolitical intelligence through the Wire and deep strategic research through the Institute. Independent. Rigorous. Global.",
  openGraph: {
    title: "Stratosphere | Global Intelligence & Policy Analysis",
    description:
      "Independent geopolitical analysis and strategic policy research.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable)}>
      <body className={cn("font-sans antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
