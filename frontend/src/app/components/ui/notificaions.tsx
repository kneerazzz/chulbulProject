"use client";

import { Bell } from "lucide-react";

interface NotificationIconProps {
  onClick?: () => void;
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full hover:bg-gray-700 transition ${className}`}
    >
      <Bell size={22} strokeWidth={2} />
      {/* 🔴 Badge (optional) */}
      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
    </button>
  );
};

export default NotificationIcon;
