import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./router/Routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <MyRoutes />
    </BrowserRouter>
  );
}

export default App;