import express from 'express';
import dotenv from 'dotenv';
import app from './app.js'
import connectDB from "./db/index.js"


dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 50000

connectDB()
.then(() => {
    app.get("/", (req, res) => {
        res.send("<h1>Server is running</h1>");
    })

    app.listen(PORT, () => {
        console.log("server is running on port", PORT)
        console.log(`http://localhost:${PORT}`)
    })
})
.catch((error) => {
    console.log("connection database failed!!", error)
})