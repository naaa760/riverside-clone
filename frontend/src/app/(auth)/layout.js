import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }) {
  return (
    <div className={`min-h-screen flex flex-col ${inter.className}`}>
      <header className="py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Riverside Clone
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 border">
            {children}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© 2023 Your Riverside Clone. All rights reserved.</p>
      </footer>
    </div>
  );
}
