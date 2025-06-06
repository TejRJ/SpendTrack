'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setSuccess("Signup successful! You can now sign in.");
      setUsername("");
      setPassword("");
    } else {
      const { message } = await res.json();
      setError(message || "Signup failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <form
          onSubmit={handleSignup}
          className="bg-white/10 backdrop-blur-md text-white p-8 rounded-lg max-w-md w-full shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full mb-4 p-2 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-white"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition"
          >
            Sign Up
          </button>

          <p className="mt-4 text-sm text-center text-yellow-300">
            ⚠ Remember your username and password. There is no recovery option.
          </p>
        </form>
      </div>
    </>
  );
}
