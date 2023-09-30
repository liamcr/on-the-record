import { Caveat, Open_Sans, Roboto } from "next/font/google";

export const header = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const body = Roboto({
  weight: ["400"],
  subsets: ["latin"],
});

export const logo = Caveat({
  weight: ["400"],
  subsets: ["latin"],
});
