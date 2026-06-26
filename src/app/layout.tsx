import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: "Nosso Farol",
  description: "Um sinal silencioso de que alguém pensou em você.",
  openGraph: {
    images: [{ url: "/og-default.png" }],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-BR" data-theme="aqua" className={lora.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

export default RootLayout
