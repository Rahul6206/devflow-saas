// 1️⃣ Create Project
// POST /projects

// Body:

// {
//   "name": "Backend API"
// }
// 2️⃣ Get All Projects
// GET /projects

// 👉 current user's org ke saare projects

// 3️⃣ Get Single Project
// GET /projects/:projectId
// 4️⃣ Update Project
// PATCH /projects/:projectId
// 5️⃣ Delete Project
// DELETE /projects/:projectId
// 📦 TASK APIs
// 6️⃣ Create Task
// POST /tasks

// Body:

// {
//   "title": "Build login API",
//   "description": "JWT + refresh token",
//   "projectId": "projectId"
// }
// 7️⃣ Get Tasks (by project)
// GET /tasks?projectId=xxx
// 8️⃣ Get Single Task
// GET /tasks/:taskId
// 9️⃣ Update Task
// PATCH /tasks/:taskId
// 🔟 Delete Task
// DELETE /tasks/:taskId
// 1️⃣1️⃣ Assign Task
// PATCH /tasks/:taskId/assign

// Body:

// {
//   "userId": "userId"
// }
// 1️⃣2️⃣ Update Task Status
// PATCH /tasks/:taskId/status

// Body:

// {
//   "status": "IN_PROGRESS"
// }


import express from "express";
import dotenv from 'dotenv'

//env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


import router from "./routes/auth";
import Orgrouter from "./routes/org";
import ProjetRoute from "./routes/projects";
import TaskRoute from "./routes/task";
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to DevFlow API " });
  console.log("Api running");
});

//routes

app.use('/auth',router)
app.use('/org',Orgrouter)
app.use('/project',ProjetRoute)
app.use('/task',TaskRoute)




// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction)=> {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

