import { Inter } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

/* One face for headlines, body and labels. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://ambikagt.com"),
  title: "Ambika Global Traders — Building Materials, Nagercoil",
  description:
    "Cement, TMT bars, M-sand, bricks, blocks, paints and waterproofing. Authorised dealer supply at retail and wholesale, across Kanyakumari district since 2021.",
  keywords: [
    "building materials Nagercoil",
    "cement dealer Kanyakumari",
    "TMT bars Nagercoil",
    "M-sand supplier",
    "Ambika Global Traders",
  ],
  icons: {
    icon: "/brands/agt-logo.png",
    apple: "/brands/agt-logo.png",
  },
  openGraph: {
    title: "Ambika Global Traders — Building Materials, Nagercoil",
    description:
      "Cement, steel, sand and stone. Retail and wholesale across Kanyakumari district.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#07090C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="grain antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
