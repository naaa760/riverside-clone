"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkLayout from "@/components/DarkLayout";

export default function RecordingsPage() {
  const router = useRouter();
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch recordings
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        // In a real app, use an API call
        setTimeout(() => {
          // Mock data
          const mockRecordings = [
            {
              id: "rec-1",
              name: "Weekly Podcast #42",
              date: "2023-10-20T14:30:00Z",
              duration: 3720, // seconds
              status: "ready",
              participants: ["You", "John Smith", "Sarah Johnson"],
              thumbnail: "/placeholder-recording.jpg",
              fileSize: "256MB",
            },
            {
              id: "rec-2",
              name: "Interview with Alex",
              date: "2023-10-18T10:15:00Z",
              duration: 1860, // seconds
              status: "ready",
              participants: ["You", "Alex Williams"],
              thumbnail: "/placeholder-recording.jpg",
              fileSize: "128MB",
            },
            {
              id: "rec-3",
              name: "Marketing Strategy Session",
              date: "2023-10-16T09:00:00Z",
              duration: 5400, // seconds
              status: "processing",
              participants: ["You", "Emma Davis", "Michael Brown", "David Lee"],
              thumbnail: "/placeholder-recording.jpg",
              progress: 65, // processing progress in percent
            },
            {
              id: "rec-4",
              name: "Product Demo",
              date: "2023-10-15T15:45:00Z",
              duration: 2100, // seconds
              status: "ready",
              participants: ["You", "Jennifer Wilson"],
              thumbnail: "/placeholder-recording.jpg",
              fileSize: "180MB",
            },
            {
              id: "rec-5",
              name: "Team Standup",
              date: "2023-10-14T08:30:00Z",
              duration: 900, // seconds
              status: "ready",
              participants: ["You", "Team Members"],
              thumbnail: "/placeholder-recording.jpg",
              fileSize: "75MB",
            },
          ];

          setRecordings(mockRecordings);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching recordings:", error);
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  // Handle recordings selection
  const toggleRecordingSelection = (id) => {
    if (selectedRecordings.includes(id)) {
      setSelectedRecordings(selectedRecordings.filter((recId) => recId !== id));
    } else {
      setSelectedRecordings([...selectedRecordings, id]);
    }
  };

  // Filter and sort recordings
  const filteredAndSortedRecordings = () => {
    // First filter by status
    let filtered = [...recordings];
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (recording) => recording.status === filterStatus
      );
    }

    // Then filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recording) =>
          recording.name.toLowerCase().includes(query) ||
          recording.participants.some((p) => p.toLowerCase().includes(query))
      );
    }

    // Then sort
    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "duration") {
        return b.duration - a.duration;
      }
      return 0;
    });
  };

  // Format duration from seconds to HH:MM:SS
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DarkLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">Recordings</h1>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#222222] text-white border border-gray-700 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex space-x-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#222222] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready</option>
                <option value="processing">Processing</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#222222] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selection actions */}
        {selectedRecordings.length > 0 && (
          <div className="bg-[#111111] p-3 rounded-lg mb-6 flex justify-between items-center animate-fadeIn">
            <span>{selectedRecordings.length} recordings selected</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                Download Selected
              </button>
              <button className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded transition-colors">
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Recordings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-[#111111] rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-40 h-20 bg-gray-800 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded w-1/4 mb-3"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedRecordings().length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedRecordings().map((recording) => (
              <div
                key={recording.id}
                className={`bg-[#111111] rounded-lg overflow-hidden flex flex-col md:flex-row ${
                  selectedRecordings.includes(recording.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                {/* Selection checkbox */}
                <div
                  className="absolute top-3 left-3 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRecordingSelection(recording.id);
                  }}
                >
                  <div
                    className={`w-5 h-5 border ${
                      selectedRecordings.includes(recording.id)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-600"
                    } rounded cursor-pointer flex items-center justify-center`}
                  >
                    {selectedRecordings.includes(recording.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="w-full md:w-40 h-24 relative bg-gray-800 flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(recording.duration)}
                  </div>

                  {/* Status Indicator */}
                  {recording.status === "processing" && (
                    <div className="absolute top-2 right-2 bg-blue-900/90 text-blue-200 text-xs px-2 py-0.5 rounded flex items-center">
                      <svg
                        className="animate-spin -ml-0.5 mr-1.5 h-2.5 w-2.5 text-blue-200"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing {recording.progress}%
                    </div>
                  )}
                </div>

                {/* Recording Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/recordings/${recording.id}`}
                      className="block"
                    >
                      <h3 className="text-lg font-medium hover:text-blue-400 transition-colors">
                        {recording.name}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-center text-sm text-gray-400 mt-1 space-x-4">
                      <span>{formatDate(recording.date)}</span>
                      {recording.status === "ready" && (
                        <span>{recording.fileSize}</span>
                      )}
                      <span>{recording.participants.join(", ")}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {recording.participants.slice(0, 3).map((person, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-full bg-gray-700 border border-gray-900 flex items-center justify-center text-xs"
                        >
                          {person.charAt(0)}
                        </div>
                      ))}
                      {recording.participants.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-700 border border-gray-900 flex items-center justify-center text-xs">
                          +{recording.participants.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {recording.status === "ready" && (
                        <>
                          <button className="px-3 py-1 text-xs bg-[#222222] hover:bg-gray-800 rounded transition-colors">
                            Share
                          </button>
                          <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                            Download
                          </button>
                        </>
                      )}
                      <Link
                        href={`/recordings/${recording.id}`}
                        className="px-3 py-1 text-xs bg-[#222222] hover:bg-gray-800 rounded transition-colors flex items-center"
                      >
                        View Details
                        <svg
                          className="w-3 h-3 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] rounded-lg p-10 text-center">
            <div className="mb-4 flex justify-center">
              <svg
                className="w-16 h-16 text-gray-700"
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
            <h3 className="text-xl font-medium mb-2">No Recordings Found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your filters or search query"
                : "You haven't made any recordings yet"}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Start Recording
            </button>
          </div>
        )}
      </div>
    </DarkLayout>
  );
}
