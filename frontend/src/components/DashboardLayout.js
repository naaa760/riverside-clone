import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import MobileNav from "./MobileNav";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-bold text-xl">
            RecordStudio
          </Link>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/dashboard"
                className={`${
                  title === "Rooms"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Rooms
              </Link>
              <Link
                href="/recordings"
                className={`${
                  title === "Recordings"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Recordings
              </Link>
              <Link
                href="/settings"
                className={`${
                  title === "Settings"
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Settings
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
