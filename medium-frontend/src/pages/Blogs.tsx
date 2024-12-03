import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import { LoaderFunctionArgs } from "react-router-dom";
import {
  useLoaderData,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

type BlogType = {
  id: number;
  author: string;
  title: string;
  subtitle: string;
  tags: [{ tag: string; id: number }];
  likes_count: number;
  saved_count: number;
  createdAt: string;
  authorId: number;
};

export const BlogsLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "10";
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is not available");
  }

  let params = `?page=${page}&limit=${limit}`;
  if (q.trim() !== "") {
    params = `?q=${q}&${params.substring(1)}`;
  }

  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/blogs/${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          contentType: "application/json",
        },
      }
    );
    return { blogs: response.data.blogs, totalCount: response.data.totalCount };
  } catch (error: any) {
    throw new Error("Failed to fetch blogs: " + error.message);
  }
};

const Blogs = () => {
  const { search } = useOutletContext<{ search: string }>();
 
  const { blogs, totalCount } = useLoaderData() as {
    totalCount: number;
    blogs: BlogType[];
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [limit, setLimit] = useState<number>(
    parseInt(searchParams.get("limit") || "10", 10)
  );
  useEffect(() => {
    // Reset page to 1 whenever totalCount changes
    setPage(1);
  }, [totalCount]);

  const params = new URLSearchParams();
  useEffect(() => {
    if (search) {
      params.set("q", search);
    }
      params.set("page", page.toString());
      params.set("limit", limit.toString());
    
    setSearchParams(params);
  }, [page, limit,search, setSearchParams]);
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  let buttons = [];
  for (let i = 1; i <= Math.ceil(totalCount / limit); i++) {
    buttons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        disabled={i === page}
        className={`px-4 py-2 border rounded ${
          i === page ? "bg-blue-500 text-white" : "bg-white text-black"
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {blogs.length === 0 ? (
        <div>No blogs found</div>
      ) : (
        blogs.map((blog: BlogType) => <BlogCard key={blog.id} blog={blog} />)
      )}
      <div className="mt-4 flex gap-2">{buttons}</div>
      
    </div>
  );
};

export default Blogs;
