import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (name  && email   && password) {
      // 🔐 Dummy logic — replace with real signup logic/API later
      localStorage.setItem("token", "dummy_token");
      toast.success("Signup successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-primary">Create Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border border-border rounded"
        />
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
          className="w-full mb-4 p-2 border border-border rounded"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-primary text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>

        <ToastContainer position="top-center" autoClose={1500} />
      </div>
    </div>
  );
}