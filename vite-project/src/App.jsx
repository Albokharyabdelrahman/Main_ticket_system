import React from "react";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./router/Routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* AuthProvider wraps the routes */}
        <MyRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
