"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [expanded, setExpanded] = useState(true);

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div
      className={`bg-[#111111] text-white transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      } min-h-screen flex flex-col relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-16 bg-[#222222] rounded-full p-1 shadow-md border border-gray-800 hidden md:block"
      >
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="p-4 border-b border-gray-800 flex items-center">
        <Link href="/dashboard" className="flex items-center">
          <svg
            className="w-8 h-8 text-white mr-3"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <circle cx="12" cy="12" r="3" fill="#111111" />
          </svg>
          {expanded && (
            <span className="text-xl font-bold uppercase">Riverside</span>
          )}
        </Link>
      </div>

      {/* User Profile Section */}
      {isLoaded && user && (
        <div
          className={`p-4 border-b border-gray-800 ${
            expanded ? "flex items-center" : "flex flex-col items-center"
          }`}
        >
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10",
              },
            }}
          />
          {expanded && (
            <div className="ml-3 overflow-hidden">
              <p className="font-medium truncate">
                {user.fullName || user.firstName || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.primaryEmailAddress?.emailAddress || ""}
              </p>
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded-md ${
                isActive("/dashboard") ? "bg-blue-600" : "hover:bg-gray-800"
              } ${expanded ? "" : "justify-center"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h6"
                />
              </svg>
              {expanded && <span className="ml-3">Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={`flex items-center p-2 rounded-md ${
                isActive("/projects") ? "bg-blue-600" : "hover:bg-gray-800"
              } ${expanded ? "" : "justify-center"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {expanded && <span className="ml-3">Projects</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/scheduled"
              className={`flex items-center p-2 rounded-md ${
                isActive("/scheduled") ? "bg-blue-600" : "hover:bg-gray-800"
              } ${expanded ? "" : "justify-center"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {expanded && <span className="ml-3">Scheduled</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/recordings"
              className={`flex items-center p-2 rounded-md ${
                isActive("/recordings") ? "bg-blue-600" : "hover:bg-gray-800"
              } ${expanded ? "" : "justify-center"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {expanded && <span className="ml-3">Recordings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {expanded && (
        <div className="p-4 mt-auto border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-yellow-400 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
              <h3 className="font-medium text-sm">PRO Features</h3>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Upgrade to access 4K exports, advanced AI tools and more
            </p>
            <button className="w-full bg-yellow-400 text-black py-1.5 rounded text-sm font-medium hover:bg-yellow-300 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
