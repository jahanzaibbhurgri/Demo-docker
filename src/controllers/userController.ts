import { Request, Response } from 'express';
import * as userService from '../service/userService'




export const registerUser = async (req: Request, res: Response) => {
  try {
    const registrationUser = await userService.registerUser(req.body);

    res.status(201).json(registrationUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const loginUser = await userService.logIn(req.body);
    res.status(200).json(loginUser);
  } catch (error) {
    console.error('Incorrect login of user', error);
    res.status(401).json({ error: 'Incorrect Credentials' });
  }
};

export const initiatePasswordReset = async (req: Request, res: Response) => {
try 
{
 const {mobileNumber} = req.body;
 const initiatePasswordReset = await userService.initiatePasswordReset(mobileNumber);
 res.status(200).json(initiatePasswordReset);
}
catch(error)
{
  
  console.error('you cant initialize the password reset ', error);
  res.status(401).json({ error: 'Cant initialize the password reset' });
}

}

export const resendOTP = async(req: Request, res:Response) => {
try
{ 
  const {mobileNumber} = req.body;
  const resendOTP = await userService.resendOTP(mobileNumber);
  res.status(200).json(resendOTP);
}
catch(error)
{
  
  console.error('you cant initialize the password reset ', error);
  res.status(401).json({ error: 'Cant initialize the password reset' });
}
}





export const verifyOTP = async(req: Request, res:Response) => {
  try
  { const {mobileNumber, userOtp, newPassword} = req.body
    const verifyOTP = await userService.verifyOTP(mobileNumber,userOtp,newPassword);
    res.status(200).json(verifyOTP);
  }
  catch(error)
  {
    console.error('you cant initialize the password reset ', error);
    res.status(401).json({ error: 'Cant initialize the password reset' });
  }
  }
  export const deleteAllUsers = async (req: Request, res: Response) => {
    try {
      await userService.deleteAllUsers();
      res.status(200).json({ message: 'Your users are deleted' });
    } catch (error) {
      console.error('Error deleting users:', error);
      res.status(500).json({ error: 'Failed to delete users' });
    }
  };
 
  export const getAllUsers = async(req: Request, res: Response) => {
    	try
      {
          await userService.getAllUsers();
          res.status(200).json({ message: 'all user information provided' });

      }
      catch(error)
      {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Failed to get the users' });
      }

  } 
  

