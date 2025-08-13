"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";

const UpdateSkillPage = () => {
  const router = useRouter();
  const params = useParams();
  const skillId = params?.skillId as string;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });
  const [originalData, setOriginalData] = useState({
    title: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch skill details
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await axios.get(`/api/skills/get-skill?skillId=${skillId}`, {
          withCredentials: true,
        });

        const { title, category } = response.data.data;
        setFormData({ title, category });
        setOriginalData({ title, category });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load skill");
        router.push("/skills");
      } finally {
        setIsFetching(false);
      }
    };

    if (skillId) fetchSkill();
  }, [skillId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.patch(`/api/skills/update-skill?skillId=${skillId}`, formData, {
        withCredentials: true,
      });
      toast.success("Skill updated successfully!");
      router.push(`/skills/${skillId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Update Skill</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <p className="text-muted-foreground">Loading skill details...</p>
          ) : (
            <>
              {/* Show previous values */}
              <div className="mb-6 p-4 border rounded bg-muted">
                <p className="text-sm text-muted-foreground">Current Title:</p>
                <p className="font-medium">{originalData.title}</p>

                <p className="text-sm text-muted-foreground mt-4">
                  Current Category:
                </p>
                <p className="font-medium">{originalData.category}</p>
              </div>

              {/* Update form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">New Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">New Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/skills")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Updating..." : "Update Skill"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSkillPage;
