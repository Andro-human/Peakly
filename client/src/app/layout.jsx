import { Inter } from "next/font/google";
import "./globals.css";
// import { StateContextProvider } from "../context";
// import AppProviders from "./AppProviders";
import { ThirdwebProvider } from "thirdweb/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Peakly",
  description: "Challenge. Wager. Win",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
