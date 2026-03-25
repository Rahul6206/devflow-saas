import express from 'express'
import CreateOrganization from '../controllers/Organization/Create';
import authenticateToken from '../middlewares/authToken';

const Orgrouter=express.Router();

Orgrouter.post('/',authenticateToken,CreateOrganization);

export default Orgrouter;