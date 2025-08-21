"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import React from "react";
import { 
  Loader2, 
  ChevronLeft, 
  Target, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  CheckCircle,
  Clock,
  Award,
  Zap,
  AlertTriangle,
  Code,
  Palette,
  Shield,
  Users,
  Globe,
  Briefcase
} from "lucide-react";
import axios from "axios";

export default function CreateSkillPlanPage() {
  const router = useRouter();
  const { skillId } = useParams<{ skillId: string }>();

  const [skill, setSkill] = useState<{ title: string; category: string; level?: number } | null>(null);
  const [targetLevel, setTargetLevel] = useState("");
  const [durationInDays, setDurationInDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingSkill, setFetchingSkill] = useState(true);

  // Category icons mapping
  const categoryIcons = {
    programming: Code,
    design: Palette,
    cybersecurity: Shield,
    marketing: TrendingUp,
    management: Users,
    languages: Globe,
    business: Briefcase,
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category as keyof typeof categoryIcons] || Award;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      programming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      design: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      cybersecurity: "bg-red-500/20 text-red-400 border-red-500/30",
      marketing: "bg-green-500/20 text-green-400 border-green-500/30",
      management: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      languages: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      business: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getLevelInfo = (level: string) => {
    const levels = {
      beginner: { 
        label: "Beginner", 
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        description: "Learn the fundamentals and basic concepts",
        duration: "Recommended: 30-60 days",
        icon: BookOpen
      },
      intermediate: { 
        label: "Intermediate", 
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        description: "Build solid working knowledge and practical skills",
        duration: "Recommended: 60-90 days",
        icon: TrendingUp
      },
      advanced: { 
        label: "Advanced", 
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        description: "Develop expertise and handle complex challenges",
        duration: "Recommended: 90-120 days",
        icon: Zap
      },
      expert: { 
        label: "Expert", 
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        description: "Master the field and mentor others",
        duration: "Recommended: 120+ days",
        icon: Award
      }
    };
    return levels[level as keyof typeof levels] || levels.beginner;
  };

  const getDurationRecommendation = (days: number) => {
    if (days < 30) return { color: "text-red-400", message: "Very ambitious timeline" };
    if (days <= 60) return { color: "text-yellow-400", message: "Good pace for focused learning" };
    if (days <= 120) return { color: "text-green-400", message: "Balanced and sustainable" };
    return { color: "text-blue-400", message: "Thorough and comprehensive" };
  };

  useEffect(() => {
    async function fetchSkill() {
      try {
        const res = await axios.get(`/api/skills/get-skill?skillId=${skillId}`);
        setSkill({
          title: res.data.data.title,
          category: res.data.data.category,
          level: res.data.data.level
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
      };
      console.log(formData);
      const res = await axios.post(`/api/skillPlan/create-plan?skillId=${skillId}`, formData, {
        withCredentials: true
      });
      console.log(res.data.data);
      const response = res.data.data;
      const skillPlanId = response._id;
      router.push(`/skillPlans/${skillPlanId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create skill plan");
    } finally {
      setLoading(false);
    }
  }

  if (fetchingSkill) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-white mx-auto mb-6" />
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-white/20 mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Skill</h3>
          <p className="text-gray-400">Fetching skill details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="h-10 w-10 text-gray-400 hover:text-white hover:bg-neutral-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">Create Learning Plan</h1>
            <p className="text-gray-400 text-lg">Design a structured path to achieve your skill goals</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-900 border-neutral-800 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-2xl">
                  <Target className="h-6 w-6 text-gray-400" />
                  Plan Configuration
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Set your learning objectives and timeline
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Skill Info */}
                {skill && (
                  <div className="p-6 bg-neutral-800 border border-neutral-700 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">{skill.title}</h2>
                        <div className="flex items-center gap-2">
                          {React.createElement(getCategoryIcon(skill.category), { 
                            className: "h-4 w-4 text-gray-400" 
                          })}
                          <Badge className={`${getCategoryColor(skill.category)} border font-medium`}>
                            {skill.category}
                          </Badge>
                          {skill.level && (
                            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border font-medium">
                              Current Level: {skill.level}/10
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Target Level Selection */}
                  <div className="space-y-4">
                    <Label className="text-white font-medium flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-gray-400" />
                      Target Proficiency Level *
                    </Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['beginner', 'intermediate', 'advanced', 'expert'].map((level) => {
                        const levelInfo = getLevelInfo(level);
                        const IconComponent = levelInfo.icon;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setTargetLevel(level)}
                            className={`p-4 rounded-lg border transition-all duration-200 text-left hover:scale-105 ${
                              targetLevel === level
                                ? `${levelInfo.color} border-current shadow-lg`
                                : "bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:border-neutral-600"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <IconComponent className="h-5 w-5" />
                              <span className="font-semibold">{levelInfo.label}</span>
                            </div>
                            <p className="text-sm opacity-80 mb-2">{levelInfo.description}</p>
                            <p className="text-xs opacity-60">{levelInfo.duration}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-4">
                    <Label className="text-white font-medium flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      Plan Duration
                    </Label>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={durationInDays}
                          onChange={(e) => setDurationInDays(Number(e.target.value))}
                          min={1}
                          max={365}
                          className="bg-neutral-800 border-neutral-700 text-white h-12 text-lg"
                        />
                      </div>
                      <span className="text-gray-400 font-medium">days</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm font-medium ${getDurationRecommendation(durationInDays).color}`}>
                        {getDurationRecommendation(durationInDays).message}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <Alert className="bg-red-500/20 border-red-500/30">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>

              <CardFooter className="flex justify-between pt-6 border-t border-neutral-800">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={loading}
                  className="px-6 py-2.5 bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={loading || !targetLevel}
                  className="px-8 py-2.5 bg-white text-black hover:bg-gray-100 font-medium disabled:bg-gray-600 disabled:text-gray-400"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Plan...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Learning Plan
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Preview */}
            {targetLevel && (
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Plan Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Target Level</span>
                      <Badge className={`${getLevelInfo(targetLevel).color} border`}>
                        {getLevelInfo(targetLevel).label}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Duration</span>
                      <span className="text-white font-medium">{durationInDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Daily Commitment</span>
                      <span className="text-white font-medium">~2-3 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Planning Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Choose a realistic timeline that fits your schedule</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Set specific, measurable learning objectives</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Consider your current skill level when setting targets</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Plans can be adjusted as you progress</p>
                </div>
              </CardContent>
            </Card>

            {/* Success Factors */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Success Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>Consistent daily practice</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>Regular progress tracking</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>Hands-on project work</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p>Community engagement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}