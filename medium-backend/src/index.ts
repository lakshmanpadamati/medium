import { NextFunction } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const middlewares = require("./middlewares/middlewares");
const blogControllers = require("./controllers/blogControllers");
const authControllers = require("./controllers/authControllers");
const UserControllers = require("./controllers/UserControllers");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const blogId = Number(req.params.blogId);
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Check if the user already likes the blog
    const blog = await prisma.blogs.findUnique({
      where: { id: blogId },
      include: { likedBy: { where: { id: userId } } },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.likedBy.length > 0) {
      // User has already liked the blog, so remove the like
      await prisma.blogs.update({
        where: { id: blogId },
        data: {
          likedBy: { disconnect: { id: userId } },
          likes_count: { decrement: 1 },
        },
      });
      return res.status(200).json({ message: "Blog unliked" });
    } else {
      // User has not liked the blog, so add the like
      await prisma.blogs.update({
        where: { id: blogId },
        data: {
          likedBy: { connect: { id: userId } },
          likes_count: { increment: 1 },
        },
      });
      return res.status(200).json({ message: "Blog liked" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
const toggleSave = async (req: Request, res: Response) => {
  console.log("save toggle")
  try {
    const userId = req.user.id;
   const blogId=Number(req.params.blogId)

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Check if the user already saved the blog
    const blog = await prisma.blogs.findUnique({
      where: { id: Number(blogId) },
      include: { savedBy: { where: { id: userId } } },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.savedBy.length > 0) {
      // User has already saved the blog, so remove the save
      await prisma.blogs.update({
        where: { id: blogId },
        data: {
          savedBy: { disconnect: { id: userId } },
          saved_count: { decrement: 1 },
        },
      });
      return res.status(200).json({ message: "Blog unsaved" });
    } else {
      // User has not saved the blog, so add the save
      await prisma.blogs.update({
        where: { id: blogId },
        data: {
          savedBy: { connect: { id: userId } },
          saved_count: { increment: 1 },
        },
      });
      return res.status(200).json({ message: "Blog saved" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

// Apply authentication middleware globally except for signup and login routes
router
  .get(
    "/api/v1/user/me",
    middlewares.authMiddleware,
    UserControllers.getMyProfile
  )
  .post("/api/v1/signup", authControllers.signupcontroller)
  .post("/api/v1/signin", authControllers.loginController)
  .use(middlewares.authMiddleware) // Apply to all subsequent routes
  .post("/api/v1/blogs/:blogId/toggle-like", toggleLike)
  .post("/api/v1/blogs/:blogId/toggle-save", toggleSave)
  .get("/api/v1/blogs", blogControllers.getAllBlogs)
  .get("/api/v1/users", UserControllers.getUsers)
  .put("/api/v1/updatepassword", authControllers.updatePasswordController)
  .post("/api/v1/forgotpassword", authControllers.forgotPasswordController)
  .get("/api/v1/tags", blogControllers.getTags)
  .get("/api/v1/blogs/:blogId", blogControllers.getblog)
  .post("/api/v1/blogs", blogControllers.createBlog)
  .put(
    "/api/v1/blogs/:blogId",
    middlewares.authorMiddleware,
    blogControllers.updateBlog
  )
  .delete(
    "/api/v1/blogs/:blogId",
    middlewares.authorMiddleware,
    blogControllers.deleteblog
  )
  .post("/api/v1/toggle-friendship", UserControllers.toggleFriendship);

app.use("/", router);
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
