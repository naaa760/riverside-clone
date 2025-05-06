"use client";

import { useState, useEffect, useRef } from "react";

export default function useWebRTC(roomId, userId) {
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [error, setError] = useState(null);

  const peerConnectionsRef = useRef({});
  const localStreamRef = useRef(null);

  // Initialize WebRTC
  useEffect(() => {
    const setupMedia = async () => {
      try {
        // Request user media
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        setLocalStream(stream);
        localStreamRef.current = stream;
        setIsConnected(true);

        // In a real app, you would connect to a signaling server
        // and set up peer connections here

        // For demo purposes, we'll simulate peer data
        setTimeout(() => {
          setPeers({
            peer1: {
              id: "peer1",
              name: "John Smith",
              audioEnabled: true,
              videoEnabled: true,
              stream: null, // In a real app, this would be the remote stream
            },
            peer2: {
              id: "peer2",
              name: "Sarah Johnson",
              audioEnabled: true,
              videoEnabled: false,
              stream: null,
            },
          });
        }, 2000);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError(
          "Could not access camera or microphone. Please check your permissions."
        );
      }
    };

    if (roomId && userId) {
      setupMedia();
    }

    return () => {
      // Clean up
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Close all peer connections
      Object.values(peerConnectionsRef.current).forEach((pc) => {
        if (pc) pc.close();
      });
    };
  }, [roomId, userId]);

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  return {
    isConnected,
    localStream,
    peers,
    audioEnabled,
    videoEnabled,
    error,
    toggleAudio,
    toggleVideo,
  };
}
