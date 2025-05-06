"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import DarkLayout from "@/components/DarkLayout";
import RoomModal from "@/components/RoomModal";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRecordings: 0,
    totalHours: 0,
    totalProjects: 0,
  });

  // Handle room creation
  const handleCreateRoom = async (roomDetails) => {
    try {
      // In a real app, this would call an API
      console.log("Creating room:", roomDetails);
      setIsRoomModalOpen(false);

      // Simulate loading and redirect
      setTimeout(() => {
        router.push(`/room/new-room-id`);
      }, 500);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  useEffect(() => {
    // Fetch recordings and stats
    const fetchData = async () => {
      try {
        // In a real app, replace with actual API calls
        setTimeout(() => {
          setRecordings([
            {
              id: "rec-1",
              name: "Weekly Podcast",
              thumbnail: "/placeholder-recording.jpg",
              duration: "00:27",
              recordedAt: "21 hours ago",
            },
            {
              id: "rec-2",
              name: "Interview with Alex",
              thumbnail: "/placeholder-recording.jpg",
              duration: "01:15",
              recordedAt: "2 days ago",
            },
          ]);

          setStats({
            totalRecordings: 12,
            totalHours: 27,
            totalProjects: 4,
          });

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DarkLayout>
      {/* Feature Banner */}
      <div className="bg-black p-4 text-center">
        <p className="text-sm">
          Experience the full power of Riverside with 4K video, AI show notes,
          watermark-free exports and more.
          <button className="ml-4 text-yellow-400 font-medium hover:underline">
            Try PRO for free
          </button>
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* Welcome Message */}
        {isLoaded && user && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Welcome back, {user.firstName || "Creator"}
            </h1>
            <p className="text-gray-400 mt-1">
              Ready to create your next amazing recording?
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111111] p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm uppercase mb-2">
              Total Recordings
            </h3>
            <p className="text-3xl font-bold">{stats.totalRecordings}</p>
          </div>

          <div className="bg-[#111111] p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm uppercase mb-2">
              Recording Hours
            </h3>
            <p className="text-3xl font-bold">{stats.totalHours}</p>
          </div>

          <div className="bg-[#111111] p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm uppercase mb-2">
              Active Projects
            </h3>
            <p className="text-3xl font-bold">{stats.totalProjects}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center space-x-4 md:space-x-8 mb-12">
          <button
            className="flex flex-col items-center mb-4 transform transition-transform hover:scale-105"
            onClick={() => setIsRoomModalOpen(true)}
          >
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <span>Record</span>
          </button>

          <button className="flex flex-col items-center mb-4 transform transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <span>Edit</span>
          </button>

          <button className="flex flex-col items-center mb-4 transform transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <svg
                className="w-6 h-6"
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
            </div>
            <span>Go Live</span>
          </button>

          <button className="flex flex-col items-center mb-4 transform transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span>Plan</span>
          </button>

          <button className="flex flex-col items-center mb-4 transform transition-transform hover:scale-105">
            <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <span>Import</span>
          </button>
        </div>

        {/* Recents Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recents</h2>
            <Link
              href="/recordings"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View all recordings →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recordings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="bg-[#111111] rounded-lg overflow-hidden group cursor-pointer hover:bg-[#1a1a1a] transition-all duration-200"
                >
                  <div className="relative aspect-video bg-black">
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Recording
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {recording.duration}
                    </div>
                    <div className="h-full w-full bg-gradient-to-br from-purple-900/20 to-black flex items-center justify-center">
                      <div className="text-4xl text-white/30">▶</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 group-hover:text-blue-300 transition-colors">
                      {recording.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Recorded {recording.recordedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111111] p-6 rounded-lg text-center">
              <p className="text-gray-400">No recent recordings found.</p>
              <button
                onClick={() => setIsRoomModalOpen(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Your First Recording
              </button>
            </div>
          )}
        </section>

        {/* AI Tools Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">AI tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden relative h-48 transform transition-transform hover:scale-[1.02]">
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-medium">
                PRO
              </div>
              <div className="p-6 h-full flex flex-col justify-between">
                <h3 className="text-lg font-medium">AI Transcription</h3>
                <p className="text-sm text-gray-400">
                  Automatically transcribe your recordings with high accuracy
                </p>
                <button className="text-blue-400 text-sm mt-4 hover:text-blue-300">
                  Learn more →
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden relative h-48 transform transition-transform hover:scale-[1.02]">
              <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-medium">
                PRO
              </div>
              <div className="p-6 h-full flex flex-col justify-between">
                <h3 className="text-lg font-medium">Video Clips</h3>
                <p className="text-sm text-gray-400">
                  Create shareable clips from your long-form content
                </p>
                <button className="text-blue-400 text-sm mt-4 hover:text-blue-300">
                  Learn more →
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden relative h-48 transform transition-transform hover:scale-[1.02]">
              <div className="p-6 h-full flex flex-col justify-between">
                <h3 className="text-lg font-medium">Audio Enhancement</h3>
                <p className="text-sm text-gray-400">
                  Automatically reduce background noise and improve audio
                  quality
                </p>
                <button className="text-blue-400 text-sm mt-4 hover:text-blue-300">
                  Try it now →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Room Creation Modal */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSubmit={handleCreateRoom}
      />
    </DarkLayout>
  );
}
