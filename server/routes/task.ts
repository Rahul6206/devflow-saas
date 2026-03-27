import express from "express";
import authenticateToken from "../middlewares/authToken";
import CreateTask from "../controllers/Task/CreateTask";
import GetTasks from "../controllers/Task/GetTask";

const TaskRoute=express.Router();

TaskRoute.post('/',authenticateToken,CreateTask);
TaskRoute.get('/',authenticateToken,GetTasks);

export default TaskRoute;