import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "РентХаус - Сервис для аренды недвижимости",
  description:
    "Найдите идеальную недвижимость для аренды. Квартиры, дома, студии в Москве и Санкт-Петербурге.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className="w-full m-auto">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              <div className="flex min-h-screen flex-col m-auto w-full max-w-7xl">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
