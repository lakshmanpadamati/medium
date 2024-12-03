import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const {
  blogSchema,
  updateBlogSchema,
  blogsFilterSchema,
} = require("./../Schemas/blogschema");
const findExisting = async (id: number) => {
  const existing = await prisma.blogs.findUnique({ where: { id } });
  return existing;
};
const createBlog = async (req: Request, res: Response) => {
  const response = blogSchema.safeParse(req.body);
  if (!response.success) {
    return res.status(400).json({
      message: response.error.errors.map((err: any) => err.message).join(", "),
    });
  }

  try {
    const { title, subtitle, content, tags } = response.data;
    console.log(response.data);
    const BlogData: any = {
      title,
      subtitle,
      content,
      authorId: Number(req.user.id),
    };
    if (tags) {
      const tagsArray = tags.split(",");
      const tagConnections = await Promise.all(
        tagsArray.map(async (tag: string) => {
          let existingTag = await prisma.tags.findUnique({ where: { tag } });
          if (!existingTag) {
            existingTag = await prisma.tags.create({
              data: { tag },
            });
          }
          return { id: existingTag.id };
        })
      );
      BlogData.tags = { connect: tagConnections };
    }
    const blog = await prisma.blogs.create({
      data: BlogData,
    });

    return res.status(201).json({ blog, message: "successfully created" });
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "something went wrong" });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
interface BlogQuery {
  q?: string;
  tag?: string;
  authorId?: string;
  page?: string;
  limit?: string;
}
interface BlogResponse {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  authorId: number;
  tags: { id: number; tag: string }[];
  likes_count: number;
  saved_count: number;
  createdAt: string; // ISO string format
}

const getAllBlogs = async (req: Request, res: Response): Promise<Response> => {
  try {
    const filter = blogsFilterSchema.safeParse(req.query as BlogQuery);
    if (!filter.success) {
      return res.status(400).json({
        message: filter.error.errors.map((err: any) => err.message).join(", "),
      });
    }

    let { q, tag, authorId, page, limit } = filter.data;

    if (!limit || isNaN(Number(limit)) || Number(limit) <= 0) limit = "5";
    if (!page || isNaN(Number(page)) || Number(page) <= 0) page = "1";

    const conditions: any = [];
    if (q) {
      conditions.push({ title: { contains: q, mode: "insensitive" } });
      conditions.push({ content: { contains: q, mode: "insensitive" } });
    }

    if (authorId) {
      conditions.push({ authorId: Number(authorId) });
    }
    if (tag) {
      conditions.push({
        tags: {
          some: {
            tag: tag,
          },
        },
      });
    }
    const totalCount = await prisma.blogs.count({
      where: {
        OR: conditions.length === 0 ? undefined : conditions,
      },
    });
    const blogs = await prisma.blogs.findMany({
      where: {
        OR: conditions.length === 0 ? undefined : conditions,
      },

      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      select: {
        id: true,
        title: true,
        subtitle: true,
        author: { select: { fullname: true } },
        authorId: true,
        likes_count: true,
        likedBy: {
          select: { id: true },
        },
        savedBy: {
          select: { id: true },
        },
        saved_count: true,
        tags: { select: { id: true, tag: true } },
        createdAt: true,
      },
    });

    const data: BlogResponse[] =
      blogs?.map((blog) => ({
        id: blog.id,
        title: blog.title,
        subtitle: blog.subtitle,
        author: blog.author.fullname,

        authorId: blog.authorId,
        tags: blog.tags.map((t) => ({ id: t.id, tag: t.tag })),
        likes_count: blog.likes_count,
        
        liked: blog.likedBy.some((like) => like.id === Number(req.user.id)),
        saved: blog.savedBy.some((save) => save.id === Number(req.user.id)),
        saved_count: blog.saved_count,
        createdAt: blog.createdAt.toISOString(),
      })) || [];

    return res.status(200).json({ blogs: data, totalCount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "something went wrong" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

const getblog = async (req: Request, res: Response) => {
  try {
    const blogId = Number(req.params.blogId);

    // Validate the blogId
    if (isNaN(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    // Fetch the blog with the given ID
    const blog = await prisma.blogs.findUnique({
      where: { id: blogId },
      include: {
        author: {
          select: { fullname: true },
        }, // Include author information
        tags: true, // Include tags if needed for the frontend
        likedBy: true,
        savedBy: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const data = {
      ...blog,
      liked: blog.likedBy.some((like) => like.id === Number(req.user.id)),
      saved: blog.savedBy.some((save) => save.id === Number(req.user.id)),
      likedBy: undefined,
      savedBy: undefined,
    };
    console.log(data)
    return res.status(200).json(data);
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

const updateBlog = async (req: Request, res: Response) => {
  try {
    const blogId = Number(req.params.blogId);
    const response = updateBlogSchema.safeParse(req.body);
    if (!response.success) {
      return res.status(400).json({
        message: response.error.errors
          .map((err: any) => err.message)
          .join(", "),
      });
    }
    const existingBlog = await findExisting(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "blog not found" });
    }
    const BlogData: any = response.data;
    const { title, content, tags } = BlogData;
    if (tags && tags.length > 0) {
      const tagConnections = await Promise.all(
        tags.map(async (tag: string) => {
          let existingTag = await prisma.tags.findUnique({ where: { tag } });
          if (!existingTag) {
            existingTag = await prisma.tags.create({
              data: { tag },
            });
          }
          return { id: existingTag.id };
        })
      );
      BlogData.tags = { connect: tagConnections };
    }
    await prisma.blogs.update({
      where: {
        id: blogId,
      },
      data: {
        title: title,
        content: content,
        tags: BlogData.tags,
      },
    });
    return res.status(200).json({ message: "updated successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "something went wrong" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

const getTags = async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    let tags: any = [];
    if (query && typeof query === "string") {
      tags = await prisma.tags.findMany({
        where: {
          tag: { contains: query },
        },
      });
    }
    return res.status(200).json({ tags });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "something went wrong" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

const deleteblog = async (req: Request, res: Response) => {
  const blogId = Number(req.params.blogId);
  try {
    const existingBlog = await findExisting(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "blog not found" });
    }
    await prisma.blogs.delete({
      where: {
        id: blogId,
      },
    });
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "something went wrong" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

module.exports = {
  createBlog,
  getblog,
  updateBlog,
  deleteblog,
  getAllBlogs,
  getTags,
};
//like save comment follow  following 