import express from "express";
import "dotenv/config"
import tasksRoute from "./routes/tasksRoutes";
import { connectDB } from "./config/db";

const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json());

connectDB()

app.use("/todos", tasksRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

