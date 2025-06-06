"use client";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const username = session?.user?.name || "";

  const trimmedUsername = username
    .split(" ")
    .slice(0, 15)
    .join(" ") + (username.split(" ").length > 15 ? "..." : "");

  return (
    <main className="relative min-h-screen text-white">
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

      <Navbar />
      <section className="max-w-6xl mx-auto py-16 px-6 text-center">
        {username && (
          <h2
            className="text-lg text-white mb-2 max-w-2xl mx-auto break-words"
            title={username}
          >
            Welcome, <span className="font-semibold">{trimmedUsername}</span>!
          </h2>
        )}

        <h1 className="text-5xl font-bold mb-4">Welcome to SpendTrack</h1>
        <p className="text-lg text-gray-200 mb-8">
          Track expenses effortlessly. Understand your finances. Spend smarter.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-medium transition"
          >
            Add Spending
          </Link>
          <Link
            href="/history"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl text-lg font-medium transition backdrop-blur-sm"
          >
            View History
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          {
            title: "Fast & Easy",
            desc: "Add your expenses in seconds with a clean and intuitive UI.",
            emoji: "⚡️",
          },
          {
            title: "Insightful Reports",
            desc: "Analyze spending patterns by date and category.",
            emoji: "📊",
          },
          {
            title: "Secure & Private",
            desc: "Your data stays with you. No recovery means full control.",
            emoji: "🔐",
          },
        ].map(({ title, desc, emoji }) => (
          <div
            key={title}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-md border border-white/10"
          >
            <div className="text-4xl mb-4">{emoji}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-300 text-sm">{desc}</p>
          </div>
        ))}
      </section>
      
      <footer className="text-center py-8 text-sm text-gray-400">
        Built using Next.js & Tailwind CSS
      </footer>
    </main>
  );
}
