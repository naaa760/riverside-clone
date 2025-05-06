"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, completed, processing

  useEffect(() => {
    // Fetch recordings from API
    const fetchRecordings = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/recordings');
        // const data = await response.json();

        // For demo, use hardcoded data
        setTimeout(() => {
          setRecordings([
            {
              id: "rec-1",
              roomName: "Weekly Podcast",
              date: new Date("2023-10-15"),
              duration: 3720, // in seconds
              participants: ["You", "John Smith", "Sarah Johnson"],
              status: "ready",
            },
            {
              id: "rec-2",
              roomName: "Interview with Sarah",
              date: new Date("2023-10-18"),
              duration: 1860, // in seconds
              participants: ["You", "Sarah Johnson"],
              status: "ready",
            },
            {
              id: "rec-3",
              roomName: "Marketing Meeting",
              date: new Date("2023-10-20"),
              duration: 5400, // in seconds
              participants: [
                "You",
                "Alex Brown",
                "Emma Wilson",
                "James Taylor",
              ],
              status: "processing",
            },
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching recordings:", error);
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  // Format duration helper function
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours > 0 ? `${hours}h` : null,
      minutes > 0 ? `${minutes}m` : null,
      hours === 0 ? `${secs}s` : null,
    ]
      .filter(Boolean)
      .join(" ");
  };

  // Filter recordings based on status
  const filteredRecordings = recordings.filter((recording) => {
    if (filter === "all") return true;
    if (filter === "completed") return recording.status === "ready";
    if (filter === "processing") return recording.status === "processing";
    return true;
  });

  return (
    <DashboardLayout title="Recordings">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Recordings</h1>
          <p className="text-gray-600 mt-1">
            Manage and download your past recordings
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Recordings</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
        </div>
      ) : filteredRecordings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">
            {filter === "all"
              ? "You don't have any recordings yet."
              : `No ${filter} recordings found.`}
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create a Room
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recording
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecordings.map((recording) => (
                  <tr key={recording.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {recording.roomName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {recording.date.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDuration(recording.duration)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {recording.participants.length} participants
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            recording.status === "ready"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {recording.status === "ready" ? "Ready" : "Processing"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/recordings/${recording.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      {recording.status === "ready" && (
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={(e) => {
                            e.preventDefault();
                            // In a real app, trigger download
                            alert("Download would start here");
                          }}
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
