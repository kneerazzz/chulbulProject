"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function ChangeProfilePic({ user }: { user: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(user?.profilePic || "");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

    const handleSubmit = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("profilePic", file); // 👈 backend expects this exact key

            const res = await axios.patch("/api/auth/change-profilepic", formData, {withCredentials: true});

            if(res.data.statusCode !== 200){
                console.error("Error uploading pic")
            }
            setPreview(res.data.user); // backend returns { user: "cloudinary_url" }
            toast.success("Profile picture updated!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };



  return (
    <div className="p-4 space-y-4">
      {preview && (
        <img
          src={preview}
          alt="Profile Preview"
          className="w-24 h-24 rounded-full object-cover"
        />
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleSubmit} disabled={loading || !file}>
        {loading ? "Uploading..." : "Change Picture"}
      </Button>
    </div>
  );
}
