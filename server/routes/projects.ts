import express from "express";
import CreateProject from "../controllers/Projets/CreateProject";
import authenticateToken from "../middlewares/authToken";

const ProjetRoute=express.Router();

ProjetRoute.post('/',authenticateToken,CreateProject)

export default ProjetRoute;