import { Router } from "express";
import { GetTasks } from "../controllers/taskController";

const router = Router();

router.get("/", GetTasks);

export default router;
