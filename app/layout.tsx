import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Marcellus, Spectral } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} · ${siteConfig.ticker}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} · ${siteConfig.ticker}`,
    description: siteConfig.description,
    images: [{ url: "/images/ocean/hero-horizon.jpg", width: 1280, height: 720 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#071a2b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${spectral.variable} ${hanken.variable} antialiased`}
    >
      <body>
        <noscript>
          <style>{`.cinema{display:none!important}.storybook{display:block!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
