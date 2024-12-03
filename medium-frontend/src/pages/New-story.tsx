import { useState } from "react";
import Inputcomponent from "../components/Inputcomponent";
import TextAreaComponent from "../components/TextArea";
import { useNotification } from "../context/Notification";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Back from "../components/Back";

function BlogPostForm() {
  const navigate = useNavigate();
  const [blogForm, setBlogForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    tags: "",
  });
  const { notify } = useNotification();
  const { token } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/v1/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogForm),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }
      const { message } = await response.json();
      console.log();
      notify(message, "success");
      navigate("/");
    } catch (error: any) {
      notify(error.message, "error");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <Back />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create a New Blog Post
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Inputcomponent
            type="text"
            inputLable="Title"
            value={blogForm.title}
            onChange={(e) =>
              setBlogForm({ ...blogForm, title: e.target.value })
            }
          />
          <Inputcomponent
            type="text"
            inputLable="Subtitle"
            value={blogForm.subtitle}
            onChange={(e) =>
              setBlogForm({ ...blogForm, subtitle: e.target.value })
            }
          />
          <TextAreaComponent
            label="Content"
            rows={10}
            value={blogForm.content}
            onChange={(e) =>
              setBlogForm({ ...blogForm, content: e.target.value })
            }
          />
          <Inputcomponent
            type="text"
            inputLable="Tags (comma-separated)"
            value={blogForm.tags}
            onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
          />

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit Blog Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BlogPostForm;
