
import cors from "cors";
import express from "express";
import dotenv from 'dotenv'
import router from "./routes/auth";
import Orgrouter from "./routes/org";
import ProjetRoute from "./routes/projects";
import TaskRoute from "./routes/task";
import NotificationRoute from "./routes/notification";
import SearchRoute from "./routes/search";

//env
dotenv.config();



const app = express();
const PORT = process.env.PORT || 3000;

//cors
app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials:true
}));


 


// Middleware
app.use(express.static("public"))
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
app.use('/notifications', NotificationRoute)
app.use('/search', SearchRoute)




// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction)=> {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

