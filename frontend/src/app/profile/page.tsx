'use client'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Flame, Star, Trophy, Mail } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/hooks/useUser"

const ProfilePage = () => {
  const { data: user, isLoading, isError } = useUser()

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load profile</p>

  return (
    <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 gap-6">
      {/* User Info */}
      <Card className="col-span-2">
        <CardHeader className="flex items-center gap-4">
          <Avatar className="w-20 h-20 rounded-xl">
            <AvatarImage src={user.avatar || "/default-avatar.png"} />
            <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            {user.bio || "No bio added yet..."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Edit Profile</Button>
        </CardFooter>
      </Card>

      {/* Level & Skill Progression */}
      <Card>
        <CardHeader>
          <CardTitle>Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">
            Level {user.level} • {user.skillLevel}
          </p>
          <Progress
            value={(user.completedSkills / user.totalSkills) * 100}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {user.completedSkills}/{user.totalSkills} skills completed
          </p>
          {user.currentXP !== undefined && user.nextLevelXP !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              {user.currentXP} / {user.nextLevelXP} XP to next level
            </p>
          )}
        </CardContent>
      </Card>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <CardTitle>🔥 Streaks</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="flex items-center gap-2">
            <Flame className="text-orange-500 h-5 w-5" /> Current Streak:{" "}
            {user.streak ?? 0} days
          </p>
          <p className="flex items-center gap-2">
            <Trophy className="text-yellow-500 h-5 w-5" /> Longest Streak:{" "}
            {user.longestStreak ?? 0} days
          </p>
          <p className="text-xs text-muted-foreground">
            Joined {user.joinDate ? new Date(user.joinDate).toDateString() : "recently"}
          </p>
        </CardContent>
      </Card>

      {/* Badges / Achievements */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {user.achievements?.length > 0 ? (
            user.achievements.map((ach: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm hover:scale-105 transition-all"
              >
                <Star className="text-amber-400 h-5 w-5" /> {ach}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No achievements yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
