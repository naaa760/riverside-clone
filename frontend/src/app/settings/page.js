"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import DarkLayout from "@/components/DarkLayout";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("general");
  const [notificationSettings, setNotificationSettings] = useState({
    emailRecordingReady: true,
    emailNewTeamMember: true,
    emailProjectActivity: false,
    browserNotifications: true,
  });
  const [videoSettings, setVideoSettings] = useState({
    defaultQuality: "1080p",
    hardwareAcceleration: true,
    optimizeForLowBandwidth: false,
  });
  const [audioSettings, setAudioSettings] = useState({
    microphoneEnhancement: true,
    noiseCancellation: true,
    autoAdjustVolume: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);

    // In a real app, we'd make an API call to save these settings
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
  };

  // If user data is still loading, show a loading state
  if (!isLoaded) {
    return (
      <DarkLayout>
        <div className="p-8 animate-pulse">
          <div className="h-8 w-40 bg-gray-800 rounded mb-8"></div>
          <div className="max-w-4xl mx-auto">
            <div className="flex mb-8 space-x-2">
              <div className="h-10 w-24 bg-gray-800 rounded"></div>
              <div className="h-10 w-24 bg-gray-800 rounded"></div>
              <div className="h-10 w-24 bg-gray-800 rounded"></div>
            </div>
            <div className="bg-[#111111] rounded-lg p-6">
              <div className="h-6 w-1/3 bg-gray-800 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-800 rounded"></div>
                <div className="h-12 bg-gray-800 rounded"></div>
                <div className="h-12 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </DarkLayout>
    );
  }

  return (
    <DarkLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 mb-8">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-2 px-4 font-medium text-sm mr-2 ${
                activeTab === "general"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("audio")}
              className={`py-2 px-4 font-medium text-sm mr-2 ${
                activeTab === "audio"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`py-2 px-4 font-medium text-sm mr-2 ${
                activeTab === "video"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Video
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "notifications"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Notifications
            </button>
          </div>

          {/* Settings Content */}
          <div className="bg-[#111111] rounded-lg p-6">
            {activeTab === "general" && (
              <div>
                <h2 className="text-lg font-medium mb-6">General Settings</h2>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Profile
                  </h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden mr-4">
                      {user.imageUrl && (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-400">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.fullName}
                    className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user.primaryEmailAddress?.emailAddress}
                    disabled
                    className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    To change your email, update it in your account settings.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  <select className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "audio" && (
              <div>
                <h2 className="text-lg font-medium mb-6">Audio Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Microphone Enhancement
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={audioSettings.microphoneEnhancement}
                        onChange={(e) =>
                          setAudioSettings({
                            ...audioSettings,
                            microphoneEnhancement: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          audioSettings.microphoneEnhancement
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          audioSettings.microphoneEnhancement
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Noise Cancellation
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={audioSettings.noiseCancellation}
                        onChange={(e) =>
                          setAudioSettings({
                            ...audioSettings,
                            noiseCancellation: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          audioSettings.noiseCancellation
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          audioSettings.noiseCancellation ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Auto-Adjust Volume
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={audioSettings.autoAdjustVolume}
                        onChange={(e) =>
                          setAudioSettings({
                            ...audioSettings,
                            autoAdjustVolume: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          audioSettings.autoAdjustVolume
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          audioSettings.autoAdjustVolume ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "video" && (
              <div>
                <h2 className="text-lg font-medium mb-6">Video Settings</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Recording Quality
                  </label>
                  <select
                    className="w-full bg-[#222222] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={videoSettings.defaultQuality}
                    onChange={(e) =>
                      setVideoSettings({
                        ...videoSettings,
                        defaultQuality: e.target.value,
                      })
                    }
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="2k">2K QHD</option>
                    <option value="4k">4K UHD (PRO)</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Hardware Acceleration
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={videoSettings.hardwareAcceleration}
                        onChange={(e) =>
                          setVideoSettings({
                            ...videoSettings,
                            hardwareAcceleration: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          videoSettings.hardwareAcceleration
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          videoSettings.hardwareAcceleration
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Optimize for Low Bandwidth
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={videoSettings.optimizeForLowBandwidth}
                        onChange={(e) =>
                          setVideoSettings({
                            ...videoSettings,
                            optimizeForLowBandwidth: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          videoSettings.optimizeForLowBandwidth
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          videoSettings.optimizeForLowBandwidth
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-medium mb-6">
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Email when recording is ready
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailRecordingReady}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailRecordingReady: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          notificationSettings.emailRecordingReady
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          notificationSettings.emailRecordingReady
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Email when added to a project
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNewTeamMember}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNewTeamMember: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          notificationSettings.emailNewTeamMember
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          notificationSettings.emailNewTeamMember
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Email about project activity
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailProjectActivity}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailProjectActivity: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          notificationSettings.emailProjectActivity
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          notificationSettings.emailProjectActivity
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Browser notifications
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full">
                      <input
                        type="checkbox"
                        checked={notificationSettings.browserNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            browserNotifications: e.target.checked,
                          })
                        }
                        className="sr-only"
                      />
                      <div
                        className={`absolute inset-0 rounded-full transition ${
                          notificationSettings.browserNotifications
                            ? "bg-blue-600"
                            : "bg-gray-700"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          notificationSettings.browserNotifications
                            ? "translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DarkLayout>
  );
}
