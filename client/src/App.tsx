import { Badge, Button } from "react-bootstrap";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import TheHeader from "./components/layout/TheHeader";

function App() {
  return (
    <>
      <TheHeader></TheHeader>
      <div>
        <h1>
          Example heading
          <Badge bg="primary" as={Button}>
            Sample Badge to check bootstrap is working
          </Badge>
        </h1>
      </div>
      <h1 className="text-4xl">Bootstrap header checker</h1>
      <RouterProvider router={router} />
    </>
  );
}

export default App;