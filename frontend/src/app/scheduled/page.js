"use client";
import DarkLayout from "@/components/DarkLayout";

export default function ScheduledPage() {
  return (
    <DarkLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Scheduled Recordings</h1>
        <p className="text-gray-400">
          Manage your upcoming recording sessions.
        </p>
      </div>
    </DarkLayout>
  );
}
