import {
  useLoaderData,
  LoaderFunction,
  LoaderFunctionArgs,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Back from "../components/Back";
import { useNotification } from "../context/Notification";
export const BlogLoader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const { blogId } = params;
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/blogs/${blogId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.data) {
      throw new Error("Blog not found");
    }

    return { blog: response.data };
  } catch (error: any) {
    console.error("Error fetching blog:", error.message || error);
    throw new Error("Failed to load blog.");
  }
};

type BlogType = {
  id: number;
  author: { fullname: string };
  title: string;
  subtitle: string;
  content: string;
  tags: { tag: string }[];
  liked: boolean;
  saved: boolean;
  likes_count: number;
  saved_count: number;
  createdAt: string;
  authorId: number;
};

interface BlogProps {
  blog: BlogType;
}

const BlogDetails: React.FC<BlogProps> = ({ blog }) => {
  const { user } = useAuth();
  const [Like, setLike] = useState(blog.liked);
  const [LikeCount, setLikeCount] = useState(blog.likes_count);
  const [save, setSave] = useState(blog.saved);
  const [saveCount, setSaveCount] = useState(blog.saved_count);
  const navigate = useNavigate();
 
  const { notify } = useNotification();
  const handleSave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/blogs/${blog.id}/toggle-save`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Blog not found");
      }
      setSaveCount(save ? saveCount - 1 : saveCount + 1);
      setSave((prevSave) => {
        return !prevSave;
      });
    } catch (error: any) {
      console.error("Error toggling save:", error.message || error);
    }
  };



const ThreeDotsMenu: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsMenuVisible(true)}
      onMouseLeave={() => setIsMenuVisible(false)}
    >
      {/* Three Dots Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
        />
      </svg>

      {/* Menu */}
      {isMenuVisible && (
        <div className="absolute right-4 top-4  w-32 bg-white shadow-xl rounded-md z-50">
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 "
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};


  const handleDelete = async () => {
  
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/blogs/${blog.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Blog not found");
      }
      navigate("/");
      notify("Blog deleted successfully", "success");
    } catch (error: any) {
      notify("Error deleting blog", "error");
      console.error("Error deleting blog:", error.message || error);
    }
  };
  const handleEdit = () => {
    navigate(`/blogs/edit/${blog.id}`);
  }
  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/blogs/${blog.id}/toggle-like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data) {
        throw new Error("Blog not found");
      }
      setLikeCount(Like ? LikeCount - 1 : LikeCount + 1);
      setLike((prevLike) => {
        return !prevLike;
      });
      // Toggle like state and count
    } catch (error: any) {
      console.error("Error toggling like:", error.message || error);

      // Rollback like state on failure
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex w-full justify-between">
        {" "}
        <Back />
        {user && blog.authorId === user.id && (
         <ThreeDotsMenu/>
        
        
        )}
      </div>

      <h1 className="text-4xl font-bold text-center mb-4">{blog.title}</h1>
      <h2 className="text-xl text-gray-600 text-center mb-4">
        {blog.subtitle}
      </h2>
      <p className="text-center text-gray-800 mb-2">
        <strong>Author:</strong> {blog.author.fullname}
      </p>
      <p className="text-center text-gray-500 mb-6">
        <strong>Created:</strong>{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="mb-4">
        <h3 className="text-2xl font-semibold mb-2">Content</h3>
        <p className="text-gray-700">{blog.content}</p>
      </div>
      <div className="flex justify-between mt-4">
        <div>
          <p className="text-gray-600">
            <strong>Likes:</strong> {LikeCount}
          </p>
          <button onClick={handleLike}>
            {Like ? (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                </svg>
              </span> // Replace with your SVG
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                  />
                </svg>
              </span> // Replace with your SVG
            )}
          </button>
        </div>
        <div>
          <p className="text-gray-600">
            <strong>Saved:</strong> {saveCount}
          </p>
          <button onClick={handleSave}>
            {save ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

function Blog() {
  const { blog } = useLoaderData<{ blog: BlogType }>();
  return <BlogDetails blog={blog} />;
}

export default Blog;
