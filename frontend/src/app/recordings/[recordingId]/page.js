"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import DashboardLayout from "@/components/DashboardLayout";

export default function RecordingDetailsPage({ params }) {
  const { recordingId } = params;
  const [recording, setRecording] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("combined"); // combined, individual
  const videoRef = useRef(null);

  useEffect(() => {
    // Fetch recording details from API
    const fetchRecording = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/recordings/${recordingId}`);
        // if (!response.ok) throw new Error('Recording not found');
        // const data = await response.json();

        // For demo, use hardcoded data
        setTimeout(() => {
          if (recordingId === "rec-1") {
            setRecording({
              id: "rec-1",
              roomName: "Weekly Podcast",
              date: new Date("2023-10-15"),
              duration: 3720, // in seconds
              status: "ready",
              participants: [
                { id: "user-1", name: "You (Host)" },
                { id: "user-2", name: "John Smith" },
                { id: "user-3", name: "Sarah Johnson" },
              ],
              fileSize: "256MB",
              url: "https://example.com/download/recording.mp4",
              tracks: [
                {
                  id: "track-1",
                  participantName: "You (Host)",
                  url: "https://example.com/download/track-1.mp4",
                },
                {
                  id: "track-2",
                  participantName: "John Smith",
                  url: "https://example.com/download/track-2.mp4",
                },
                {
                  id: "track-3",
                  participantName: "Sarah Johnson",
                  url: "https://example.com/download/track-3.mp4",
                },
              ],
            });
          } else if (recordingId === "rec-2") {
            setRecording({
              id: "rec-2",
              roomName: "Interview with Sarah",
              date: new Date("2023-10-18"),
              duration: 1860, // in seconds
              status: "ready",
              participants: [
                { id: "user-1", name: "You (Host)" },
                { id: "user-3", name: "Sarah Johnson" },
              ],
              fileSize: "128MB",
              url: "https://example.com/download/recording2.mp4",
              tracks: [
                {
                  id: "track-1",
                  participantName: "You (Host)",
                  url: "https://example.com/download/rec2-track-1.mp4",
                },
                {
                  id: "track-2",
                  participantName: "Sarah Johnson",
                  url: "https://example.com/download/rec2-track-2.mp4",
                },
              ],
            });
          } else {
            setRecording({
              id: "rec-3",
              roomName: "Marketing Meeting",
              date: new Date("2023-10-20"),
              duration: 5400, // in seconds
              status: "processing",
              participants: [
                { id: "user-1", name: "You (Host)" },
                { id: "user-4", name: "Alex Brown" },
                { id: "user-5", name: "Emma Wilson" },
                { id: "user-6", name: "James Taylor" },
              ],
              progress: 65, // processing progress in percent
            });
          }
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchRecording();
  }, [recordingId]);

  // Format duration helper function
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours > 0 ? hours.toString().padStart(2, "0") + ":" : "",
      minutes.toString().padStart(2, "0"),
      ":",
      secs.toString().padStart(2, "0"),
    ].join("");
  };

  // Format date helper function
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <DashboardLayout title="Recordings">
      <div className="mb-6">
        <Link
          href="/recordings"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Recordings
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      ) : recording ? (
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{recording.roomName}</h1>
              <p className="text-gray-600 mt-1">
                {formatDate(recording.date)} •{" "}
                {formatDuration(recording.duration)}
              </p>
            </div>

            {recording.status === "ready" && (
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={() => alert("Export functionality would go here")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Export
                </button>
                <a
                  href={recording.url}
                  download
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Download
                </a>
              </div>
            )}
          </div>

          {recording.status === "processing" ? (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-6">
                <svg
                  className="mx-auto h-12 w-12 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <h2 className="mt-2 text-lg font-medium">
                  Processing your recording
                </h2>
                <p className="mt-1 text-gray-500">
                  Your recording is being processed. This might take a few
                  minutes.
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${recording.progress}%` }}
                ></div>
              </div>

              <p className="text-center text-gray-500 text-sm">
                {recording.progress}% complete
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("combined")}
                    className={`${
                      activeTab === "combined"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Combined Recording
                  </button>
                  <button
                    onClick={() => setActiveTab("individual")}
                    className={`${
                      activeTab === "individual"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Individual Tracks
                  </button>
                </nav>
              </div>

              {/* Content */}
              {activeTab === "combined" ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Video player - would be replaced with a real player in production */}
                  <div className="aspect-video bg-gray-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="h-16 w-16 text-white opacity-80"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      controls
                      poster="/video-placeholder.jpg"
                    >
                      <source src={recording.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Recording info */}
                  <div className="p-6">
                    <h2 className="text-lg font-medium mb-4">
                      Recording Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Participants</p>
                        <p className="font-medium">
                          {recording.participants.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {formatDuration(recording.duration)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">File Size</p>
                        <p className="font-medium">{recording.fileSize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Format</p>
                        <p className="font-medium">MP4</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow divide-y">
                  {recording.tracks.map((track) => (
                    <div key={track.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-medium">
                            {track.participantName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Individual recording track
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <a
                            href={track.url}
                            download
                            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Recording not found.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
