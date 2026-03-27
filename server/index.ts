// POST /org
// GET /org/me
// POST /org/members
// GET /org/members


// PATCH /org
// DELETE /org
// DELETE /org/members/:userId
// PATCH /org/members/:userId/role


import express from "express";
import dotenv from 'dotenv'

//env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


import router from "./routes/auth";
import Orgrouter from "./routes/org";
import CreateProject from "./controllers/Projets/CreateProject";
import ProjetRoute from "./routes/projects";
 
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




// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction)=> {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

