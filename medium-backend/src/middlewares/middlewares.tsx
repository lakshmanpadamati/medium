import { PrismaClient, Users } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
  id: string;
  email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the Authorization header is present
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing or invalid token" });
    }

    // Extract the token'
    const token = authHeader.split(" ")[1];
    console.log(token)
    console.log()
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
   
    // Attach the decoded user info to the request object
   
    req.user = decoded;
    
    // Call the next middleware or route handler

    next();
  } catch (error: any) {
    console.log(req.params);
    console.error("in authmiddleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
const authorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing or invalid token" });
    }
    // Extract the token
    const token = authHeader.split(" ")[1];
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    // Attach the decoded user info to the request object

    const authorId = Number(decoded.id);
    const blogId = req.params.blogId;

    const blog = await prisma.blogs.findUnique({
      where: { id: Number(blogId) },
    });
    if (!blog) {
      return res.status(404).json({ message: "blog not found" });
    }
    if (authorId !== blog?.authorId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
module.exports = { authMiddleware, authorMiddleware };
