'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Eye, EyeOff } from "lucide-react";

export default function SigninPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Invalid username or password.");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/", prompt: "select_account" });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="bg-white/10 backdrop-blur-md text-white p-8 rounded-lg max-w-md w-full shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded transition mb-6"
          >
            Sign in with Google
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-grow h-px bg-white/30" />
            <span className="mx-2 text-sm text-white/70">OR</span>
            <div className="flex-grow h-px bg-white/30" />
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full mb-4 p-2 rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative mb-4">
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

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-400 underline hover:text-blue-300">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
