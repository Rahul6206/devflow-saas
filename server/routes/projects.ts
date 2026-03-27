import express from "express";
import CreateProject from "../controllers/Projets/CreateProject";
import authenticateToken from "../middlewares/authToken";
import GetProjects from "../controllers/Projets/GetProjects";
import GetSingleProject from "../controllers/Projets/GetSingleProject";

const ProjetRoute=express.Router();

ProjetRoute.post('/',authenticateToken,CreateProject)
ProjetRoute.get('/',authenticateToken,GetProjects)
ProjetRoute.get('/:projectId',authenticateToken,GetSingleProject)

export default ProjetRoute;