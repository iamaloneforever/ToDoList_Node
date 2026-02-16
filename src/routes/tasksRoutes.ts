import { Router } from "express";
import { Test } from "../controllers/taskController";

const router = Router()

router.get('/todos', Test)

export default router
