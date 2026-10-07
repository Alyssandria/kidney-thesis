import { Bricolage_Grotesque, IBM_Plex_Mono, Manrope } from "next/font/google";

export const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
