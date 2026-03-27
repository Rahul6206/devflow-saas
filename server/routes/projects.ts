import express from "express";
import CreateProject from "../controllers/Projets/CreateProject";
import authenticateToken from "../middlewares/authToken";
import GetProjects from "../controllers/Projets/GetProjects";
import GetSingleProject from "../controllers/Projets/GetSingleProject";
import UpdateProject from "../controllers/Projets/UpdateProject";
import DeleteProject from "../controllers/Projets/DeleteProject";

const ProjetRoute=express.Router();

ProjetRoute.post('/',authenticateToken,CreateProject)
ProjetRoute.get('/',authenticateToken,GetProjects)
ProjetRoute.get('/:projectId',authenticateToken,GetSingleProject)
ProjetRoute.patch('/:projectId',authenticateToken,UpdateProject)
ProjetRoute.delete('/:projectId',authenticateToken,DeleteProject)

export default ProjetRoute;