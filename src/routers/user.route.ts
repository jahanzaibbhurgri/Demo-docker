import { Router } from 'express';
import {createUserValidationRules,logInUserValidationRules,validateEmail,validatePhoneNumber,validatePassword,convertPhoneNumberFormat} from '../middleware/userValidation';
import { loginUser, registerUser,initiatePasswordReset,resendOTP,verifyOTP,deleteAllUsers,getAllUsers   } from '../controllers/userController';





const router = Router();
  
router.post('/api/register/user',validatePhoneNumber,createUserValidationRules,registerUser);
router.post('/api/login/user',validatePhoneNumber,logInUserValidationRules ,loginUser);
router.post('/api/initiatePasswordReset',validatePhoneNumber,convertPhoneNumberFormat,initiatePasswordReset );
router.post('/api/resendOTP',validatePhoneNumber,convertPhoneNumberFormat,resendOTP );
router.post('/api/verifyOTP',validatePhoneNumber,convertPhoneNumberFormat,validatePassword,verifyOTP );
router.get('/api/deleteAllUsers',deleteAllUsers );
router.get('/api/getAllUsers',getAllUsers );



export default router;
