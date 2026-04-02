import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import { Toaster } from "sonner";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium SaaS",
  description: "A high-end SaaS frontend experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${pacifico.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-screen flex flex-col font-sans bg-background text-foreground overflow-x-hidden selection:bg-black/10 dark:selection:bg-white/10 selection:text-foreground" style={{ backgroundColor: "#050505", color: "#fafafa" }} suppressHydrationWarning>
        <StoreProvider>
          {children}
          <Toaster position="top-center" richColors theme="system" />
        </StoreProvider>
      </body>
    </html>
  );
}
