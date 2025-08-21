// controllers/dashboard.controller.js
import { User } from "../models/user.model.js";
import { SkillPlan } from "../models/skillPlan.model.js";
import { DailyTopic } from "../models/dailyTopic.model.js";
import { Notes } from "../models/notes.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("completedSkills");
  if (!user) throw new ApiError(404, "User not found");

  // Fetch skill plans
  const skillPlans = await SkillPlan.find({ user: user._id })
    .populate("skill")
    .sort({ updatedAt: -1 });

  const skillPlansData = await Promise.all(
    skillPlans.map(async (plan) => {
      const todayTopic = await DailyTopic.findOne({
        skillPlan: plan._id,
        day: plan.currentDay,
      });

      const todayNote = await Notes.findOne({
        user: user._id,
        skillPlan: plan._id,
        day: plan.currentDay,
      });

      return {
        id: plan._id,
        title: plan.skill.title,
        progress: Math.floor(
          (plan.completedDays.length / plan.durationInDays) * 100
        ),
        totalDays: plan.durationInDays,
        currentDay: plan.currentDay,
        status: plan.isCompleted
          ? "completed"
          : plan.isPaused
          ? "paused"
          : "active",
        category: plan.skill.category,
        lastAccessed: plan.updatedAt,
        todayTopic: todayTopic?.topic || "Not generated",
        todayNote: todayNote?.content || null,
      };
    })
  );

  // Recent activity (based on updatedAt)
  const recentActivity = skillPlans.slice(0, 5).map((plan) => ({
    skill: plan.skill.title,
    time: plan.updatedAt,
    type: plan.isCompleted ? "completed" : "updated",
  }));

  // -----------------------------
  // 📊 Stats Calculation
  // -----------------------------
  // Notes-based accuracy (days user wrote notes / total active days)
  const totalDays = skillPlans.reduce(
    (acc, plan) => acc + plan.currentDay,
    0
  );
  const daysWithNotes = await Notes.countDocuments({ user: user._id });

  const accuracyScore =
    totalDays > 0 ? Math.round((daysWithNotes / totalDays) * 100) : 0;

  // Average daily time (past 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const lastWeekNotes = await Notes.countDocuments({
    user: user._id,
    createdAt: { $gte: sevenDaysAgo },
  });

  // Assume each note/topic ~ 1 hour study
  const avgDailyTime = (lastWeekNotes / 7).toFixed(1);

  const stats = {
    weeklyGoal: {
      current: user.streak,
      target: 7,
      unit: "days",
    },
    accuracy: {
      score: accuracyScore,
      unit: "%",
    },
    averageDaily: {
      time: avgDailyTime,
      unit: "hours",
    },
  };

  const response = {
    user: {
      name: user.fullname,
      email: user.email,
      avatar: user.profilePic,
      bio: user.bio,
      streak: user.streak,
      longestStreak: user.longestStreak,
      totalSkills: user.interests.length,
      completedSkills: user.completedSkills.length,
      level: user.level,
      skillLevel: user.skillLevel,
      joinDate: user.createdAt,
    },
    stats,
    skillPlans: skillPlansData,
    recentActivity,
    latestAchievement: {
      title: user.completedSkills.length
        ? `Completed ${user.completedSkills.length} skills 🎉`
        : "No achievements yet",
      description: user.completedSkills.length
        ? "Keep learning to unlock more rewards!"
        : "Start completing plans to unlock rewards!",
    },
  };

  return res.status(200).json(new ApiResponse(200, response, "Dashboard data"));
});

export { getDashboard };
