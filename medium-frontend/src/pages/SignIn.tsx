import { useEffect, useState } from "react";
import Inputcomponent from "../components/Inputcomponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../context/Notification";
import TextAreaComponent from "../components/TextArea";

import { useAuth } from "../context/AuthContext";

function Auth() {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Navigate to the home page or dashboard if authenticated
    }
  }, [isAuthenticated, navigate]); // Include `isAuthenticated` and `navigate` as dependencies

  const { login } = useAuth();
  const location = useLocation();
  const { notify } = useNotification();

  const queryParams = new URLSearchParams(location.search);
  const [AuthForm, setAuthForm] = useState({
    fullname: "",
    email: "",
    password: "",
    description: "",
  });
  const page = queryParams.get("type") || "signin";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = page === "signup" ? "signup" : "signin";
    const payload = {
      ...AuthForm,
      description: endpoint === "signup" ? AuthForm.description : undefined,
      fullname: endpoint === "signup" ? AuthForm.fullname : undefined,
    };
    try {
      const response = await fetch(`http://localhost:4000/api/v1/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      
      login(data.user, data.token);
      notify(data.message, "success");
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
      notify(error.message || "something went wrong", "error");
    }
  };
  return (
    <div className="flex  min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://logos-world.net/wp-content/uploads/2023/07/Medium-Logo.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {page !== "signup"
            ? "Sign in to your account"
            : " Create new account"}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {page === "signup" && (
            <Inputcomponent
              type="text"
              value={AuthForm.fullname}
              inputLable="Full Name"
              onChange={(e) => {
                setAuthForm({ ...AuthForm, fullname: e.target.value });
              }}
            />
          )}
          <Inputcomponent
            type="email"
            inputLable="Email address"
            value={AuthForm.email}
            onChange={(e) => {
              setAuthForm({ ...AuthForm, email: e.target.value });
            }}
          />
          {page === "signup" && (
            <TextAreaComponent
              label="Description"
              value={AuthForm.description}
              onChange={(e) => {
                setAuthForm({ ...AuthForm, description: e.target.value });
              }}
            />
          )}
          <Inputcomponent
            onChange={(e) => {
              setAuthForm({ ...AuthForm, password: e.target.value });
            }}
            type="password"
            value={AuthForm.password}
            inputLable="Password"
            auth={page === "signin" ? "signin" : undefined}
          />

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          {page !== "signup" ? "Not a member?" : "Already a member?"}
          <Link
            to={page !== "signup" ? "/auth/?type=signup" : "/auth/?type=signin"}
          >
            {page !== "signup" ? "signup" : "signin"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Auth;