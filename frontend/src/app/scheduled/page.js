"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DarkLayout from "@/components/DarkLayout";

export default function ScheduledPage() {
  const router = useRouter();
  const [scheduledRecordings, setScheduledRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    date: "",
    time: "",
    duration: 60,
    participants: [""],
  });

  useEffect(() => {
    // Fetch scheduled recordings
    const fetchScheduled = async () => {
      try {
        // In a real app, replace with actual API call
        setTimeout(() => {
          const mockScheduled = [
            {
              id: "sched-1",
              title: "Weekly Team Meeting",
              dateTime: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
              ).toISOString(), // 3 days from now
              duration: 60, // minutes
              participants: [
                "john@example.com",
                "sarah@example.com",
                "alex@example.com",
              ],
              host: "You",
              roomLink: "/room/sched-1",
              projectId: "proj-1",
            },
            {
              id: "sched-2",
              title: "Interview with Jane Doe",
              dateTime: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(), // 7 days from now
              duration: 45, // minutes
              participants: ["jane@example.com"],
              host: "You",
              roomLink: "/room/sched-2",
              projectId: "proj-2",
            },
          ];

          setScheduledRecordings(mockScheduled);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching scheduled recordings:", error);
        setIsLoading(false);
      }
    };

    fetchScheduled();
  }, []);

  // Handle new participant field
  const addParticipant = () => {
    setNewSchedule({
      ...newSchedule,
      participants: [...newSchedule.participants, ""],
    });
  };

  // Handle participant change
  const handleParticipantChange = (index, value) => {
    const updatedParticipants = [...newSchedule.participants];
    updatedParticipants[index] = value;
    setNewSchedule({
      ...newSchedule,
      participants: updatedParticipants,
    });
  };

  // Remove participant
  const removeParticipant = (index) => {
    const updatedParticipants = [...newSchedule.participants];
    updatedParticipants.splice(index, 1);
    setNewSchedule({
      ...newSchedule,
      participants: updatedParticipants,
    });
  };

  // Start a scheduled session
  const startSession = (roomId) => {
    router.push(`/room/${roomId}`);
  };

  // Handle schedule form submission
  const handleScheduleSubmit = (e) => {
    e.preventDefault();

    // Create a new scheduled recording
    const newId = `sched-${Date.now()}`;
    const dateTime = `${newSchedule.date}T${newSchedule.time}:00`;

    setScheduledRecordings([
      ...scheduledRecordings,
      {
        id: newId,
        title: newSchedule.title,
        dateTime: new Date(dateTime).toISOString(),
        duration: parseInt(newSchedule.duration),
        participants: newSchedule.participants.filter((p) => p.trim() !== ""),
        host: "You",
        roomLink: `/room/${newId}`,
        projectId: "proj-1", // Default to first project
      },
    ]);

    // Reset form and close modal
    setNewSchedule({
      title: "",
      date: "",
      time: "",
      duration: 60,
      participants: [""],
    });
    setShowScheduleModal(false);
  };

  // Format date and time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const dateFormatted = date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatted = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: dateFormatted, time: timeFormatted };
  };

  return (
    <DarkLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Scheduled Recordings</h1>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
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
            Schedule New
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-[#111111] rounded-lg p-5 animate-pulse"
              >
                <div className="h-5 bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
                <div className="flex justify-end mt-4">
                  <div className="h-8 w-20 bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : scheduledRecordings.length > 0 ? (
          <div className="space-y-4">
            {scheduledRecordings.map((scheduled) => {
              const { date, time } = formatDateTime(scheduled.dateTime);
              const isUpcoming = new Date(scheduled.dateTime) > new Date();

              return (
                <div key={scheduled.id} className="bg-[#111111] rounded-lg p-5">
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{scheduled.title}</h3>
                      <div className="flex flex-wrap text-sm text-gray-400 mt-1 space-x-4">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
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
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {time} ({scheduled.duration} mins)
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Participants:</p>
                        <div className="flex flex-wrap mt-1 gap-2">
                          {scheduled.participants.map((participant, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-300"
                            >
                              {participant}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {isUpcoming ? (
                        <button
                          onClick={() => startSession(scheduled.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
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
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Enter Room
                        </button>
                      ) : (
                        <span className="inline-block bg-gray-800 text-gray-400 px-4 py-2 rounded-md">
                          Session ended
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">
              No Scheduled Recordings
            </h3>
            <p className="text-gray-500 mb-6">
              Plan your recording sessions in advance
            </p>
            <button
              onClick={() => setShowScheduleModal(true)}
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
              Schedule Your First Recording
            </button>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-lg w-full max-w-md overflow-hidden shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">Schedule Recording</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, title: e.target.value })
                  }
                  required
                  placeholder="e.g., Weekly Podcast"
                  className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, date: e.target.value })
                    }
                    required
                    className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, time: e.target.value })
                    }
                    required
                    className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={newSchedule.duration}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, duration: e.target.value })
                  }
                  className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Participants
                </label>
                {newSchedule.participants.map((participant, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="email"
                      value={participant}
                      onChange={(e) =>
                        handleParticipantChange(index, e.target.value)
                      }
                      placeholder="Email address"
                      className="flex-1 bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {newSchedule.participants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="ml-2 p-2 text-gray-400 hover:text-red-500"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addParticipant}
                  className="text-blue-500 hover:text-blue-400 text-sm flex items-center mt-2"
                >
                  <svg
                    className="w-4 h-4 mr-1"
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
                  Add another participant
                </button>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DarkLayout>
  );
}
