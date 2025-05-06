"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DarkLayout from "@/components/DarkLayout";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Fetch projects data
    const fetchProjects = async () => {
      try {
        // In a real app, replace with actual API call
        setTimeout(() => {
          setProjects([
            {
              id: "proj-1",
              name: "Weekly Podcast Series",
              episodes: 12,
              lastUpdated: "2 days ago",
              collaborators: ["You", "John Smith", "Sarah Johnson"],
              thumbnail: "/placeholder-project.jpg",
            },
            {
              id: "proj-2",
              name: "Marketing Interviews",
              episodes: 5,
              lastUpdated: "1 week ago",
              collaborators: ["You", "Alex Williams"],
              thumbnail: "/placeholder-project.jpg",
            },
            {
              id: "proj-3",
              name: "Product Tutorials",
              episodes: 8,
              lastUpdated: "3 days ago",
              collaborators: ["You", "Emma Davis", "Michael Brown"],
              thumbnail: "/placeholder-project.jpg",
            },
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-[#111111] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group"
              >
                <div className="h-40 bg-gray-800 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2 group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {project.episodes} episodes
                    </span>
                    <span className="text-sm text-gray-400">
                      Updated {project.lastUpdated}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex -space-x-2">
                      {project.collaborators.slice(0, 3).map((person, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-full bg-gray-700 border border-gray-900 flex items-center justify-center text-xs"
                        >
                          {person.charAt(0)}
                        </div>
                      ))}
                      {project.collaborators.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-700 border border-gray-900 flex items-center justify-center text-xs">
                          +{project.collaborators.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add new project card */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0e0e0e] border-2 border-dashed border-gray-700 rounded-lg h-full min-h-[220px] flex flex-col items-center justify-center hover:border-blue-500 transition-colors group"
            >
              <svg
                className="w-12 h-12 text-gray-600 group-hover:text-blue-500 transition-colors mb-3"
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
              <span className="text-gray-500 group-hover:text-blue-500 transition-colors">
                Create New Project
              </span>
            </button>
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
            <form className="p-6">
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
                  placeholder="Enter project name"
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
