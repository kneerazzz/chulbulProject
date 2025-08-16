export type Skill = {
  _id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

// types/daily-topic.ts

export type DailyTopic = {
  _id: string;                // MongoDB ObjectId as string when returned to frontend
  skillPlan: string;          // ObjectId reference to SkillPlan
  day: number;                // defaults to 1
  topic: string;              // required
  description: string;        // required
  content: string;            // required
  generatedAt: string;        // ISO date string when serialized
  optionalTip?: string;       // default is "" in DB, but optional in TS
  isRegenrated: boolean;      // defaults to false
  createdAt: string;          // from timestamps: true
  updatedAt: string;          // from timestamps: true
}
