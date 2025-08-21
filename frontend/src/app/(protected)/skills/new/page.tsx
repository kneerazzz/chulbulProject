"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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
  Plus, 
  Target,
  BookOpen,
  Lightbulb,
  Zap,
  Star,
  Monitor, 
  Server, 
  Brain, 
  Database, 
  Cloud, 
  Lock, 
  Boxes, 
  Globe, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Palette, 
  Users, 
  Sigma 
} from "lucide-react";
import axios from "axios";

const NewSkillPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "1",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Predefined categories with icons and descriptions

  const skillCategories = [
    { 
      value: "frontend", 
      label: "Frontend", 
      icon: Monitor, 
      description: "UI development, React, Next.js, styling frameworks", 
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    { 
      value: "backend", 
      label: "Backend", 
      icon: Server, 
      description: "APIs, server-side logic, authentication, scalability", 
      color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    },
    { 
      value: "ai-ml", 
      label: "AI & ML", 
      icon: Brain, 
      description: "Machine learning, AI models, data science", 
      color: "bg-pink-500/20 text-pink-400 border-pink-500/30"
    },
    { 
      value: "database", 
      label: "Database", 
      icon: Database, 
      description: "SQL, NoSQL, optimization, data management", 
      color: "bg-teal-500/20 text-teal-400 border-teal-500/30"
    },
    { 
      value: "devops", 
      label: "DevOps", 
      icon: Cloud, 
      description: "CI/CD, cloud platforms, automation, infrastructure", 
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    },
    { 
      value: "web3", 
      label: "Web3", 
      icon: Boxes, 
      description: "Blockchain, smart contracts, decentralized apps", 
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    { 
      value: "cybersecurity", 
      label: "Cybersecurity", 
      icon: Lock, 
      description: "Network security, ethical hacking, compliance", 
      color: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    { 
      value: "system-design", 
      label: "System Design", 
      icon: Boxes, 
      description: "Architecture, scalability, distributed systems", 
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    },
    { 
      value: "languages", 
      label: "Languages", 
      icon: Globe, 
      description: "Foreign languages, communication skills", 
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    },
    { 
      value: "business",   // fixed typo (not "buisness")
      label: "Business", 
      icon: Briefcase, 
      description: "Strategy, finance, operations, consulting", 
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    },
    { 
      value: "marketing", 
      label: "Marketing", 
      icon: TrendingUp, 
      description: "Digital marketing, SEO, content strategy", 
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    { 
      value: "design", 
      label: "Design", 
      icon: Palette, 
      description: "UI/UX, graphic design, creative tools", 
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    { 
      value: "management", 
      label: "Management", 
      icon: Users, 
      description: "Leadership, project management, team building", 
      color: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
    },
    { 
      value: "algorithm", 
      label: "Algorithms", 
      icon: Sigma, 
      description: "Problem-solving, data structures, optimization", 
      color: "bg-lime-500/20 text-lime-400 border-lime-500/30"
    },
    { 
      value: "other", 
      label: "Other", 
      icon: Award, 
      description: "Specialized skills and expertise", 
      color: "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
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
      const response = await axios.post("/api/skills/create-skill", formData, {
        withCredentials: true
      });
      const { _id } = response.data.data;
      
      toast.success("Skill created successfully!");
      router.push(`/skills/${_id}`);
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
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Create New Skill</h1>
            <p className="text-gray-400 text-lg">Add a new skill to your portfolio and track your progress</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-900 border-neutral-800 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-2xl">
                  <Plus className="h-6 w-6 text-gray-400" />
                  Skill Details
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Provide information about your skill and current proficiency level
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
                    <p className="text-sm text-gray-500">
                      Choose a specific, descriptive name for your skill
                    </p>
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
                    {selectedCategory && (
                      <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                        <p className="text-sm text-gray-400">
                          {skillCategories.find(cat => cat.value === selectedCategory)?.description}
                        </p>
                      </div>
                    )}
                    
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
                    {formData.level && (
                      <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getLevelColor(formData.level)} border font-medium`}>
                            {formData.level}/10
                          </Badge>
                          <span className="text-white font-medium">{getLevelLabel(formData.level)}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {levelDescriptions[formData.level as keyof typeof levelDescriptions]}
                        </p>
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
                      placeholder="Describe your experience with this skill, specific technologies you've worked with, projects you've completed, or goals you have..."
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-gray-500 focus:border-neutral-600 min-h-[120px] resize-none"
                      rows={5}
                    />
                    <p className="text-sm text-gray-500">
                      Help others understand your background and expertise in this skill
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-neutral-800">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/skills")}
                      className="px-6 py-2.5 bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="px-8 py-2.5 bg-white text-black hover:bg-gray-100 font-medium"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isLoading ? "Creating..." : "Create Skill"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            {(formData.title || selectedCategory || formData.level !== "1") && (
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="h-5 w-5 text-gray-400" />
                    Skill Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.title && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Title</p>
                      <p className="text-white font-medium">{formData.title}</p>
                    </div>
                  )}
                  
                  {selectedCategory && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Category</p>
                      <Badge className="bg-neutral-800 text-gray-300 border-neutral-700">
                        {skillCategories.find(cat => cat.value === selectedCategory)?.label || formData.category}
                      </Badge>
                    </div>
                  )}
                  
                  {formData.level !== "1" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Level</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getLevelColor(formData.level)} border font-medium`}>
                          {formData.level}/10
                        </Badge>
                        <span className="text-sm text-gray-300">{getLevelLabel(formData.level)}</span>
                      </div>
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
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific with skill names (e.g., &quot;React Development&quot; vs &quot;Programming&quot;)</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Choose categories that best represent your skill domain</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be honest about your current level - you can always update it later</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Add descriptions to provide context about your experience</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSkillPage;