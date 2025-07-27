import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    optionsSuccessStatus: 200,
    credentials: true
}))

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



//url will be here


app.use("api/v1/users", userRouter)


export default app;