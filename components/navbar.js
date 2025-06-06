'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <nav className="w-full px-4 py-3 bg-white/10 backdrop-blur-md text-white flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        SpendTrack
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <div className="flex space-x-4">
          <Link
            href="/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Spending
          </Link>
          <Link
            href="/history"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            View History
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/signin"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
