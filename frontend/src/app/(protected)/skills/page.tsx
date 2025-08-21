"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Skill } from "@/types";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { 
  Loader2, 
  Plus, 
  BookOpen, 
  TrendingUp, 
  Filter, 
  Target,
  BarChart3,
  ChevronLeft,
  Award,
  ArrowRight
} from "lucide-react";

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/skills/get-all-skills", { withCredentials: true });
        const skills = response.data.data;
        setSkills(skills);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Get unique categories for filtering
  const categories = ["all", ...new Set(skills.map(skill => skill.category))];
  
  // Filter skills based on selected category
  const filteredSkills = selectedCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  // Helper function to convert level to number safely
  const getLevelAsNumber = (level: string | number): number => {
    return typeof level === 'string' ? parseInt(level) || 0 : level;
  };

  // Get level color for badges
  const getLevelColor = (level: string | number) => {
    const numLevel = getLevelAsNumber(level);
    if (numLevel <= 3) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (numLevel <= 6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (numLevel <= 8) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  const getLevelLabel = (level: string | number) => {
    const numLevel = getLevelAsNumber(level);
    if (numLevel <= 3) return "Beginner";
    if (numLevel <= 6) return "Intermediate";
    if (numLevel <= 8) return "Advanced";
    return "Expert";
  };

  // Calculate average level safely
  const calculateAverageLevel = () => {
    if (skills.length === 0) return 0;
    const total = skills.reduce((acc, skill) => acc + getLevelAsNumber(skill.level), 0);
    return Math.round(total / skills.length);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()} 
                className="h-10 w-10 text-gray-400 hover:text-white hover:bg-neutral-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">My Skills</h1>
                <p className="text-gray-400 text-lg">Track and manage your professional expertise</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push("/skills/new")}
              className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Skill
            </Button>
          </div>

          {/* Enhanced Stats Cards */}
          {!loading && skills.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Total Skills</p>
                      <p className="text-3xl font-bold text-white">{skills.length}</p>
                      <p className="text-xs text-gray-500 mt-1">Active skills</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <BookOpen className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Categories</p>
                      <p className="text-3xl font-bold text-white">{categories.length - 1}</p>
                      <p className="text-xs text-gray-500 mt-1">Skill domains</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Avg Level</p>
                      <p className="text-3xl font-bold text-white">{calculateAverageLevel()}</p>
                      <p className="text-xs text-gray-500 mt-1">Out of 10</p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-full">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Expert Level</p>
                      <p className="text-3xl font-bold text-white">
                        {skills.filter(skill => getLevelAsNumber(skill.level) >= 9).length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Advanced skills</p>
                    </div>
                    <div className="p-3 bg-orange-500/20 rounded-full">
                      <Award className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Enhanced Category Filter */}
        {!loading && skills.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === category
                      ? "bg-white text-black shadow-lg border-2 border-white"
                      : "bg-neutral-800 text-gray-300 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  <span className="capitalize">
                    {category === "all" ? "All Skills" : category}
                  </span>
                  {category !== "all" && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedCategory === category 
                        ? "bg-black/20 text-black" 
                        : "bg-neutral-700 text-gray-400 group-hover:bg-neutral-600"
                    }`}>
                      {skills.filter(skill => skill.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-white mx-auto mb-6" />
                <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-white/20 mx-auto"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading Skills</h3>
              <p className="text-gray-400">Fetching your skill portfolio...</p>
            </div>
          </div>
        ) : skills.length === 0 ? (
          /* Enhanced Empty State */
          <Card className="bg-neutral-900 border-neutral-800 shadow-2xl">
            <CardContent className="text-center py-20">
              <div className="mx-auto w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-8 relative">
                <BookOpen className="h-12 w-12 text-gray-500" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-white mb-4">Start Your Skills Journey</CardTitle>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                Build your professional skill portfolio and track your progress. 
                Showcase your expertise and identify areas for growth.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push("/skills/new")}
                  className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Skill
                </Button>
                <p className="text-sm text-gray-500">
                  Get started in less than 2 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Enhanced Skills Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSkills.map((skill) => {
              const currentLevel = getLevelAsNumber(skill.level);
              const progress = (currentLevel / 10) * 100;
              
              return (
                <Card
                  key={skill._id}
                  className="group bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:bg-neutral-800/80 hover:border-neutral-700 overflow-hidden"
                  onClick={() => router.push(`/skills/${skill._id}`)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                        {skill.title}
                      </CardTitle>
                      <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Category Badge */}
                    <Badge 
                      variant="outline" 
                      className="bg-neutral-800 text-gray-300 border-neutral-700 hover:bg-neutral-700 font-medium capitalize"
                    >
                      {skill.category}
                    </Badge>
                    
                    {/* Level Information */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-400">Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getLevelColor(skill.level)} border font-semibold`}>
                            {skill.level}/10
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Progress</span>
                          <span className="text-xs font-medium text-white">{Math.round(progress)}%</span>
                        </div>
                        <Progress 
                          value={progress} 
                          className="h-2 bg-neutral-700"
                        />
                      </div>

                      {/* Level Label */}
                      <div className="flex items-center justify-between pt-2">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                          getLevelColor(skill.level)
                        }`}>
                          {getLevelLabel(skill.level)}
                        </span>
                        <div className="flex items-center text-gray-500 group-hover:text-gray-400 transition-colors">
                          <span className="text-xs">View Details</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Enhanced No filtered results */}
        {!loading && skills.length > 0 && filteredSkills.length === 0 && (
          <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <Filter className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Skills Found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                No skills match the selected category <strong>&quot;{selectedCategory}&quot;</strong>. 
                Try selecting a different category or view all skills.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setSelectedCategory("all")}
                  className="bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded-lg font-medium"
                >
                  Show All Skills
                </Button>
                <p className="text-sm text-gray-500">
                  or create a new skill in this category
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}