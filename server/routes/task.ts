import express from "express";
import authenticateToken from "../middlewares/authToken";
import CreateTask from "../controllers/Task/CreateTask";

const TaskRoute=express.Router();

TaskRoute.post('/',authenticateToken,CreateTask)

export default TaskRoute;