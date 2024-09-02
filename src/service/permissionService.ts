import { PrismaClient } from '@prisma/client';
import {accessKeyId,secretAccessKey,awsRegion} from '../constants/awsCredentials'
import { int } from 'aws-sdk/clients/datapipeline';



const prisma = new PrismaClient();

export const createPermission = async (data: {  roleId: number, name: string, description: string,typeOfPermission:string[]}) => {
  try {
    // const permissionExisted = await prisma.permission.findFirst({
    //   where: {
    //     roleId: data.roleId,
    //     userId: data.userId,
    //     name: data.name,

    //   }
    // });

    // if (permissionExisted) {
    //   throw new Error("Permission already exists with the same userId, roleId, and name");
    // }
    
    

    const permission = await prisma.permission.create({
      data: {
        roleId: data.roleId,
        name: data.name,
        typeOfPermission: {set:data.typeOfPermission},
        description: data.description,
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    });

    return {
      message: "Success in creating the permission of the user",
      status: "Success",
      data: permission
    };
  } catch (error) {
    console.error('Error in creating the permission of the user', error);
    throw new Error('Error in creating the permission of the user');
  }
};

export const getPermission  = async (data: {roleId:number}) => {
  try {
    if (!data.roleId ) {
      throw new Error("Please provide both userId");
    }

    const permissions = await prisma.permission.findMany({
      where: {
        roleId: data.roleId
      }
    });
   return {
      message: "Success in creating the get permission of the user",
      status: "Success",
      response: permissions
   }
  } 
  catch (error) {
    console.error('Error in creating the permission of the user', error);
    throw new Error('Error in creating the permission of the user');
  }
};

export const deletePermission = async (data: { name: string }) => {
  try {
    const permission = await prisma.permission.findFirst({
      where: {
        name: data.name
      }
    });

    if (!permission) {
      throw new Error("Permission not found");
    }

    await prisma.permission.delete({
      where: {
        id: permission.id
      }
    });

    return {
      message: "Successfully deleted the permission",
      status: "Success",
      data: permission
    };
  } catch (error) {
    console.error('Error in deleting the permission:', error);
    throw new Error('Error in deleting the permission');
  }
};

export const updatePermission = async (data: {
  roleId: number;
  name: string;
  Permissions: string[];
  description: string;
}) => {
  try {
    const permissionExisted = await prisma.permission.findFirst({
      where: {
        roleId: data.roleId,
        name: data.name,
      }
    });

    if (permissionExisted == null) {
      throw new Error("There is no permission with this user");
    }

    const permission = await prisma.permission.update({
      where: {
        id: permissionExisted.id
      },
      data: {
        name: data.name,
        typeOfPermission: data.Permissions, 
        description: data.description,
        updatedAt: new Date()
      }
    });

    return {
      message: "Success in updating the permission of the user",
      status: "Success",
      data: permission
    };
  } catch (error) {
    console.error('Error in updating the permission of the user:', error);
    throw new Error('Error in updating the permission of the user');
  }
};

export const findPermissionByName = async(data:{ roleId:number}) => {
  try
  {
    if(!data.roleId ||data.roleId < 0 )
    {
      throw new Error("roleId is not valid");
    }

    const permissionById = await prisma.permission.findMany({
      where: {
         id: data.roleId
      },
      select: {
        name: true,
        typeOfPermission: true
      }
    });

  return  {
    message: "All roles associated with the UserId",
    rolesById: permissionById
   }

  }
  catch(error)
  {
    console.error("error in finding role by id",error);
    throw new Error("Failed to find the role by id")
  }

}
