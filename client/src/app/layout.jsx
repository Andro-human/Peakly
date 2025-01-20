import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Sidebar from "../components/Sidebar.jsx"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Peakly",
  description: "Challenge. Wager. Win",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          {/* <div className="relative sm:-8 p-4 bg-[#131313a] min-h-screen flex flex-row"> */}
          <div className="sm: flex mr-10 relative">
            {/* <Sidebar /> */}
            Sidebar
            <Sidebar />
            
          </div>

          <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">Navbar</div>
          {children}
          {/* </div> */}
          </ThirdwebProvider>
      </body>
    </html>
  );
}
