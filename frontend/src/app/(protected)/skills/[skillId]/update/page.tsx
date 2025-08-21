"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import React from "react";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { 
  Loader2, 
  ChevronLeft, 
  Edit3,
  Target,
  BookOpen,
  Lightbulb,
  Save,
  RotateCcw,
  AlertTriangle,
  Code,
  Palette,
  Shield,
  TrendingUp,
  Users,
  Globe,
  Briefcase,
  Award,
  Star,
  History,
  ArrowRight
} from "lucide-react";
import axios from "axios";

const UpdateSkillPage = () => {
  const router = useRouter();
  const params = useParams();
  const skillId = params?.skillId as string;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "1",
    description: "",
  });
  const [originalData, setOriginalData] = useState({
    title: "",
    category: "",
    level: "1",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Predefined categories with icons
  const skillCategories = [
    { 
      value: "programming", 
      label: "Programming", 
      icon: Code, 
      description: "Software development, coding languages, frameworks",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    { 
      value: "design", 
      label: "Design", 
      icon: Palette, 
      description: "UI/UX, graphic design, creative tools",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    { 
      value: "cybersecurity", 
      label: "Cybersecurity", 
      icon: Shield, 
      description: "Network security, ethical hacking, compliance",
      color: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    { 
      value: "marketing", 
      label: "Marketing", 
      icon: TrendingUp, 
      description: "Digital marketing, SEO, content strategy",
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    { 
      value: "management", 
      label: "Management", 
      icon: Users, 
      description: "Leadership, project management, team building",
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    },
    { 
      value: "languages", 
      label: "Languages", 
      icon: Globe, 
      description: "Foreign languages, communication skills",
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    },
    { 
      value: "business", 
      label: "Business", 
      icon: Briefcase, 
      description: "Strategy, finance, operations, consulting",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    },
    { 
      value: "other", 
      label: "Other", 
      icon: Award, 
      description: "Specialized skills and expertise",
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    },
  ];

  // Level descriptions
  const levelDescriptions = {
    "1": "Just getting started, learning the basics",
    "2": "Basic understanding, can perform simple tasks",
    "3": "Comfortable with fundamentals",
    "4": "Intermediate level, good working knowledge",
    "5": "Solid intermediate skills",
    "6": "Advanced intermediate, can handle complex tasks",
    "7": "Advanced level, strong expertise",
    "8": "Very advanced, can mentor others",
    "9": "Expert level, industry recognition",
    "10": "Master level, thought leader in the field"
  };

  // Fetch skill details
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await axios.get(`/api/skills/get-skill?skillId=${skillId}`, {
          withCredentials: true,
        });

        const { title, category, level = "1", description = "" } = response.data.data;
        const skillData = { title, category, level: level.toString(), description };
        
        setFormData(skillData);
        setOriginalData(skillData);
        setSelectedCategory(category);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load skill");
        router.push("/skills");
      } finally {
        setIsFetching(false);
      }
    };

    if (skillId) fetchSkill();
  }, [skillId, router]);

  // Check for changes
  useEffect(() => {
    const dataChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(dataChanged);
  }, [formData, originalData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
  };

  const handleLevelSelect = (level: string) => {
    setFormData((prev) => ({
      ...prev,
      level: level,
    }));
  };

  const handleReset = () => {
    setFormData(originalData);
    setSelectedCategory(originalData.category);
    setHasChanges(false);
    toast.info("Changes reset to original values");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a skill title");
      return;
    }
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

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

  const getLevelColor = (level: string) => {
    const numLevel = parseInt(level);
    if (numLevel <= 3) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (numLevel <= 6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (numLevel <= 8) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  const getLevelLabel = (level: string) => {
    const numLevel = parseInt(level);
    if (numLevel <= 3) return "Beginner";
    if (numLevel <= 6) return "Intermediate";
    if (numLevel <= 8) return "Advanced";
    return "Expert";
  };

  const getCategoryInfo = (category: string) => {
    return skillCategories.find(cat => cat.value === category) || {
      label: category,
      icon: Award,
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };
  };

  if (isFetching) {
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
      <div className="container mx-auto py-8 px-4 max-w-6xl">
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
            <h1 className="text-4xl font-bold text-white mb-2">Update Skill</h1>
            <p className="text-gray-400 text-lg">Modify your skill details and track your progress</p>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-orange-400 font-medium">Unsaved changes</span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Values Display */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <History className="h-5 w-5 text-gray-400" />
                  Current Values
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your skill&apos;s current information before any updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-400">Title</Label>
                    <div className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                      <p className="text-white font-medium">{originalData.title}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-400">Category</Label>
                    <div className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                      <div className="flex items-center gap-2">
                        {React.createElement(getCategoryInfo(originalData.category).icon, { 
                          className: "h-4 w-4 text-gray-400" 
                        })}
                        <span className="text-white font-medium capitalize">
                          {getCategoryInfo(originalData.category).label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-400">Level</Label>
                    <div className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getLevelColor(originalData.level)} border font-medium`}>
                          {originalData.level}/10
                        </Badge>
                        <span className="text-white font-medium">{getLevelLabel(originalData.level)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-400">Description</Label>
                    <div className="p-3 bg-neutral-800 rounded-lg border border-neutral-700 max-h-20 overflow-y-auto">
                      <p className="text-white text-sm">
                        {originalData.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Form */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-2xl">
                  <Edit3 className="h-6 w-6 text-gray-400" />
                  Update Details
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Make changes to your skill information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Skill Title */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-white font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      Skill Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g., React Development, Digital Marketing, Python Programming"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus:border-neutral-600 h-12 text-lg"
                    />
                    {formData.title !== originalData.title && (
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">Changed from: &quot;{originalData.title}&quot;</span>
                      </div>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-4">
                    <Label className="text-white font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      Category *
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {skillCategories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleCategorySelect(cat.value)}
                            className={`p-4 rounded-lg border transition-all duration-200 text-left hover:scale-105 ${
                              selectedCategory === cat.value
                                ? `${cat.color} border-current shadow-lg`
                                : "bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:border-neutral-600"
                            }`}
                          >
                            <IconComponent className="h-6 w-6 mb-2" />
                            <p className="font-medium text-sm">{cat.label}</p>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Custom Category Input */}
                    {selectedCategory === "other" && (
                      <Input
                        name="category"
                        value={formData.category === "other" ? "" : formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Enter custom category"
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus:border-neutral-600"
                      />
                    )}

                    {formData.category !== originalData.category && (
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">
                          Changed from: &quot;{getCategoryInfo(originalData.category).label}&quot;
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Current Level */}
                  <div className="space-y-4">
                    <Label className="text-white font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      Current Proficiency Level
                    </Label>
                    <Select value={formData.level} onValueChange={handleLevelSelect}>
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white h-12">
                        <SelectValue placeholder="Select your current level" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        {Object.entries(levelDescriptions).map(([level, desc]) => (
                          <SelectItem key={level} value={level} className="text-white hover:bg-neutral-700">
                            <div className="flex items-center gap-3">
                              <Badge className={`${getLevelColor(level)} border font-medium`}>
                                {level}/10
                              </Badge>
                              <div>
                                <span className="font-medium">{getLevelLabel(level)}</span>
                                <p className="text-sm text-gray-400">{desc}</p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {formData.level !== originalData.level && (
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">
                          Changed from: Level {originalData.level} ({getLevelLabel(originalData.level)})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-white font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-gray-400" />
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your experience with this skill..."
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus:border-neutral-600 min-h-[120px] resize-none"
                      rows={5}
                    />
                    {formData.description !== originalData.description && (
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">Description updated</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-between pt-6 border-t border-neutral-800">
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/skills/${skillId}`)}
                        className="px-6 py-2.5 bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white"
                      >
                        Cancel
                      </Button>
                      {hasChanges && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleReset}
                          className="px-6 py-2.5 bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isLoading || !hasChanges}
                      className="px-8 py-2.5 bg-white text-black hover:bg-gray-100 font-medium disabled:bg-gray-600 disabled:text-gray-400"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Changes Summary */}
            {hasChanges && (
              <Card className="bg-neutral-900 border-orange-500/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    Changes Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.title !== originalData.title && (
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <p className="text-sm font-medium text-orange-400 mb-1">Title</p>
                      <p className="text-xs text-gray-400 line-through">{originalData.title}</p>
                      <p className="text-xs text-white">{formData.title}</p>
                    </div>
                  )}
                  
                  {formData.category !== originalData.category && (
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <p className="text-sm font-medium text-orange-400 mb-1">Category</p>
                      <p className="text-xs text-gray-400 line-through">
                        {getCategoryInfo(originalData.category).label}
                      </p>
                      <p className="text-xs text-white">
                        {getCategoryInfo(formData.category).label}
                      </p>
                    </div>
                  )}
                  
                  {formData.level !== originalData.level && (
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <p className="text-sm font-medium text-orange-400 mb-1">Level</p>
                      <p className="text-xs text-gray-400 line-through">
                        {originalData.level}/10 ({getLevelLabel(originalData.level)})
                      </p>
                      <p className="text-xs text-white">
                        {formData.level}/10 ({getLevelLabel(formData.level)})
                      </p>
                    </div>
                  )}

                  {formData.description !== originalData.description && (
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <p className="text-sm font-medium text-orange-400 mb-1">Description</p>
                      <p className="text-xs text-white">Updated</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  Update Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Update your level as you gain more experience</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Add detailed descriptions to showcase your expertise</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Choose categories that best represent your skill domain</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>All changes are tracked and can be reset before saving</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSkillPage;