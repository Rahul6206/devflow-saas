import express from 'express'
import CreateOrganization from '../controllers/Organization/Create';
import authenticateToken from '../middlewares/authToken';
import Orgme from '../controllers/Organization/orgme';
import UpdateOrg from '../controllers/Organization/update';
import AddMember from '../controllers/Organization/addMember';
import GetOrgMembers from '../controllers/Organization/GetallMembers';
import DeleteOrg from '../controllers/Organization/deleteOrg';
import RemoveMember from '../controllers/Organization/removeMember';
import ChangeMemberRole from '../controllers/Organization/ChangeRole';

const Orgrouter=express.Router();

Orgrouter.post('/',authenticateToken,CreateOrganization);
Orgrouter.patch('/',authenticateToken,UpdateOrg);
Orgrouter.delete('/',authenticateToken,DeleteOrg);
Orgrouter.get('/me',authenticateToken,Orgme);
Orgrouter.post('/member',authenticateToken,AddMember);
Orgrouter.get('/member',authenticateToken,GetOrgMembers);
Orgrouter.delete('/member/:userId',authenticateToken,RemoveMember);
Orgrouter.patch('/member/:userId/role',authenticateToken,ChangeMemberRole);

export default Orgrouter;