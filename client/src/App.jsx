import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

/** components */
import { HomeLayout, Register, Login } from "./pages";
function App() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
  ]);
  return <RouterProvider router={Router} />;
}

export default App;
