import express from "express";
import dotenv from 'dotenv'
const app = express();
const PORT = process.env.PORT || 3000;


import router from "./routes/auth";
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//env
dotenv.config();

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





// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction)=> {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

