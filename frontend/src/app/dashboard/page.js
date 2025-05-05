"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  useEffect(() => {
    // If user authentication has loaded and user is not logged in, redirect to home
    if (isLoaded && !user) {
      router.push("/");
    }

    // Fetch user's rooms
    if (user) {
      fetchRooms();
    }
  }, [isLoaded, user, router]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/rooms");
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewRoom = async () => {
    try {
      setIsCreatingRoom(true);
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.slug) {
        router.push(`/room/${data.slug}`);
      } else {
        throw new Error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create a new room. Please try again.");
    } finally {
      setIsCreatingRoom(false);
    }
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
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Hello, {user.firstName || user.username}
            </span>
            <button
              onClick={() => router.push("/user-profile")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Recordings</h2>
          <button
            onClick={createNewRoom}
            disabled={isCreatingRoom}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-blue-400"
          >
            {isCreatingRoom ? "Creating..." : "Start New Recording"}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading your recordings...</div>
        ) : rooms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2">No recordings yet</h3>
            <p className="text-gray-600 mb-6">
              Start your first recording to see it here
            </p>
            <button
              onClick={createNewRoom}
              disabled={isCreatingRoom}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-blue-400"
            >
              {isCreatingRoom ? "Creating..." : "Start New Recording"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function RoomCard({ room }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        <h3 className="text-lg font-medium mb-2 truncate">
          {room.name || `Room ${room.slug}`}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Created: {new Date(room.createdAt).toLocaleDateString()}
        </p>

        <div className="flex text-sm">
          <div className="flex-1">
            <p className="text-gray-600">Status</p>
            <p className="font-medium">
              {room.recordings?.length > 0 ? "Recorded" : "Not recorded"}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-gray-600">Participants</p>
            <p className="font-medium">{room.participantCount || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 flex justify-between">
        <button
          onClick={() => router.push(`/room/${room.slug}`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Join Room
        </button>
        {room.recordings?.length > 0 && (
          <button
            onClick={() => router.push(`/recordings/${room.id}`)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            View Recordings
          </button>
        )}
      </div>
    </div>
  );
}
