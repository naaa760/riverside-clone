import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navigation() {
  const { user } = useUser();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="font-bold text-xl">
          Riverside Clone
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/recordings"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Recordings
          </Link>
          <div className="flex items-center gap-2">
            {user && (
              <span className="text-sm text-gray-600">
                {user.firstName || user.username}
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
