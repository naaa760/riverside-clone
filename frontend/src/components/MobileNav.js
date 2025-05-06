"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => pathname === path;

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-20">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/dashboard"
              className={`${
                isActive("/dashboard")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
              onClick={toggleMenu}
            >
              Rooms
            </Link>
            <Link
              href="/recordings"
              className={`${
                isActive("/recordings")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
              onClick={toggleMenu}
            >
              Recordings
            </Link>
            <Link
              href="/settings"
              className={`${
                isActive("/settings")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
              onClick={toggleMenu}
            >
              Settings
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
