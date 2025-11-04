import type { Metadata } from "next";
import { Poppins, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Provider from "./provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI Website Builder | Create Websites Instantly with Prompts",
  description:
    "Build stunning, fully customizable web pages using just text prompts and data. Our AI Website Builder empowers you to design, generate, and customize websites effortlessly — no coding required.",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Provider>{children}
              <Toaster />
            </Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
