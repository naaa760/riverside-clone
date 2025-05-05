"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function RecordingsPage() {
  const { roomId } = useParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [recordings, setRecordings] = useState([]);
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }

    if (roomId && user) {
      fetchRecordings();
    }
  }, [roomId, user, isLoaded, router]);

  const fetchRecordings = async () => {
    try {
      setIsLoading(true);
      // In a real app, we would fetch recordings for the specific room from the API
      // Mock data for now

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRoom({
        id: roomId,
        name: "Demo Room",
        slug: "demo-room",
        createdAt: new Date().toISOString(),
      });

      setRecordings([
        {
          id: "1",
          name: "Recording 1",
          status: "complete",
          duration: 325, // in seconds
          createdAt: new Date().toISOString(),
          fileUrl: "https://example.com/recordings/1.mp4",
          thumbnailUrl: "https://via.placeholder.com/640x360",
          fileSize: 15000000, // 15MB in bytes
        },
        {
          id: "2",
          name: "Recording 2",
          status: "processing",
          duration: 625,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
          thumbnailUrl: "https://via.placeholder.com/640x360",
        },
      ]);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 flex items-center"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {room?.name || "Room Recordings"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">Loading recordings...</div>
        ) : recordings.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-6">All Recordings</h2>
            <div className="space-y-6">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-64 h-40 bg-gray-100 relative">
                      {recording.thumbnailUrl ? (
                        <img
                          src={recording.thumbnailUrl}
                          alt={recording.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No thumbnail
                        </div>
                      )}
                      {recording.status === "processing" && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Processing...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {recording.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {new Date(recording.createdAt).toLocaleDateString()}{" "}
                            • {formatDuration(recording.duration)}
                          </p>
                        </div>
                        {recording.status === "complete" && (
                          <div className="text-sm text-gray-600">
                            {formatFileSize(recording.fileSize)}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center space-x-4">
                        {recording.status === "complete" ? (
                          <>
                            <a
                              href={recording.fileUrl}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                              download
                            >
                              Download
                            </a>
                            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
                              Share
                            </button>
                          </>
                        ) : (
                          <span className="text-amber-600 font-medium">
                            Ready soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No recordings yet</h3>
            <p className="text-gray-600 mb-6">
              Return to the room to start recording
            </p>
            <button
              onClick={() => router.push(`/room/${room?.slug || roomId}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Room
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
