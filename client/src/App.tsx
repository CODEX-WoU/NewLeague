import { RouterProvider } from "react-router-dom";
import router from "./router";
import TheHeader from "./components/layout/TheHeader";
import TheFooter from "./components/layout/TheFooter";

function App() {
  return (
    <>
      <TheHeader></TheHeader>
      <RouterProvider router={router} />
      <TheFooter />
    </>
  );
}

export default App;
