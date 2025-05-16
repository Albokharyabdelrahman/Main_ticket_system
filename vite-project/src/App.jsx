import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./router/Routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <MyRoutes />
    </BrowserRouter>
  );
}

export default App;