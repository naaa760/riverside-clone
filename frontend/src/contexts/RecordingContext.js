"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create context
const RecordingContext = createContext();

// Context provider component
export function RecordingProvider({ children }) {
  const [recordings, setRecordings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // For this demo, we'll simulate with setTimeout and static data

        setTimeout(() => {
          // Mock recordings data
          const mockRecordings = [
            {
              id: "rec-1",
              name: "Weekly Podcast #42",
              date: "2023-10-20T14:30:00Z",
              duration: 3720, // seconds
              status: "ready",
              participants: ["You", "John Smith", "Sarah Johnson"],
              thumbnail: "/placeholder-recording.jpg",
              fileSize: "256MB",
              projectId: "proj-1",
            },
            {
              id: "rec-2",
              name: "Interview with Alex",
              date: "2023-10-18T10:15:00Z",
              duration: 1860, // seconds
              status: "ready",
              participants: ["You", "Alex Williams"],
              thumbnail: "/placeholder-recording.jpg",
              fileSize: "128MB",
              projectId: "proj-2",
            },
            {
              id: "rec-3",
              name: "Marketing Strategy Session",
              date: "2023-10-16T09:00:00Z",
              duration: 5400, // seconds
              status: "processing",
              participants: ["You", "Emma Davis", "Michael Brown", "David Lee"],
              thumbnail: "/placeholder-recording.jpg",
              progress: 65, // processing progress in percent
              projectId: "proj-3",
            },
          ];

          // Mock projects data
          const mockProjects = [
            {
              id: "proj-1",
              name: "Weekly Podcast Series",
              episodes: 12,
              lastUpdated: "2023-10-20T14:30:00Z",
              collaborators: ["You", "John Smith", "Sarah Johnson"],
              thumbnail: "/placeholder-project.jpg",
              recordings: ["rec-1"],
            },
            {
              id: "proj-2",
              name: "Marketing Interviews",
              episodes: 5,
              lastUpdated: "2023-10-18T10:15:00Z",
              collaborators: ["You", "Alex Williams"],
              thumbnail: "/placeholder-project.jpg",
              recordings: ["rec-2"],
            },
            {
              id: "proj-3",
              name: "Product Tutorials",
              episodes: 8,
              lastUpdated: "2023-10-16T09:00:00Z",
              collaborators: ["You", "Emma Davis", "Michael Brown"],
              thumbnail: "/placeholder-project.jpg",
              recordings: ["rec-3"],
            },
          ];

          setRecordings(mockRecordings);
          setProjects(mockProjects);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to add a new recording
  const addRecording = (newRecording) => {
    // Add the recording to the recordings list
    setRecordings((prevRecordings) => [...prevRecordings, newRecording]);

    // If there's a projectId, update the project's recordings as well
    if (newRecording.projectId) {
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === newRecording.projectId) {
            return {
              ...project,
              episodes: project.episodes + 1,
              lastUpdated: new Date().toISOString(),
              recordings: [...project.recordings, newRecording.id],
            };
          }
          return project;
        })
      );
    }
  };

  // Function to update a recording's status
  const updateRecordingStatus = (
    recordingId,
    status,
    progressOrFileSize = null
  ) => {
    setRecordings((prevRecordings) =>
      prevRecordings.map((recording) => {
        if (recording.id === recordingId) {
          const updatedRecording = { ...recording, status };

          // If it's processing, add progress
          if (status === "processing" && progressOrFileSize !== null) {
            updatedRecording.progress = progressOrFileSize;
          }

          // If it's ready, add fileSize
          if (status === "ready" && progressOrFileSize !== null) {
            updatedRecording.fileSize = progressOrFileSize;
            delete updatedRecording.progress;
          }

          return updatedRecording;
        }
        return recording;
      })
    );
  };

  // Function to create a new project
  const addProject = (newProject) => {
    setProjects((prevProjects) => [
      ...prevProjects,
      {
        ...newProject,
        episodes: 0,
        recordings: [],
        lastUpdated: new Date().toISOString(),
      },
    ]);
  };

  return (
    <RecordingContext.Provider
      value={{
        recordings,
        projects,
        isLoading,
        addRecording,
        updateRecordingStatus,
        addProject,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
}

// Custom hook to use the context
export function useRecordingContext() {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error(
      "useRecordingContext must be used within a RecordingProvider"
    );
  }
  return context;
}
