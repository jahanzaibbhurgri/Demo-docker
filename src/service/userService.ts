import { Login } from '@models/login.model';
import { User} from '@models/user.model';
import {checkPasswordMatch} from '../utils/passwordChecker'
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {accessKeyId,secretAccessKey,awsRegion} from '../constants/awsCredentials'
import {generateOTP } from '../utils/generateOtp';
import { Kafka, logLevel,Producer } from 'kafkajs';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import axios from 'axios';
import { int } from 'aws-sdk/clients/datapipeline';


// Initialize the SNS client
const sns = new SNSClient({ region: awsRegion,credentials:{
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
} }); 


const prisma = new PrismaClient();

const kafka = new Kafka({
  clientId: 'user-service-client',
  brokers: ['kafka:9092'],
  logLevel: logLevel.INFO,
});


const producer = kafka.producer({
  retry: {
    initialRetryTime: 100, // initial delay before first retry in milliseconds
    retries: 10, // number of retries before giving up
  },
});
export const logIn = async (userData: Login) => {
  try {
    const { mobileNumber, password } = userData;

    // Connect to Kafka producer
    await producer.connect();
    console.log(mobileNumber,password);
   
    //request would be sent to the pos machine//
    const url = 'https://test-vendor-api.aladdininformatics.com/api/v2/auth/login';
    const data = {
      "phone": userData.mobileNumber,
      "password": userData.password,
      "storeId": 2048
    };

    const response = await axios.post(url, data);
    const tokenReceivedFromPos = response.data?.data?.details?.token;
    console.log(tokenReceivedFromPos);

    // Find the user by mobile number
    const userOfPos = await prisma.user.findUnique({
      where: { mobileNumber: mobileNumber },
    });

    // Create the token and associate it with the user
    if (userOfPos) {
      await prisma.token.create({
        data: {
          posToken: tokenReceivedFromPos,
          userId: userOfPos.id
        }
      });
    }

    // Retrieve user from the database
    const user = await prisma.user.findUnique({
      where: { mobileNumber: mobileNumber },
    });
    

    // Check if the user exists and the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.mobileNumber }, 'your-secret-key', {
      expiresIn: '1h',
    });

   //  Publish a message to the 'user-topic' Kafka topic
   await producer.send({
    topic: 'user-login-topic',
    messages: [
      {
        key: user.id.toString(),
        value: JSON.stringify({
          username: user.mobileNumber,
          userToken: token,
          posToken: tokenReceivedFromPos,
          role: user.role,
          storeId: user.StoreId,
          message: "user is loggedIn"
        }), 
      },
    ],
  });


    // Disconnect from Kafka producer
   await producer.disconnect();

    // Return user information and token
    return {
      message: 'You are logged in',
      userName: user.userName,
      emailAddress: user.emailAddress,
      mobileNumber: user.mobileNumber,
      token: token,
      password: user.password,
      storeId: user.StoreId,
      posToken: tokenReceivedFromPos
    };
  } catch (error) {
    // Handle errors
    console.error('Login error:', error);
    throw new Error('An error occurred during login');
  }
};


export const registerUser = async (userData: User) => {
  try {
    

     // Connect to Kafka producer
     await producer.connect();

    // Check if passwords match
   // if (!checkPasswordMatch(password, confirmPassword)) {
    //  throw new Error("Passwords do not match");
   // }

    // Hash the user's password using bcrypt
   // const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database with role 'owner'
    const user = await prisma.user.create({
      data: {
        userName:userData.userName,
        password: "",
        emailAddress: "",
        mobileNumber:userData.mobileNumber,
        StoreId: 2048,
        tokens: {
          create: [],
        },
        otps: {
          create: []
        },
        role: 'owner',
      },
    });
    

    console.log("User has been created");

    // Produce a message to Kafka topic with userId as partition key
    await producer.send({
      topic: 'user-registration-topic',
      messages: [
        { value: JSON.stringify({ userId: user.id, mobileNumber: user.mobileNumber, Message: "User registered" }), key: user.id.toString() },
      ],
    });
    
    // Disconnect from Kafka producer
   await producer.disconnect();

    console.log("User registration event has been produced to Kafka");

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('User registration failed');
  }
};

// Function to send OTP to a mobile number
async function sendOTP(mobileNumber: string, otp: int) {
  const command = new PublishCommand({
    Message: `Your Aladdin Informatics verification code is ${otp}. Please don't share this code with anyone.`,
    PhoneNumber: mobileNumber,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: 'String' 
      }
    }
  });

  try {
    const response = await sns.send(command);
    console.log("SMS sent:", response);
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw new Error("Failed to send OTP");
  }
}

export async function initiatePasswordReset(mobileNumber: string) {
  // Find the user by mobile number
  const user = await prisma.user.findUnique({
    where: { mobileNumber },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Generate OTP
  const otp = generateOTP();

  // Send OTP to the user
  await sendOTP(mobileNumber, otp);

  // Store the OTP securely in the database with the user relationship
  const databaseOtp = await prisma.otp.create({
    data: {
      user: { connect: { id: user.id } },
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
    },
  });
  console.log("user related save in the otp in the database",databaseOtp);

  console.log("OTP stored in the database:", databaseOtp);

  return { message: "OTP sent successfully" };
}

export async function resendOTP(mobileNumber: string) {
  // Find the user by mobile number
  const user = await prisma.user.findUnique({
    where: { mobileNumber },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Generate a new OTP
  const otp = generateOTP();

  // Send the new OTP to the user
  await sendOTP(mobileNumber, otp);

  // Find the existing OTP record for the user
  const existingOTP = await prisma.otp.findFirst({
    where: { userId: user.id },
  });

  if (!existingOTP) {
    throw new Error('Existing OTP not found');
  }

  // Update the existing OTP record with the new OTP and expiration time
  await prisma.otp.update({
    where: { id: existingOTP.id },
    data: {
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
    },
  });

  return { message: 'New OTP sent successfully' };
}

export async function verifyOTP(mobileNumber: string, otp: number, newPassword: string) {
  console.log("Swagger values", mobileNumber, otp, newPassword);

  // Validate input parameters
  if (!mobileNumber || !otp || !newPassword) {
    throw new Error('Invalid input parameters');
  }

  // Find the user by mobile number to get the user's id
  const user = await prisma.user.findUnique({
    where: { mobileNumber },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Check if OTP exists for the user
  const storedOTP = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      otp,
      expiresAt: {
        gte: new Date(), // Check if OTP has not expired
      },
    },
  });

  console.log("Value that if OTP exists or not in the database", storedOTP);

  if (!storedOTP) {
    throw new Error('Invalid OTP');
  }

  try {
    // Update user's password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });

    // Delete the OTP record
    await prisma.otp.deleteMany({
      where: {
        userId: user.id,
        otp,
      },
    });

    // Call the API to update the owner's password
    const response = await axios.post('https://test-vendor-api.aladdininformatics.com/api/v2/auth/updateOwnerPassword', {
      phone: mobileNumber,
      pass: newPassword,
    });

    return { message: 'Password reset successful', response: response.data };
  } catch (error) {
    // Handle database or other errors
    throw new Error('Failed to reset password');
  }
}
export async function deleteAllUsers() {
  try {
    // Delete all related OTP records first
    await prisma.otp.deleteMany();

    // Delete all tokens associated with the users
    await prisma.token.deleteMany();

    // Delete all users
    await prisma.user.deleteMany();

    return { message: 'All users deleted successfully' };
  } catch (error) {
    console.error('Error deleting users:', error);
    throw new Error('Failed to delete users');
  }
}


export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error('Failed to get all users');
  }
}