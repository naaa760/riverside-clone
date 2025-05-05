"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useWebRTC from "@/hooks/useWebRTC";
import useRecorder from "@/hooks/useRecorder";

export default function RoomPage() {
  const { slug } = useParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const localVideoRef = useRef(null);

  // Fetch room details and initialize
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }

    if (slug && user) {
      fetchRoomDetails();
    }
  }, [slug, user, isLoaded, router]);

  // Get room details from API
  const fetchRoomDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rooms/${slug}`);
      const data = await response.json();

      if (data.room) {
        setRoom(data.room);
      } else {
        throw new Error("Room not found");
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
      alert(
        "Failed to load room. It may not exist or you may not have access."
      );
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize WebRTC connection
  const {
    isConnected,
    localStream,
    peers,
    error: webrtcError,
  } = useWebRTC(room?.id, user?.id);

  // Initialize recorder
  const {
    isRecording,
    recordingTime,
    formattedTime,
    isProcessing,
    startRecording,
    stopRecording,
    uploadRecording,
  } = useRecorder();

  // Handle recording start
  const handleStartRecording = async () => {
    try {
      if (!localStream) {
        alert(
          "No video stream available. Please ensure your camera and microphone are connected."
        );
        return;
      }

      await startRecording(localStream);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to start recording. Please try again.");
    }
  };

  // Handle recording stop and upload
  const handleStopRecording = async () => {
    try {
      const blob = await stopRecording();

      const { success } = await uploadRecording(room.id);

      if (success) {
        alert(
          "Recording uploaded successfully! It will be processed and available soon."
        );
      }
    } catch (error) {
      console.error("Error stopping/uploading recording:", error);
      alert("There was an issue with your recording. Please try again.");
    }
  };

  // Set local stream to video element
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Show error if WebRTC fails
  useEffect(() => {
    if (webrtcError) {
      alert(`Connection error: ${webrtcError}`);
    }
  }, [webrtcError]);

  // Show/hide controls on mouse move
  useEffect(() => {
    let timeout;

    const handleMouseMove = () => {
      setShowControls(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!isRecording) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isRecording]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading room...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header
        className={`bg-gray-800 shadow-lg transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {room?.name || `Room: ${slug}`}
            </h1>
            <p className="text-gray-400 text-sm">
              {isRecording ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  Recording: {formattedTime}
                </span>
              ) : (
                "Not recording"
              )}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              } ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isProcessing
                ? "Processing..."
                : isRecording
                ? "Stop Recording"
                : "Start Recording"}
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 font-medium rounded-lg transition-colors"
            >
              Exit Room
            </button>
          </div>
        </div>
      </header>

      <main className="relative h-[calc(100vh-72px)]">
        {/* Connection status indicator */}
        {!isConnected && (
          <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
            Connecting...
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full p-2">
          {/* Local video */}
          <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 px-2 py-1 rounded text-sm">
              You (Local)
            </div>
          </div>

          {/* Remote participants */}
          {peers.map((peer) => (
            <div
              key={peer.id}
              className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative"
            >
              {peer.stream ? (
                <video
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  // In a real implementation, we would set srcObject in a useEffect
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-700 h-20 w-20 rounded-full flex items-center justify-center text-3xl">
                    {peer.name[0]}
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 px-2 py-1 rounded text-sm">
                {peer.name}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
