"use client";
import DarkLayout from "@/components/DarkLayout";

export default function ProjectsPage() {
  return (
    <DarkLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
        <p className="text-gray-400">
          Manage all your recording projects here.
        </p>
      </div>
    </DarkLayout>
  );
}
