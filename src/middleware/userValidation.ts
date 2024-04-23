
import { Request, Response, NextFunction } from 'express';


//email needs to be correct in format (name@e-mail.com)//
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { emailAddress } = req.body;
  console.log(emailAddress);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailAddress || !emailRegex.test(emailAddress)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  next();
};

  

//validate thats need to be 8 special characters and in this it should be one capital letter and 1 special letter and 1 number//
export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'Password must be longer than 4 characters' });
  }

  next();
};


export const createUserValidationRules = (req: Request, res: Response, next: NextFunction) => {
    const { userName } = req.body;
    console.log(userName);
    if (!userName) {
      return res.status(400).json({ error: 'Please provide the username'});
    }  
    next();
  };
  
// Validate phone number format
export const validatePhoneNumber = (req: Request, res: Response, next: NextFunction) => {
  const { mobileNumber } = req.body;
  console.log(mobileNumber);
  const phoneRegex = /^(03\d{9}|\+92\d{10})$/;

  if (!mobileNumber.startsWith('03') && !mobileNumber.startsWith('+92')) {
      return res.status(400).json({ error: 'Please provide a valid Pakistan mobile number starting with 03 or +92' });
  }

  if (mobileNumber.startsWith('03') && mobileNumber.length !== 11) {
      return res.status(400).json({ error: 'Please provide a valid Pakistan mobile number with 03 format and total length of 11 digits' });
  }

  if (mobileNumber.startsWith('+92') && mobileNumber.length !== 13) {
      return res.status(400).json({ error: 'Please provide a valid Pakistan mobile number with +92 format and total length of 13 digits' });
  }

  next();
};
export const logInUserValidationRules = (req: Request,res:Response,next: NextFunction) => {
  const {mobileNumber,password}= req.body;
  if(!mobileNumber || !password)
  {
    return res.status(400).json({ error: 'Please provide both mobileNumber and password' });
  }
  next();

}




// Convert phone number format from 03 to +92
export const convertPhoneNumberFormat = (req: Request, res: Response, next: NextFunction) => {
  let { mobileNumber } = req.body;
  console.log(mobileNumber);

  // Check if the phone number starts with '03' and convert it to '+92'
  if (mobileNumber && mobileNumber.startsWith('03')) {
    mobileNumber = '+92' + mobileNumber.substring(2);
    req.body.phoneNumber = mobileNumber; // Update the phoneNumber in the request body
    console.log(mobileNumber);
  }

  next();
};
/*
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id, 10);
  
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    // Proceed to the next middleware or the route handler
    next();
  };
  
*/