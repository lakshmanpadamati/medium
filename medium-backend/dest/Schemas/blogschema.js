"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const blogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "Title is required" }),
    content: zod_1.z.string().min(1, { message: "Content is required" }),
    tags: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().trim().optional(),
});
const updateBlogSchema = zod_1.z.object({
    title: zod_1.z.string().trim().optional(),
    content: zod_1.z.string().trim().optional(),
    subtitle: zod_1.z.string().trim().optional(),
    tags: zod_1.z.string().optional(),
});
const blogsFilterSchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
    skip: zod_1.z.number().optional(),
    take: zod_1.z.number().optional(),
    authorId: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
});
module.exports = { blogSchema, updateBlogSchema, blogsFilterSchema };
