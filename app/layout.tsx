import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "FiveM Esports — Global Server Intelligence", description: "Live public FiveM server rankings and performance analytics.", metadataBase: new URL("https://fivemesports.id") };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
