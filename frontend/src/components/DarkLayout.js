import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function DarkLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#191919] text-white">
      <Sidebar />
      <div className={`flex-1 ${mounted ? "animate-fadeIn" : "opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}
