import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"



const app = express();

const allowedOrigins = process.env.NODE_ENV === "production"
    ? ["https://gradiva.vercel.app"]
    : ["http://localhost:3000"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))

app.use(express.static("Public"))

app.use(cookieParser())


//import routes here

import userRouter from './routes/user.routes.js'
import skillRouter from './routes/skill.routes.js'
import skillPlanRouter from "./routes/skillPlan.routes.js"
import dailyTopicRouter from "./routes/dailyTopic.routes.js"
import aiHistoryRouter from "./routes/aiHistory.routes.js" 
import notificationRouter from "./routes/notification.routes.js"
import notesRouter from "./routes/notes.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthCheckRouter from "./routes/healthCheck.routes.js" 

import limiter from './middlewares/rateLimiter.js';
//url will be here

app.use("/api", limiter)

app.use("/api/v1/users", userRouter)
app.use("/api/v1/skills", skillRouter)
app.use("/api/v1/skillplans", skillPlanRouter)
app.use("/api/v1/dailyTopics", dailyTopicRouter)
app.use("/api/v1/aiHistory", aiHistoryRouter)
app.use("/api/v1/notifications", notificationRouter)
app.use("/api/v1/notes", notesRouter)
app.use("/api/v1", dashboardRouter)
app.use("/api/v1", healthCheckRouter)


export default app;