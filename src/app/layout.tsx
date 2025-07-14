import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes & Bookmarks Manager",
  description: "A secure and beautiful way to manage your notes and bookmarks",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0f172a" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />

            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
              <Toaster position="top-center" toastOptions={{
                className: 'font-sans',
                style: {
                  margin: '1rem auto',
                  maxWidth: '500px',
                },
                success: {
                  className: 'border border-green-500',
                  iconTheme: {
                    primary: '#10b981',
                    secondary: 'white',
                  },
                },
                error: {
                  className: 'border border-red-500',
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                },
              }} />
              {children}
            </main>

            <footer className="border-t border-border/30 py-6 bg-background/80 backdrop-blur-md">
              <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
                <p className="text-center sm:text-left">
                  © {new Date().getFullYear()} Notes & Bookmarks Manager. All rights reserved.
                </p>
                <p className="text-center sm:text-right">
                  Built with 💻 Next.js & Tailwind
                </p>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
