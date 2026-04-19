import cors from "cors";
import express from "express";
import dotenv from 'dotenv';
import router from "./routes/auth.js";
import Orgrouter from "./routes/org.js";
import ProjetRoute from "./routes/projects.js";
import TaskRoute from "./routes/task.js";
import NotificationRoute from "./routes/notification.js";
import SearchRoute from "./routes/search.js"; 
import path from "path"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));

// API Routes
// (Maine / route hata diya hai taaki frontend perfectly load ho)
app.use('/auth', router);
app.use('/org', Orgrouter);
app.use('/project', ProjetRoute);
app.use('/task', TaskRoute);
app.use('/notifications', NotificationRoute);
app.use('/search', SearchRoute); 

app.get(/(.*)/, (req, res) => {
  const indexPath = path.join(process.cwd(), 'public', 'index.html');
  res.sendFile(indexPath);
});

// Error handling middleware (Sabse LAST mein)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction)=> {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});