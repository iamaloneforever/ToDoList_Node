import { Router } from "express";
import { AddTask, FindTask, GetTasks } from "../controllers/taskController";

const router = Router();

router.get("/", GetTasks);
router.get("/:id", FindTask);
router.post("/addtask", AddTask);

export default router;
