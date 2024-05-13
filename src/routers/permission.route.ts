import { Router } from 'express';
import { createPermission,getPermission,deletePermission,updatePermission } from '../controllers/permissionController';





const router = Router();
  
router.post('/api/v1/createPermission',createPermission);
router.get('/api/v1/getPermission',getPermission);
router.get('/api/v1/deletePermission',deletePermission);
router.delete('/api/v1/updatePermission',updatePermission);



export default router;
