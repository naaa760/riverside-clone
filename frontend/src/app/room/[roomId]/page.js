"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import useWebRTC from "@/hooks/useWebRTC";
import useRecorder from "@/hooks/useRecorder";

export default function RoomPage({ params }) {
  const { roomId } = params;
  const router = useRouter();
  const { user } = useUser();
  const [roomName, setRoomName] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [inviteUrl, setInviteUrl] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [chat, setChat] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  // WebRTC hook
  const {
    isConnected,
    localStream,
    peers,
    error: webRTCError,
    toggleAudio,
    toggleVideo,
  } = useWebRTC(roomId, user?.id);

  // Recorder hook
  const {
    isRecording,
    recordingTime,
    recordingStatus,
    startRecording,
    stopRecording,
    formatTime,
  } = useRecorder(localStream, roomId);

  // Set room information
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        // For demo, set some placeholder data
        setTimeout(() => {
          setRoomName("Weekly Team Meeting");
          setInviteUrl(`${window.location.origin}/room/${roomId}`);
          setParticipants([
            {
              id: "host",
              name: user?.firstName || "You (Host)",
              isHost: true,
              isMuted: false,
              isVideoOff: false,
            },
            {
              id: "guest1",
              name: "Alex Johnson",
              isMuted: true,
              isVideoOff: false,
            },
            {
              id: "guest2",
              name: "Sarah Williams",
              isMuted: false,
              isVideoOff: false,
            },
          ]);
        }, 500);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    // Initialize demo chat messages
    setChat([
      {
        user: "System",
        message: "Welcome to the room!",
        timestamp: new Date(),
      },
      {
        user: "Alex Johnson",
        message: "Hey everyone!",
        timestamp: new Date(Date.now() - 5 * 60000),
      },
    ]);

    // Set local video stream to video element when available
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }

    fetchRoomDetails();

    // Add mouse move event to show controls
    const handleMouseMove = () => {
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [roomId, user, localStream]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Handle copy invite link
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle audio toggle
  const handleToggleAudio = () => {
    const isAudioEnabled = toggleAudio();
    // Update local participant mute status
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "host" ? { ...p, isMuted: !isAudioEnabled } : p
      )
    );
  };

  // Handle video toggle
  const handleToggleVideo = () => {
    const isVideoEnabled = toggleVideo();
    // Update local participant video status
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "host" ? { ...p, isVideoOff: !isVideoEnabled } : p
      )
    );
  };

  // Handle recording toggle
  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle sending chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      user: user?.firstName || "You",
      message: chatMessage,
      timestamp: new Date(),
    };

    setChat((prev) => [...prev, newMessage]);
    setChatMessage("");
  };

  // Handle leave room
  const handleLeaveRoom = () => {
    if (isRecording) {
      if (
        confirm("You are currently recording. Are you sure you want to leave?")
      ) {
        stopRecording();
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header - always visible */}
      <div className="flex justify-between items-center px-6 py-3 bg-[#111111] border-b border-gray-800">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">{roomName || "Loading room..."}</h1>
          {isRecording && (
            <div className="ml-4 flex items-center text-red-500">
              <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-sm font-medium">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={copyInviteLink}
            className="flex items-center text-sm bg-[#222222] hover:bg-gray-800 px-3 py-1.5 rounded-md transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {isCopied ? "Copied!" : "Copy invite link"}
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-md transition-colors ${
              showChat ? "bg-blue-600" : "bg-[#222222] hover:bg-gray-800"
            }`}
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md transition-colors ${
              showSettings ? "bg-blue-600" : "bg-[#222222] hover:bg-gray-800"
            }`}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content area with videos */}
      <div className="flex-1 flex overflow-hidden">
        {/* Participant videos */}
        <div className={`flex-1 p-3 relative ${showChat ? "lg:mr-80" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-full">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className={`bg-gray-900 rounded-lg overflow-hidden relative ${
                  index === 0 ? "md:col-span-2 lg:col-span-3 row-span-2" : ""
                }`}
              >
                {index === 0 ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      participant.isVideoOff ? "hidden" : ""
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    {!participant.isVideoOff ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900"></div>
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                        {participant.name.charAt(0)}
                      </div>
                    )}
                  </div>
                )}

                {/* Participant overlay - name and status */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {participant.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      {participant.isMuted && (
                        <span className="p-1 bg-red-500 rounded-full">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                            />
                          </svg>
                        </span>
                      )}
                      {participant.isVideoOff && (
                        <span className="p-1 bg-red-500 rounded-full">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 7l-5 5M10 7l5 5"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="fixed right-0 top-16 bottom-20 w-80 bg-[#111111] border-l border-gray-800 flex flex-col lg:relative lg:top-0 lg:bottom-0 animate-slideInRight">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="font-bold">Chat</h2>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white p-1"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              ref={chatContainerRef}
            >
              {chat.map((msg, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-medium">{msg.user}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">{msg.message}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-800"
            >
              <div className="flex items-center">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#222222] border border-gray-700 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="fixed right-0 top-16 bottom-20 w-80 bg-[#111111] border-l border-gray-800 flex flex-col lg:relative lg:top-0 lg:bottom-0 animate-slideInRight">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="font-bold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white p-1"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Audio Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Microphone
                    </label>
                    <select className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Default Microphone</option>
                      <option>System Microphone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Speaker
                    </label>
                    <select className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Default Speaker</option>
                      <option>System Speaker</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Noise Cancellation
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Video Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Camera
                    </label>
                    <select className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Default Camera</option>
                      <option>External Camera</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">HD Video</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Recording Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Separate Audio Tracks
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Local Backup</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls bar - conditionally visible */}
      <div
        className={`bg-[#111111] border-t border-gray-800 p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handleToggleAudio}
            className={`p-3 rounded-full ${
              participants.find((p) => p.id === "host")?.isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#222222] hover:bg-gray-800"
            } transition-colors`}
          >
            {participants.find((p) => p.id === "host")?.isMuted ? (
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
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
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
            )}
          </button>

          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-full ${
              participants.find((p) => p.id === "host")?.isVideoOff
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#222222] hover:bg-gray-800"
            } transition-colors`}
          >
            {participants.find((p) => p.id === "host")?.isVideoOff ? (
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
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7l-5 5M10 7l5 5"
                />
              </svg>
            ) : (
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
            )}
          </button>

          <button
            onClick={handleRecordingToggle}
            className={`p-3 rounded-full ${
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#222222] hover:bg-gray-800"
            } transition-colors`}
          >
            {isRecording ? (
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
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            ) : (
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
                  d="M19.5 5.5v13h-15v-13h15z"
                />
              </svg>
            )}
          </button>

          <button
            onClick={handleLeaveRoom}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Recording status toast */}
      {recordingStatus === "processing" && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md p-3 bg-blue-900/80 text-blue-100 rounded-md text-center animate-fadeIn">
          Processing recording... This may take a few minutes.
        </div>
      )}

      {recordingStatus === "uploading" && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md p-3 bg-blue-900/80 text-blue-100 rounded-md text-center animate-fadeIn">
          Uploading recording to cloud storage...
        </div>
      )}

      {recordingStatus === "done" && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md p-3 bg-green-900/80 text-green-100 rounded-md text-center animate-fadeIn">
          Recording completed successfully and uploaded.
        </div>
      )}

      {recordingStatus === "error" && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md p-3 bg-red-900/80 text-red-100 rounded-md text-center animate-fadeIn">
          Error while recording. Please try again.
        </div>
      )}

      {webRTCError && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md p-3 bg-red-900/80 text-red-100 rounded-md text-center animate-fadeIn">
          {webRTCError}
        </div>
      )}
    </div>
  );
}
