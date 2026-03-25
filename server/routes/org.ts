import express from 'express'
import CreateOrganization from '../controllers/Organization/Create';
import authenticateToken from '../middlewares/authToken';
import Orgme from '../controllers/Organization/orgme';

const Orgrouter=express.Router();

Orgrouter.post('/',authenticateToken,CreateOrganization);
Orgrouter.get('/me',authenticateToken,Orgme);

export default Orgrouter;