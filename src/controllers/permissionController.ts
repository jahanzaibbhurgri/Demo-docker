import { Request, Response } from 'express';
import * as permissionService from '../service/permissionService'




export const createPermission = async (req: Request, res: Response) => {
  try {
    const createPermission = await permissionService.createPermission(req.body);
    res.status(200).json(createPermission);
  } catch (error) {
    console.error('Error in creating the permission', error);
    res.status(500).json({ error: 'Error in creating the permission' });
  }
};

export const getPermission = async (req: Request, res: Response) => {
  try {
    const getPermission = await permissionService.getPermission(req.body);
    res.status(200).json(getPermission);
  } catch (error) {
    console.error('Error in get permission', error);
    res.status(401).json({ error: 'Error in get permission' });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
try {
 const updatePermission= await permissionService.updatePermission(req.body);
 res.status(200).json(updatePermission);
}
catch(error)
{
  console.error('Error in update permission', error);
  res.status(401).json({ error: 'Error in update permission' });
}
}

export const deletePermission = async(req: Request, res:Response) => {
try
{ 
  const deletePermission = await permissionService.deletePermission(req.body);
  res.status(200).json(deletePermission);
}
catch(error)
{  
  console.error('error in deleting the permisssion  ', error);
  res.status(401).json({ error: 'error in deleting the permisssion' });
}
}



