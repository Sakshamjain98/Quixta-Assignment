import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { StoreProvider } from "@/store/store-provider";
import "./globals.css";

const sans = Schibsted_Grotesk({
  variable: "--font-sans-face",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product order sheet",
  description: "Choose fulfillment and extras, see the total, and add to your order.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
