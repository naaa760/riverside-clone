"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111111] rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-6">
          We apologize for the inconvenience. The error has been logged and
          we&apos;re working on fixing it.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try again
          </button>

          <Link
            href="/dashboard"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
