
import {  z } from "zod";
const blogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  tags: z.string().optional(),
  subtitle:z.string().trim().optional(),  
});

const updateBlogSchema = z.object({
  title: z.string().trim().optional(),
  content: z.string().trim().optional(),
  subtitle:z.string().trim().optional(),  
  tags: z.string().optional(),
});
const blogsFilterSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
  authorId: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
module.exports={blogSchema,updateBlogSchema,blogsFilterSchema}  