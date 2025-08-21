"use client";

import { useState } from "react";
import ChangeProfilePic from "./change-profile";
import EditProfile from "./editDetails";

export default function ProfilePage({ user }: { user: any }) {
  const [currentUser, setCurrentUser] = useState(user);

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      {/* Profile Pic Section */}
      <div className="border p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold text-lg mb-2">Change Profile Picture</h2>
        <ChangeProfilePic user={currentUser} />
      </div>

      {/* Edit Details Section */}
      <div className="border p-4 rounded-xl shadow-sm">
        <h2 className="font-semibold text-lg mb-2">Edit Profile Details</h2>
        <EditProfile user={currentUser} />
      </div>
    </div>
  );
}
