import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./router/Routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
        <AuthProvider> {/* Must wrap Routes */}
        <MyRoutes />
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;