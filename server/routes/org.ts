import express from 'express'
import CreateOrganization from '../controllers/Organization/Create';
import authenticateToken from '../middlewares/authToken';
import Orgme from '../controllers/Organization/orgme';
import UpdateOrg from '../controllers/Organization/update';
import AddMember from '../controllers/Organization/addMember';
import GetOrgMembers from '../controllers/Organization/GetallMembers';

const Orgrouter=express.Router();

Orgrouter.post('/',authenticateToken,CreateOrganization);
Orgrouter.patch('/',authenticateToken,UpdateOrg);
Orgrouter.get('/me',authenticateToken,Orgme);
Orgrouter.post('/member',authenticateToken,AddMember);
Orgrouter.get('/member',authenticateToken,GetOrgMembers);

export default Orgrouter;