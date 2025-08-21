'use client'

import React, { useEffect, useState } from 'react'
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Award,
  Activity,
  Settings,
  Bell,
  ChevronRight,
  PlayCircle,
  Pause,
  CheckCircle,
  FileText,
  Zap,
  Trophy,
  BarChart3,
  PlusCircle,
  BookMarked,
  Brain,
  Flame,
  Star,
  TrendingDown,
  Sparkles,
  GanttChartSquare,
  Lightbulb,
  Search,
  BrainCircuit,
  BarChart2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Progress } from '@/app/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Input } from '@/app/components/ui/input'
import { Skeleton } from '@/app/components/ui/skeleton'
import axios from 'axios'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import NotificationDrawer from './notifications'
import SettingsDrawer from './settings'

const Dashboard = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const [settingsOpen,setSettingsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`/api/dashboard`, { withCredentials: true })
        setData(res.data.data)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4 text-green-400" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'updated':
        return <PlayCircle className="h-4 w-4 text-blue-400" />
      case 'note':
        return <FileText className="h-4 w-4 text-purple-400" />
      case 'milestone':
        return <Trophy className="h-4 w-4 text-yellow-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getLevelColor = (level: number) => {
    if (level <= 3) return "text-red-400 bg-red-500/20 border-red-500/30"
    if (level <= 6) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
    if (level <= 8) return "text-blue-400 bg-blue-500/20 border-blue-500/30"
    return "text-green-400 bg-green-500/20 border-green-500/30"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl bg-neutral-800" />
              <div>
                <Skeleton className="h-7 w-48 mb-2 bg-neutral-800" />
                <Skeleton className="h-4 w-36 bg-neutral-800" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md bg-neutral-800" />
              <Skeleton className="h-10 w-10 rounded-md bg-neutral-800" />
              <Skeleton className="h-10 w-32 rounded-md bg-neutral-800" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-neutral-900 border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24 bg-neutral-800" />
                  <Skeleton className="h-5 w-5 rounded-full bg-neutral-800" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-16 mb-2 bg-neutral-800" />
                  <Skeleton className="h-2 w-full bg-neutral-800" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-full bg-neutral-800" />
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-24 w-full bg-neutral-800 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-64 w-full bg-neutral-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return (
    <div className="min-h-screen bg-black p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
          <Brain className="h-10 w-10 text-gray-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Failed to load dashboard</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          There was an issue loading your dashboard data. Please try again.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-white text-black hover:bg-gray-100"
        >
          Retry
        </Button>
      </div>
    </div>
  )

  const { user, stats, skillPlans, recentActivity, latestAchievement, recommendedSkills } = data

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-2xl border-2 border-neutral-700">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-neutral-800 text-white text-xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user.name}!</h1>
              <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                <Flame className="h-4 w-4 text-orange-400" />
                {user.streak} day streak • Since {new Date(user.joinDate).getFullYear()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px] bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNotificationsOpen(true)}
              className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 cursor-pointer"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setSettingsOpen(true)} 
              variant="outline"
              size="icon"
              className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700 cursor-pointer"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              className="gap-2 bg-white text-black hover:bg-gray-100"
              onClick={() => router.push("/skills/new")}
            >
              <PlusCircle className="h-4 w-4" /> New Skill
            </Button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Weekly Goal</CardTitle>
              <Target className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.weeklyGoal.current}/{stats.weeklyGoal.target}
              </div>
              <div className="flex items-center justify-between mt-2">
                <Progress 
                  value={(stats.weeklyGoal.current / stats.weeklyGoal.target) * 100} 
                  className="h-2 flex-1 mr-2 bg-neutral-700" 
                />
                <span className="text-xs text-gray-400">
                  {Math.round((stats.weeklyGoal.current / stats.weeklyGoal.target) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Skills</CardTitle>
              <BookOpen className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {user.completedSkills}/{user.totalSkills}
              </div>
              <div className="flex items-center justify-between mt-2">
                <Progress 
                  value={(user.completedSkills / user.totalSkills) * 100} 
                  className="h-2 flex-1 mr-2 bg-neutral-700" 
                />
                <span className="text-xs text-gray-400">
                  {Math.round((user.completedSkills / user.totalSkills) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Study Time</CardTitle>
              <Clock className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.averageDaily.time}h</div>
              <p className="text-xs text-gray-400 mt-1">Daily avg • {stats.totalHours} total</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-neutral-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Accuracy</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.accuracy.score}%</div>
              <div className="flex items-center mt-1">
                {stats.accuracy.trend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                )}
                <span className={`text-xs ${stats.accuracy.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.accuracy.trend > 0 ? '+' : ''}{stats.accuracy.trend}% from last week
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-neutral-800 border border-neutral-700 p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Skill Plans */}
              <Card className="lg:col-span-2 bg-neutral-900 border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5 text-blue-400" /> Your Skill Plans
                  </CardTitle>
                  <Button 
                    variant="link" 
                    className="text-gray-400 hover:text-white p-0"
                    onClick={() => router.push("/skillPlans")}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillPlans.slice(0, 3).map((plan: any) => (
                    <div 
                      key={plan.id} 
                      className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/30 hover:bg-neutral-800/50 transition cursor-pointer group"
                      onClick={() => router.push(`/skillPlans/${plan.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-neutral-700 text-gray-300 border-neutral-600">
                          {plan.category}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(plan.status)}
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-1">{plan.title}</h3>
                      <p className="text-xs text-gray-400 mb-2">
                        Day {plan.currentDay} of {plan.totalDays} • {Math.round(plan.progress)}% complete
                      </p>
                      <Progress value={plan.progress} className="h-2 bg-neutral-700" />
                    </div>
                  ))}
                  {skillPlans.length === 0 && (
                    <div className="text-center py-8">
                      <BrainCircuit className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No skill plans yet</h3>
                      <p className="text-gray-400 mb-4">Create your first skill plan to start tracking your progress</p>
                      <Button 
                        onClick={() => router.push("/skillPlans/create")}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Create Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Activity className="h-5 w-5 text-green-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity: any, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{activity.skill}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.time).toLocaleDateString()} • {activity.details}
                          </p>
                        </div>
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="secondary" 
                      className="w-full justify-start gap-2 bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700"
                      onClick={() => router.push("/skillPlans")}
                    >
                      <BookMarked className="h-4 w-4 text-blue-400" /> Continue Learning
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full justify-start gap-2 bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700"
                      onClick={() => router.push("/skills")}
                    >
                      <BarChart3 className="h-4 w-4 text-green-400" /> View Analytics
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full justify-start gap-2 bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700"
                      onClick={() => router.push("/achiements")}
                    >
                      <Award className="h-4 w-4 text-purple-400" /> Achievements
                    </Button>
                  </CardContent>
                </Card>

                {/* Achievement Spotlight */}
                <Card className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 border border-neutral-700 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Star className="h-5 w-5 text-amber-400" />
                      Achievement Spotlight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {latestAchievement ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Trophy className="h-6 w-6 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {latestAchievement.title}
                            </p>
                            <p className="text-xs text-gray-400">{latestAchievement.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          className="w-full mt-2 text-white bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30"
                          onClick={() => router.push("/achievements")}
                        >
                          View All Achievements
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Trophy className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No achievements yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recommended Skills */}
            {recommendedSkills && recommendedSkills.length > 0 && (
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    Recommended Skills
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Based on your current skills and interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedSkills.slice(0, 3).map((skill: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/30 hover:bg-neutral-800/50 transition cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={getLevelColor(skill.level)}>
                            Level {skill.level}
                          </Badge>
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                        </div>
                        <h3 className="font-semibold text-white mb-2">{skill.title}</h3>
                        <p className="text-xs text-gray-400 mb-3">{skill.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-neutral-700 text-white border-neutral-600 hover:bg-neutral-600"
                          onClick={() => router.push(`/skills/${skill.id}`)}
                        >
                          Explore Skill
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Learning Progress</CardTitle>
                <CardDescription className="text-gray-400">
                  Track your progress over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Progress Analytics</h3>
                    <p className="text-gray-400 mb-4">Visualize your learning progress over time</p>
                    <Button 
                      onClick={() => router.push("/analytics")}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Your Skills</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage and track all your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search skills..."
                      className="pl-10 bg-neutral-800 border-neutral-700 text-white"
                    />
                  </div>
                  <Button 
                    className="gap-2 bg-white text-black hover:bg-gray-100"
                    onClick={() => router.push("/skills/new")}
                  >
                    <PlusCircle className="h-4 w-4" /> Add Skill
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.slice(0, 6).map((skill: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-800/30 hover:bg-neutral-800/50 transition cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="bg-neutral-700 text-gray-300 border-neutral-600">
                            {skill.category}
                          </Badge>
                          <Badge className={getLevelColor(skill.level)}>
                            Level {skill.level}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-white mb-2">{skill.title}</h3>
                        <Progress value={(skill.level / 10) * 100} className="h-2 bg-neutral-700 mb-3" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Progress: {skill.level * 10}%</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-400 hover:text-blue-300 p-0 h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/skills/${skill.id}`);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">No skills yet</h3>
                      <p className="text-gray-400 mb-6">Add your first skill to start tracking your progress</p>
                      <Button 
                        onClick={() => router.push("/skills/new")}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Skill
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Learning Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed insights into your learning patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <GanttChartSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Advanced Analytics</h3>
                    <p className="text-gray-400 mb-4">View detailed analytics about your learning progress</p>
                    <Button 
                      onClick={() => router.push("/skillPlans")}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      View Full Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <NotificationDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />
        <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </div>
  )
}

export default Dashboard