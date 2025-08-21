"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";

export default function EditProfile({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    username: user?.username || "",
    bio: user?.bio || "",
    interests: user?.interests?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        interests: formData.interests
          .split(",")
          .map((i: any) => i.trim())
          .filter((i: any) => i.length > 0),
      };

      const res = await axios.patch(`/api/auth/update-details`, payload, {withCredentials: true});
      if (res.data.statusCode !== 200) throw new Error(await res.data.message);
      toast.success("Profile updated successfully!!")
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input
        name="fullname"
        value={formData.fullname}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <Input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <Textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Your bio..."
      />
      <Input
        name="interests"
        value={formData.interests}
        onChange={handleChange}
        placeholder="Interests (comma separated)"
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
