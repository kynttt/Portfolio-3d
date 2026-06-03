import type { Metadata } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aldren Kent Cirunay | Engineer & Digital Systems Builder",
  description:
    "A desktop-first editorial portfolio hero for Aldren Kent Cirunay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${instrument.variable}`}>
        {children}
      </body>
    </html>
  );
}
