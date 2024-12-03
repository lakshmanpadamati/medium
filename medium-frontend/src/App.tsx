import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import NotificationProvider from "./context/Notification";
import AuthContextProvider from "./context/AuthContext";
import { BlogsLoader } from "./pages/Blogs";
// Lazy load components
const Signin = React.lazy(() => import("./pages/SignIn"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NewStory = React.lazy(() => import("./pages/New-story"));
const Blogs = React.lazy(() => import("./pages/Blogs"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Protected = React.lazy(() => import("./pages/Protected"));
import { BlogLoader } from "./pages/Blog";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<NotificationProvider />}
      errorElement={<p>Something went wrong from notifications context</p>}
    >
      <Route element={<AuthContextProvider />}>
        <Route
          path="/auth"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Signin />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Protected />
            </Suspense>
          }
        >
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Blogs />
                </Suspense>
              }
              loader={BlogsLoader}
              errorElement={<p>Something went wrong</p>}
            />
            <Route
              path="blogs/:blogId"
              loader={BlogLoader}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Blog />
                </Suspense>
              }
              errorElement={<div>Blog not found with the given id</div>}
            />
            <Route path="/blogs/edit/:blogId" element={<div>edit</div>} />
            <Route
              path="new-story"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <NewStory />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
