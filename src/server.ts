import express from "express";
import "dotenv/config";
import tasksRoute from "./routes/tasksRoutes";
import userRoute from "./routes/userRoute";
import { connectDB } from "./config/db";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

connectDB();

app.use("/task", tasksRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
