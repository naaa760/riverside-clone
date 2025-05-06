import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { RecordingProvider } from "@/contexts/RecordingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RecordStudio",
  description: "High-quality remote audio and video recording studio",
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
