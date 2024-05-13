

import { PrismaClient } from '@prisma/client';
import {accessKeyId,secretAccessKey,awsRegion} from '../constants/awsCredentials'
import { int } from 'aws-sdk/clients/datapipeline';



const prisma = new PrismaClient();

export const createPermission  = async (data: {userId:number,roleId:number,name:string,description:string}) => {
  try {

    //give the create permission of the same service//
   const permissionExisted= prisma.permission.findFirst({
      where: {
        roleId: data.roleId,
        userId: data.userId,
        name: data.name,
    }});

    if(permissionExisted == null) throw new Error("Permission is already existed with the same userId,roleId");
    
    const permission = prisma.permission.create({
       data:{
        userId:data.userId,
        roleId: data.roleId,
        name: data.name,
        description:data.description
       }

    }) 
   
   return {
      message: "Success in creating the permission of the user",
      status: "Success",
      data:permission
   }
  } 
  catch (error) {
    console.error('Error in creating the permission of the user', error);
    throw new Error('Error in creating the permission of the user');
  }
};


export const getPermission  = async (data: {userId:number,roleId:number}) => {
  try {
    //give the create permission of the same service//
   const permissionExisted= prisma.permission.findFirst({
      where: {
        roleId: data.roleId,
        userId: data.userId,
    }});

    if(permissionExisted == null) throw new Error("There is no permission with this role and user");
    
    const permission = prisma.permission.create({
       data:{
        userId:data.userId,
        roleId: data.roleId
       }

    }) 
   return {
      message: "Success in creating the get permission of the user",
      status: "Success",
      data:permission
   }
  } 
  catch (error) {
    console.error('Error in creating the permission of the user', error);
    throw new Error('Error in creating the permission of the user');
  }
};


export const deletePermission  = async (data: {userId:number,roleId:number,name:string}) => {
  try {

    //give the create permission of the same service//
   const permissionExisted= prisma.permission.findFirst({
      where: {
        roleId: data.roleId,
        userId: data.userId,
        name: data.name,
    }});

    if(permissionExisted == null) throw new Error("there is no permission");
    
    const permission = prisma.permission.delete({
       where:{
        userId:data.userId,
        roleId: data.roleId,
        name: data.name
       }

    }) 
   return {
      message: "Success in creating the delete permission of the user",
      status: "Success",
      data:permission
   }
  } 
  catch (error) {
    console.error('Error in creating the delete permission of the user', error);
    throw new Error('Error in creating the delete permission of the user');
  }
};


export const updatePermission  = async (data: {userId:number,roleId:number,name:string,description:string}) => {
  try {

    //give the create permission of the same service//
   const permissionExisted= prisma.permission.findFirst({
      where: {
        roleId: data.roleId,
        userId: data.userId,
        name: data.name,
    }});

    if(permissionExisted == null) throw new Error("there is no permission with this user");
    
    const permission = prisma.permission.update({
       data:{
        userId:data.userId,
        roleId: data.roleId,
        name: data.name,
        description:data.description
       }

    }) 
   
   return {
      message: "Success in creating the get permission of the user",
      status: "Success",
      data:permission
   }
  } 
  catch (error) {
    console.error('Error in creating the update permission of the user', error);
    throw new Error('Error in creating the  update permission of the user');
  }
};


