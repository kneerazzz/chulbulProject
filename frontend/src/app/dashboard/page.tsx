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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import axios from 'axios'
import SettingsDrawer from './settings'
import NotificationDrawer from './notifications'
import { useRouter } from "next/navigation"


const Dashboard = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`/api/dashboard`, {
            withCredentials: true
        })
        const data = res.data.data
        console.log(data)
        setData(data)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>
  }

  if (!data) {
    return <div className="p-6 text-center">Failed to load dashboard</div>
  }

  const { user, stats, skillPlans, recentActivity, latestAchievement } = data

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'paused':
        return <Pause className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'updated':
        return <PlayCircle className="h-4 w-4 text-blue-500" />
      case 'note':
        return <FileText className="h-4 w-4 text-purple-500" />
      case 'milestone':
        return <Trophy className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-2xl">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                {user.streak} day streak • Since {new Date(user.joinDate).getFullYear()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className='cursor-pointer' size="icon">
              <Bell className="h-5 w-5" onClick={() => setNotificationsOpen(true)} />
            </Button>
            <Button variant="outline" size="icon" className='cursor-pointer' onClick={() => setSettingsOpen(true)}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button className="gap-2 cursor-pointer" onClick={() => router.push("/skills/create-skill") }>
              <PlusCircle className="h-4 w-4" /> New Skill
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
              <Target className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.weeklyGoal.current}/{stats.weeklyGoal.target}
              </div>
              <Progress
                value={(stats.weeklyGoal.current / stats.weeklyGoal.target) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Skills</CardTitle>
              <BookOpen className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.completedSkills}/{user.totalSkills}
              </div>
              <Progress
                value={(user.completedSkills / user.totalSkills) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageDaily.time}h</div>
              <p className="text-xs text-muted-foreground">
                Daily avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accuracy.score}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Plans */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" /> Your Skill Plans
              </CardTitle>
              <Button variant="link">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillPlans.map((plan: any) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {plan.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(plan.status)}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{plan.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Day {plan.currentDay} of {plan.totalDays}
                  </p>
                  <Progress value={plan.progress} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity: any, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium">{activity.skill}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <BookMarked className="h-4 w-4 text-blue-500" /> Continue
                  Learning
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4 text-green-500" /> View Analytics
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Award className="h-4 w-4 text-purple-500" /> Achievements
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Spotlight */}
            <Card className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-amber-400">
                  <Star className="h-5 w-5 text-amber-400 animate-pulse" />
                  Achievement Spotlight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <p className="text-base font-medium text-white">
                    🎉 {latestAchievement?.title}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {latestAchievement?.description}
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-fit mt-2 text-black bg-amber-400 hover:bg-amber-500 rounded-xl px-4"
                  >
                    View All Achievements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
        <NotificationDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      </div>
    </div>
  )
}

export default Dashboard
