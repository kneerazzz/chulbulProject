"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function CreateSkillPlanPage() {
  const router = useRouter();
  const { skillId } = useParams<{ skillId: string }>();

  const [skill, setSkill] = useState<{ title: string; category: string } | null>(null);
  const [targetLevel, setTargetLevel] = useState("");
  const [durationInDays, setDurationInDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingSkill, setFetchingSkill] = useState(true);

  useEffect(() => {
    async function fetchSkill() {
      try {
        const res = await axios.get(`/api/skills/get-skill?skillId=${skillId}`);
        setSkill({
          title: res.data.data.title,
          category: res.data.data.category,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load skill details");
      } finally {
        setFetchingSkill(false);
      }
    }
    if (skillId) fetchSkill();
  }, [skillId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = {
        targetLevel,
        durationInDays
      }
      console.log(formData)
      const res = await axios.post(`/api/skillPlan/create-plan?skillId=${skillId}`, formData);
      console.log(res.data.data)
      const response = res.data.data
      const skillPlanId = response._id;
      router.push(`/skillPlans/${skillPlanId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create skill plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Skill Plan</CardTitle>
        </CardHeader>
        
        <CardContent>
          {fetchingSkill ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {skill && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <h2 className="text-xl font-semibold">{skill.title}</h2>
                  <p className="text-sm text-muted-foreground">Category: {skill.category}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Target Proficiency Level</Label>
                  <Select onValueChange={setTargetLevel} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your target level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose the level you want to achieve
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Plan Duration</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={durationInDays}
                      onChange={(e) => setDurationInDays(Number(e.target.value))}
                      min={1}
                      max={365}
                      className="h-12 w-24"
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended: 30-90 days for best results
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading || !targetLevel}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Plan"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}