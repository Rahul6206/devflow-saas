import express from "express";
import CreateProject from "../controllers/Projets/CreateProject.js";
import authenticateToken from "../middlewares/authToken.js";
import GetProjects from "../controllers/Projets/GetProjects.js";
import GetSingleProject from "../controllers/Projets/GetSingleProject.js";
import UpdateProject from "../controllers/Projets/UpdateProject.js";
import DeleteProject from "../controllers/Projets/DeleteProject.js";

const ProjetRoute=express.Router();

ProjetRoute.post('/',authenticateToken,CreateProject)
ProjetRoute.get('/',authenticateToken,GetProjects)
ProjetRoute.get('/:projectId',authenticateToken,GetSingleProject)
ProjetRoute.patch('/:projectId',authenticateToken,UpdateProject)
ProjetRoute.delete('/:projectId',authenticateToken,DeleteProject)

export default ProjetRoute;