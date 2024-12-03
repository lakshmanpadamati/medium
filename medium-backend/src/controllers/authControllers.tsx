import { Request, Response } from "express";
import { PrismaClient, Users } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { z } from "zod";
const loginSchema=z.object({
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
})
const signupSchema = z.object({
  fullname: z.string(),
  description:z.string(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
// The signup controller function

const signupcontroller = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Validate the incoming data using Zod
  
    const parsedData = signupSchema.safeParse(req.body);
    // If validation fails, return a 400 response with the error message
    if (!parsedData.success) {
   
      return res.status(400).json({
        message: parsedData.error.errors.map((err) => `${err.path}: ${err.message}`).join(", "),
      });
    }

    // Extract validated data
    const { fullname, email, password,description } = parsedData.data;

    // Check if the user already exists by email
    const existingUser = await prisma.users.findUnique({
      where: { email }, // Query by the unique email field
    });

    // If user exists, return an error
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const newUser: Users = await prisma.users.create({
      data: {
        fullname,
        description,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    // Respond with the created user (excluding password)
    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};
const loginController = async (req: Request, res: Response) => {
  try {
    const response=loginSchema.safeParse(req.body)

    if(!response.success){
        return res.status(400).json({
            message: response.error.errors.map((err) => err.message).join(", "),
          });   
    }
    const {email,password}=response.data;
  
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};
const updatePasswordController = async (req: Request, res: Response) => {};
const forgotPasswordController = async (req: Request, res: Response) => {};
module.exports = { signupcontroller, loginController, updatePasswordController, forgotPasswordController };
