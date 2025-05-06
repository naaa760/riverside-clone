import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { RecordingProvider } from "@/contexts/RecordingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Riverside.fm Clone",
  description: "A clone of Riverside.fm for recording and podcasting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <RecordingProvider>{children}</RecordingProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
