"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkLayout from "@/components/DarkLayout";
import { useRecordingContext } from "@/contexts/RecordingContext";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, recordings, isLoading, addProject } = useRecordingContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  // Handle form submission for new project
  const handleCreateProject = (e) => {
    e.preventDefault();

    if (!newProject.name.trim()) return;

    // Create new project with the context
    addProject({
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      collaborators: ["You"],
    });

    // Reset and close modal
    setNewProject({ name: "", description: "" });
    setShowCreateModal(false);
  };

  // Format date for display
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get project recordings
  const getProjectRecordings = (projectId) => {
    return recordings.filter((recording) => recording.projectId === projectId);
  };

  return (
    <DarkLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <button
            onClick={() => setShowCreateModal(true)}
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
            New Project
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-[#111111] rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gray-800"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const projectRecordings = getProjectRecordings(project.id);
              const recentRecording = projectRecordings[0];

              return (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className="bg-[#111111] rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="h-40 bg-gray-900 relative">
                    {projectRecordings.length > 0 ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
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
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs text-gray-400">
                                Latest recording:
                              </span>
                              <p className="text-sm truncate">
                                {recentRecording?.name || "No recordings"}
                              </p>
                            </div>
                            {recentRecording && (
                              <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                                {new Date(
                                  recentRecording.date
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-gray-700 mb-2"
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
                          <p className="text-sm text-gray-500">
                            No recordings yet
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-1">{project.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">
                        {project.episodes}{" "}
                        {project.episodes === 1 ? "episode" : "episodes"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Updated {formatDate(project.lastUpdated)}
                      </p>
                    </div>
                    <div className="mt-3 flex">
                      {project.collaborators.slice(0, 3).map((person, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-full bg-gray-700 -ml-2 first:ml-0 border border-gray-900 flex items-center justify-center text-xs"
                        >
                          {person.charAt(0)}
                        </div>
                      ))}
                      {project.collaborators.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-700 -ml-2 border border-gray-900 flex items-center justify-center text-xs">
                          +{project.collaborators.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first project to organize your recordings
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
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
              Create Your First Project
            </button>
          </div>
        )}
      </div>

      {/* Project Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-lg w-full max-w-md overflow-hidden shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
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
            <form onSubmit={handleCreateProject} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  placeholder="Enter project name"
                  required
                  className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows="3"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter project description"
                  className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DarkLayout>
  );
}
