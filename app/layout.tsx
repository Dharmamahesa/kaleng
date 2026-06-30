import type { Metadata } from "next";
import { Caveat, Outfit, Klee_One } from "next/font/google";

import "./globals.css";
import "./bocchi-cards.css";
import "./bocchi-skills.css";


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const kleeOne = Klee_One({
  variable: "--font-klee",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "bocchi.portfolio — hitori goto · guitar · music · code",
  description:
    "A shy programmer who expresses herself through code and music. Frontend developer, UI designer, and reluctant rockstar. Kessoku Band forever.",
  keywords: [
    "bocchi the rock",
    "frontend developer",
    "portfolio",
    "anime",
    "music",
    "guitar",
    "kessoku band",
    "indie",
    "ui design",
  ],
  openGraph: {
    title: "dharma mahesa.portfolio",
    description: "anime dev. loud code. ✦",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${caveat.variable} ${kleeOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bocchi-dark">
        {children}
      </body>
    </html>
  );
}
