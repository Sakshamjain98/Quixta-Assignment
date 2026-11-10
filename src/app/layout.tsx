import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { SITE } from "@/config/site";
import { PRODUCT } from "@/constants/product";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${PRODUCT.name} · ${SITE.name}`,
  description: PRODUCT.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        {children}
        <footer className="border-t border-line py-8 text-sm text-muted">
          <Container className="flex flex-col justify-between gap-2 sm:flex-row">
            <p>{SITE.name}</p>
            <p>{SITE.description}</p>
          </Container>
        </footer>
      </body>
    </html>
  );
}
