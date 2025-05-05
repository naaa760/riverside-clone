"use client";

import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-sm",
                navbar: "hidden",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              },
            }}
            routing="path"
            path="/user-profile"
          />
        </div>
      </main>
    </div>
  );
}
