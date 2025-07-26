import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();



dotenv.config();

const PORT = process.env.PORT || 50000

app.get("/", (req, res) => {
    res.send("<h1>Server is running</h1>");
})

app.listen(PORT, () => {
    console.log("server is running on port", PORT)
    console.log(`http://localhost:${PORT}`)
})