import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib";
import { Toaster } from "@/shared/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feature Upvote",
  description: "A feature request and upvoting platform for product teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
