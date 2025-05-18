// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white"
      style={{
        background: "linear-gradient(135deg, #434190, #2c2e8f)",
      }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg shadow-2xl text-center"
        style={{
          background: "linear-gradient(135deg, #ff9800, #ff7043)",
        }}
      >
        <h1 className="text-4xl font-bold mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-6">Unauthorized Access</h2>
        
        <p className="mb-8 text-lg">
          You don't have permission to access this page. Please contact the administrator if you believe this is an error.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full py-3 px-6 bg-white text-orange-600 font-medium rounded-lg hover:bg-gray-100 transition duration-200"
          >
            Go to Homepage
          </Link>
          <Link
            to="/login"
            className="inline-block w-full py-3 px-6 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200"
          >
            Login with Different Account
          </Link>
        </div>
      </div>

      <p className="mt-8 text-center text-white/80">
        Need help? <a href="mailto:support@example.com" className="underline">Contact support</a>
      </p>
    </div>
  );
}