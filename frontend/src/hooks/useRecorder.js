"use client";

import { useState, useEffect, useRef } from "react";

export default function useRecorder(stream, roomId) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState("idle"); // idle, recording, processing, uploading, done, error
  const [recordingUrl, setRecordingUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  // Start the recording process
  const startRecording = () => {
    if (!stream) {
      setRecordingStatus("error");
      return;
    }

    try {
      recordedChunksRef.current = [];

      // Create a media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9,opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data as it becomes available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // Handle when recording stops
      mediaRecorder.onstop = () => {
        setIsRecording(false);

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // Create a blob from the recorded chunks
        processRecording();
      };

      // Start the media recorder
      mediaRecorder.start(1000); // Collect data every second

      // Update UI state
      setIsRecording(true);
      setRecordingStatus("recording");
      setRecordingTime(0);
      startTimeRef.current = Date.now();

      // Start a timer to update the recording time
      timerRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(seconds);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingStatus("error");
    }
  };

  // Stop the recording process
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Process the recording after stopping
  const processRecording = async () => {
    try {
      setRecordingStatus("processing");

      // Create a blob from the recorded chunks
      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      // Create a local URL for preview if needed
      const url = URL.createObjectURL(blob);
      setRecordingUrl(url);

      // Upload the blob to the server
      await uploadRecording(blob);
    } catch (error) {
      console.error("Error processing recording:", error);
      setRecordingStatus("error");
    }
  };

  // Upload the recording to the server
  const uploadRecording = async (blob) => {
    try {
      setRecordingStatus("uploading");

      // In a real app, get a signed URL and upload the file
      // const response = await fetch(`/api/recordings/upload?roomId=${roomId}`, {
      //   method: 'POST',
      // });
      // const { uploadUrl } = await response.json();
      // await fetch(uploadUrl, {
      //   method: 'PUT',
      //   body: blob,
      //   headers: {
      //     'Content-Type': 'video/webm',
      //   },
      // });

      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mark as complete
      setRecordingStatus("done");

      // After 5 seconds, reset the status to idle
      setTimeout(() => {
        setRecordingStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Error uploading recording:", error);
      setRecordingStatus("error");
    }
  };

  // Format time helper function
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    isRecording,
    recordingTime,
    recordingStatus,
    recordingUrl,
    startRecording,
    stopRecording,
    formatTime,
  };
}
