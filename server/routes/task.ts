import express from "express";
import authenticateToken from "../middlewares/authToken";
import CreateTask from "../controllers/Task/CreateTask";
import GetTasks from "../controllers/Task/GetTask";
import GetSingleTask from "../controllers/Task/GetSingleTaskDetails";
import UpdateTask from "../controllers/Task/UpdateTask";

const TaskRoute=express.Router();

TaskRoute.post('/',authenticateToken,CreateTask);
TaskRoute.get('/',authenticateToken,GetTasks);
TaskRoute.get('/:taskId',authenticateToken,GetSingleTask);
TaskRoute.patch('/:taskId',authenticateToken,UpdateTask);

export default TaskRoute;