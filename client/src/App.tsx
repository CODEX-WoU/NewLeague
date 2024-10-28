import { RouterProvider } from "react-router-dom";
import router from "./router";
import TheHeader from "./components/layout/TheHeader";

function App() {
  return (
    <>
      <TheHeader></TheHeader>
      <div>
        <h1>Example heading</h1>
      </div>
      <button className="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
        Button
      </button>
      <h1 className="text-4xl">Bootstrap header checker</h1>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
