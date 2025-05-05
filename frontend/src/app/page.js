"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header for authenticated users */}
      {isSignedIn && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
              Riverside Clone
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Dashboard
              </Link>
              <UserButton />
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          High-quality remote recordings, <br />
          made simple.
        </h1>
        <p className="text-xl max-w-2xl mb-10 text-gray-600">
          Record studio-quality audio and video interviews, podcasts, and
          presentations from anywhere, directly from your browser.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                font-medium rounded-lg transition-colors"
              >
                Sign Up Free
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-3 border border-gray-300 hover:border-gray-400 
                text-gray-800 font-medium rounded-lg transition-colors"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Local Recording"
              description="Crystal-clear audio and video recorded locally on each participant's device."
              icon="🎥"
            />
            <FeatureCard
              title="Simple Sharing"
              description="Share a simple link to invite guests. No downloads or accounts required for them."
              icon="🔗"
            />
            <FeatureCard
              title="Cloud Storage"
              description="All recordings are automatically uploaded and processed in the cloud."
              icon="☁️"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 text-center">
        <p className="text-gray-600">
          © 2023 Your Riverside Clone. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
