import express from "express";
import authenticateToken from "../middlewares/authToken";
import CreateTask from "../controllers/Task/CreateTask";
import GetTasks from "../controllers/Task/GetTask";
import GetSingleTask from "../controllers/Task/GetSingleTaskDetails";
import UpdateTask from "../controllers/Task/UpdateTask";
import DeleteTask from "../controllers/Task/Delete";
import AssignTask from "../controllers/Task/AssignTask";
import UpdateTaskStatus from "../controllers/Task/UpdateStatus";
import { createComment, getComments } from "../controllers/Task/Comments";

const TaskRoute=express.Router();

TaskRoute.post('/',authenticateToken,CreateTask);
TaskRoute.get('/',authenticateToken,GetTasks);
TaskRoute.get('/:taskId',authenticateToken,GetSingleTask);
TaskRoute.patch('/:taskId',authenticateToken,UpdateTask);
TaskRoute.delete('/:taskId',authenticateToken,DeleteTask);
TaskRoute.patch('/:taskId/assign',authenticateToken,AssignTask);
TaskRoute.patch('/:taskId/status',authenticateToken,UpdateTaskStatus);

// Comments
TaskRoute.post('/:taskId/comments',authenticateToken,createComment);
TaskRoute.get('/:taskId/comments',authenticateToken,getComments);

export default TaskRoute;