'use client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar"
import { Flame, Star, Trophy, Mail, Calendar, Target, Award, BookOpen, Edit3, Lock, Camera, Zap, TrendingUp, Lightbulb } from "lucide-react"
import { Progress } from "@/app/components/ui/progress"
import { Badge } from "@/app/components/ui/badge"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useEffect, useState } from "react"
// Type definitions
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
/*
interface User {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  profilePic?: string;
  bio?: string;
  streak: number;
  completedSkills: string[];
  totalSkills?: number;
  level: number;
  interests: string[];
  skillLevel: SkillLevel;
  lastCompletedDate?: Date | string | null;
  longestStreak: number;
  createdAt: Date | string;
  achievements: string[];
  notificationPreferences?: {
    email: {
      dailyReminder: boolean;
      weeklyProgress: boolean;
    };
    push: {
      streakReminder: boolean;
    };
  };
}

*/

const ProfilePage = () => {
  const { data: user, isLoading, isError } = useUser()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user?.interests && Array.isArray(user.interests) && user.interests.length > 0) {
      const userInterests = user.interests.filter((interest: any): interest is string => 
        typeof interest === 'string'
      );
      
    const skillsByInterest: Record<string, string[]> = {
      frontend: ["React", "Vue", "Angular", "TypeScript", "Next.js", "Tailwind CSS", "CSS", "HTML", "SASS"],
      backend: ["Node.js", "Express", "Django", "Spring Boot", "Ruby on Rails", "PHP", "Go", "NestJS"],
      "ai-ml": ["TensorFlow", "PyTorch", "Scikit-learn", "Computer Vision", "NLP", "Data Analysis", "Keras", "OpenCV"],
      devOps: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Jenkins", "Ansible", "GitLab CI"],
      cybersecurity: ["Ethical Hacking", "Network Security", "Cryptography", "Penetration Testing", "Security Auditing", "SIEM Tools"],
      web3: ["Blockchain", "Smart Contracts", "Solidity", "Web3.js", "Ethereum", "IPFS", "NFTs", "DeFi Protocols"],
      database: ["SQL", "MongoDB", "PostgreSQL", "Redis", "Database Design", "NoSQL", "ORMs", "Indexing & Optimization"],
      "system-design": ["Microservices", "API Design", "Scalability", "Load Balancing", "Caching Strategies", "Distributed Systems"],
      algorithm: ["Data Structures", "Problem Solving", "Big O Notation", "Graph Algorithms", "Dynamic Programming", "Recursion"],
      marketing: ["SEO", "Digital Marketing", "Content Marketing", "Social Media Strategy", "Email Marketing", "Google Ads", "Analytics"],
      languages: ["JavaScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby", "Kotlin", "Swift"],
      management: ["Project Management", "Agile Methodology", "Scrum", "Kanban", "Product Management", "Team Leadership"],
      business: ["Entrepreneurship", "Business Analysis", "Finance Basics", "Startups", "Strategy Planning", "Market Research"],
      design: ["UI/UX Design", "Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Illustration", "Typography"],
      other: ["Public Speaking", "Time Management", "Writing Skills", "Critical Thinking", "Problem Solving"]
    };
      
      const simulatedRecommendations = userInterests.flatMap((interest: string) => 
        skillsByInterest[interest] ?? []
      ) as string[];
      
      setRecommendedSkills([...new Set(simulatedRecommendations)].slice(0, 8));
    } else {
      setRecommendedSkills([]);
    }
  }, [user?.interests])

  if (!mounted || isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
  
  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-destructive text-lg">Failed to load profile</div>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  )

  // Type guard to ensure user exists
  if (!user) return null

  // Calculate progress percentage safely
  const totalSkills = user.totalSkills || 0
  const completedSkillsCount = user.completedSkills?.length || 0
  const progressPercentage = totalSkills > 0 ? (completedSkillsCount / totalSkills) * 100 : 0

  // Format join date
  const joinDate = user.createdAt ? new Date(user.createdAt as string).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : "recently"

  // Skill level with colors
  const skillLevelColors: Record<SkillLevel, string> = {
    beginner: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    intermediate: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    expert: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
  } as const;

  // Get the appropriate class
  const skillLevelClass = skillLevelColors[user.skillLevel as SkillLevel] || skillLevelColors.beginner;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Profile Header Card */}
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center text-center pb-4">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24 rounded-xl border-4 border-background shadow-lg">
                <AvatarImage src={user.profilePic || "/default-avatar.png"} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user?.fullname?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={() => router.push("/profile/edit")}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-2xl">{user.fullname}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> 
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">@{user.username}</Badge>
              <Badge className={skillLevelClass}>
                {user.skillLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center pb-4">
            <p className="text-muted-foreground italic">
              {user.bio || "No bio added yet. Click edit to add one!"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-3 border-t pt-4">
            <Button onClick={() => router.push("/profile/edit")} className="gap-2">
              <Edit3 className="h-4 w-4" /> Edit Profile
            </Button>
            <Button onClick={() => router.push("/profile/change-password")} variant="outline" className="gap-2">
              <Lock className="h-4 w-4" /> Password
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Level Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" /> Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Level {user.level}</span>
                  <span className="text-xs text-muted-foreground">
                    {completedSkillsCount}/{totalSkills} skills
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{completedSkillsCount}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalSkills - completedSkillsCount}</div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalSkills}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Flame className="h-5 w-5 text-orange-500" /> Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 w-full">
                    <div className="text-4xl font-bold text-orange-500">{user.streak || 0}</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Current Streak</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-semibold">{user.longestStreak || 0}</div>
                      <div className="text-xs text-muted-foreground">Longest</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-semibold">{joinDate}</div>
                      <div className="text-xs text-muted-foreground">Joined</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" /> Interests
                </CardTitle>
                <CardDescription>Your learning focus areas</CardDescription>
              </CardHeader>
              <CardContent>
                {user.interests?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest: string, i: number) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No interests selected yet</p>
                    <Button variant="link" onClick={() => router.push("/profile/edit")}>
                      Add interests
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" /> Recent Activity
                </CardTitle>
                <CardDescription>Your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                {user.lastCompletedDate ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Last skill completed</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(user.lastCompletedDate as string).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No activity recorded yet</p>
                    <Button onClick={() => router.push("/skills")}>
                      Start learning
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" /> Achievements
                </CardTitle>
                <CardDescription>Your earned badges</CardDescription>
              </CardHeader>
              <CardContent>
                {user.achievements?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {user.achievements.map((ach: string, i: number) => (
                      <div key={i} className="flex flex-col items-center p-3 bg-muted rounded-lg text-center">
                        <Star className="h-6 w-6 text-amber-400 mb-1" />
                        <span className="text-sm font-medium">{ach}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No achievements yet</p>
                    <p className="text-sm">Complete skills to earn achievements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Your Skills Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              {user.completedSkills?.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Skills progress will be displayed here</p>
                  {/* You would map through user's skills here */}
                </div>
              ) : (
                <div className="text-center py-10">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No skills started yet</h3>
                  <p className="text-muted-foreground mb-4">Begin your learning journey to track progress</p>
                  <Button onClick={() => router.push("/skills")}>
                    Browse Skills
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" /> Recommended Skills
                </CardTitle>
                <CardDescription>
                  Based on your interests: {user.interests?.join(", ") || "None selected"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedSkills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {recommendedSkills.map((skill: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recommendations available</p>
                    <p className="text-sm mb-4">Add interests to your profile to get personalized skill recommendations</p>
                    <Button onClick={() => router.push("/profile/edit")}>
                      Add Interests
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Why These Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Why These Recommendations?</CardTitle>
                <CardDescription>How we personalize your learning path</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Based on Your Interests</h4>
                    <p className="text-sm text-muted-foreground">
                      We recommend skills that align with the domains you&apos;re interested in.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Skill Progression</h4>
                    <p className="text-sm text-muted-foreground">
                      Recommendations consider your current skill level for optimal learning.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Industry Relevance</h4>
                    <p className="text-sm text-muted-foreground">
                      We prioritize skills that are in high demand in the current job market.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => router.push("/skills")}>
                  Explore All Skills
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage