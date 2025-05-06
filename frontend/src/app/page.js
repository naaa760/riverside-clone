"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="font-bold text-xl">
            RecordStudio
          </Link>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-medium hover:underline"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Get Started
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center lg:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          High-Quality Remote Recording Studio
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl">
          Record studio-quality audio and video interviews, podcasts, and more -
          directly from your browser. No downloads required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <SignedOut>
            <Link
              href="/sign-up"
              className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium"
            >
              Get Started
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium"
            >
              Go to Dashboard
            </Link>
          </SignedIn>

          <Link
            href="#features"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="p-3 rounded-full bg-blue-100 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Record?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Start recording professional audio and video content in minutes with
            our easy-to-use platform.
          </p>
          <Link
            href="/sign-up"
            className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="container px-4 mx-auto text-center text-gray-600">
          <p>© {new Date().getFullYear()} RecordStudio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Feature data
const features = [
  {
    title: "Local Recording",
    description:
      "Each participant records locally for studio-quality audio and video without internet interruptions.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    title: "Multi-Party Recording",
    description:
      "Connect with multiple participants in real-time with high-quality video streaming.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    title: "Easy Sharing",
    description:
      "Share recordings instantly with secure cloud storage and easy download options.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
      </svg>
    ),
  },
];
