"use client";

import { useState, useRef, useEffect } from "react";
import { useRecordingContext } from "@/contexts/RecordingContext";

export default function useRecorder(stream, roomId) {
  const { addRecording, updateRecordingStatus } = useRecordingContext();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState("idle"); // idle, recording, processing, uploading, done, error

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingIdRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Start recording
  const startRecording = () => {
    if (!stream) {
      setRecordingStatus("error");
      return;
    }

    // Reset
    chunksRef.current = [];
    setRecordingTime(0);
    recordingIdRef.current = `rec-${Date.now()}`;

    try {
      // Create MediaRecorder
      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // Handle recording stop
      mediaRecorderRef.current.onstop = async () => {
        // Process recording
        setRecordingStatus("processing");

        try {
          // Simulate processing time
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Create blob from chunks
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const fileSize = Math.round(blob.size / (1024 * 1024)) + "MB";

          // Update recording status to uploading
          setRecordingStatus("uploading");
          updateRecordingStatus(recordingIdRef.current, "processing", 50);

          // Simulate upload time
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Add to recordings context
          const newRecording = {
            id: recordingIdRef.current,
            name: `Recording ${new Date().toLocaleString()}`,
            date: new Date().toISOString(),
            duration: recordingTime,
            status: "ready",
            participants: ["You", "John Smith", "Sarah Johnson"],
            thumbnail: "/placeholder-recording.jpg",
            fileSize,
            projectId: "proj-1", // You could make this dynamic
            url,
          };

          addRecording(newRecording);
          updateRecordingStatus(recordingIdRef.current, "ready", fileSize);
          setRecordingStatus("done");

          // Reset after a delay
          setTimeout(() => {
            setRecordingStatus("idle");
          }, 3000);
        } catch (error) {
          console.error("Error processing recording:", error);
          setRecordingStatus("error");
        }
      };

      // Start recording
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setRecordingStatus("recording");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingStatus("error");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    isRecording,
    recordingTime,
    recordingStatus,
    startRecording,
    stopRecording,
    formatTime,
  };
}
