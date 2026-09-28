import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const display = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "Выездной детский спортивный уикенд",
    template: "%s · Уикенд",
  },
  description:
    "Выездные спортивные уикенды для детей 6–14 лет. Лес, озеро, свои тренеры и живые кадры с выездов. Вы выбираете базу и дату — оплату берём онлайн.",
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Выездной детский спортивный уикенд",
    description: "База, атмосфера, дата заезда. Без абонементов и бонусных карт.",
    locale: "ru_RU",
    type: "website",
    images: ["/brand/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${display.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
