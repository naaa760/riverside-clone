"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";

export default function useWebRTC(roomId, userId) {
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const peerConnectionsRef = useRef({});

  // Set up WebRTC and Socket.io
  useEffect(() => {
    // For demo, we'll use local media only
    // In a real app, this would be connected to a real signaling server

    if (!roomId || !userId) return;

    // Get user media
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);

        // In a full implementation, we would:
        // 1. Connect to the signaling server
        // 2. Create peers as other users join
        // 3. Exchange SDP and ICE candidates

        // Simulate other peers for demo
        // In a real app, these would come from the signaling server
        setTimeout(() => {
          setPeers([
            {
              id: "peer-1",
              name: "John Smith",
              videoRef: { current: null },
            },
            {
              id: "peer-2",
              name: "Sarah Johnson",
              videoRef: { current: null },
            },
          ]);
          setIsConnected(true);
        }, 1000);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError(
          "Could not access camera or microphone. Please check permissions."
        );
      }
    };

    startMedia();

    // Clean up
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      // In a real app:
      // - Disconnect from signaling server
      // - Close all peer connections
    };
  }, [roomId, userId]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }, [localStream]);

  return {
    isConnected,
    localStream,
    peers,
    error,
    toggleAudio,
    toggleVideo,
  };
}
