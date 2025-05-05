import { useState, useRef, useCallback } from "react";
import RecordRTC from "recordrtc";

export default function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Start recording
  const startRecording = useCallback(async (stream) => {
    if (!stream) {
      throw new Error("No media stream provided");
    }

    try {
      // Store stream reference
      streamRef.current = stream;

      // Initialize recorder with options
      const recorder = new RecordRTC(stream, {
        type: "video",
        mimeType: "video/webm;codecs=vp9",
        recorderType: RecordRTC.MediaStreamRecorder,
        disableLogs: true,
        videoBitsPerSecond: 1000000, // 1 Mbps
        frameRate: 30,
      });

      // Start recorder
      recorder.startRecording();
      recorderRef.current = recorder;

      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);

      setIsRecording(true);
      setRecordedBlob(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!recorderRef.current) {
        reject(new Error("No active recorder"));
        return;
      }

      try {
        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setIsProcessing(true);

        // Stop recorder
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current.getBlob();
          setRecordedBlob(blob);
          setIsRecording(false);
          setIsProcessing(false);
          recorderRef.current = null;
          resolve(blob);
        });
      } catch (error) {
        console.error("Error stopping recording:", error);
        setIsRecording(false);
        setIsProcessing(false);
        reject(error);
      }
    });
  }, []);

  // Upload recording
  const uploadRecording = useCallback(
    async (roomId) => {
      if (!recordedBlob) {
        throw new Error("No recording to upload");
      }

      try {
        setIsProcessing(true);

        // Get upload URL
        const response = await fetch(
          `/api/recordings/upload-url?roomId=${roomId}`,
          {
            method: "GET",
          }
        );

        const { uploadUrl, recordingId } = await response.json();

        // Upload the blob
        await fetch(uploadUrl, {
          method: "PUT",
          body: recordedBlob,
          headers: {
            "Content-Type": "video/webm",
          },
        });

        // Notify backend that upload is complete
        await fetch(`/api/recordings/${recordingId}/complete`, {
          method: "POST",
        });

        setIsProcessing(false);
        return { success: true, recordingId };
      } catch (error) {
        console.error("Error uploading recording:", error);
        setIsProcessing(false);
        throw error;
      }
    },
    [recordedBlob]
  );

  // Reset recording state
  const resetRecording = useCallback(() => {
    setRecordingTime(0);
    setRecordedBlob(null);
  }, []);

  // Format time display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  return {
    isRecording,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    recordedBlob,
    isProcessing,
    startRecording,
    stopRecording,
    uploadRecording,
    resetRecording,
  };
}
