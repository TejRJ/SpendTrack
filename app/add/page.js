'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/navbar';
import { toast } from 'react-toastify';

const categories = ['Food', 'Transport', 'Groceries', 'Utilities', 'Entertainment', 'Other'];

export default function AddSpendingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const [marginTop, setMarginTop] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const adjustMargin = () => {
      if (!cardRef.current || !containerRef.current) return;
      const containerHeight = containerRef.current.offsetHeight;
      const cardHeight = cardRef.current.offsetHeight;
      const availableSpace = containerHeight - cardHeight;
      const topMargin = Math.max(10, availableSpace / 2);
      setMarginTop(topMargin);
    };

    adjustMargin();
    window.addEventListener('resize', adjustMargin);
    return () => window.removeEventListener('resize', adjustMargin);
  }, []);

  if (status === 'loading') return <div className="text-center text-white mt-20">Checking authentication...</div>;
  if (!session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    const res = await fetch('/api/spendings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, amount: parsedAmount, description, category }),
    });

    if (res.ok) {
      toast.success('Spending saved!');
      setAmount('');
      setDescription('');
      setCategory(categories[0]);
    } else {
      toast.error('Error saving spending');
    }
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      <Navbar />
      <main ref={containerRef} className="flex flex-col flex-grow px-4 py-4 min-h-[calc(100dvh-64px)]">
        <div
          ref={cardRef}
          style={{ marginTop }}
          className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg w-full max-w-md p-8 text-white mx-auto"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Add Spending</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-200 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-white/20 bg-transparent text-white px-4 py-2 rounded-lg backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-200 mb-1">Amount (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 backdrop-blur-sm"
                placeholder="Enter amount spent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-200 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 backdrop-blur-sm appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-black bg-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-200 mb-1">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 backdrop-blur-sm"
                placeholder="e.g., Lunch, Groceries..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Spending
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
