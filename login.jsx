import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from '../services/api';


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = () => {
  //   if (email  && password ) {
  //     localStorage.setItem("token", "dummy_token");
  //     toast.success("Login successful!");

  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     }, 1500);
  //   } else {
  //     toast.error("Invalid credentials. Try again!");
  //   }
  // };

  // 
  const handleLogin = async () => {
    if (!email || !password) {
      toast.warn("Please enter email and password");
      return;
    }

    try {
      const res = await api.login({ email, password });
      const token = res.data.access_token;

      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (err) {
      toast.error(err.message || "Login failed.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-primary">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border border-border rounded"
        />

        {/* Forgot Password Link */}
        <div className="text-right mb-4">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>

        <ToastContainer position="top-center" autoClose={1500} />
      </div>
    </div>
  );
}