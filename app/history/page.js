'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const baseCategories = ['Food', 'Transport', 'Groceries', 'Utilities', 'Entertainment', 'Other'];
const categories = ['All', ...baseCategories];

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [category, setCategory] = useState('All');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  if (status === 'loading') return <div className="text-center text-white mt-20">Checking authentication...</div>;
  if (!session) return null;

  const fetchHistory = async () => {
    const query = new URLSearchParams({ start: startDate, end: endDate, category }).toString();
    const res = await fetch(`/api/history?${query}`);
    const data = await res.json();
    if (data.success) {
      setResults(data.spendings);
      const sum = data.spendings.reduce((acc, curr) => acc + curr.amount, 0);
      setTotal(sum);
    } else {
      toast.error('Error fetching data');
    }
  };

  const deleteSpending = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/spendings`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Remove deleted item from results
        const newResults = results.filter((item) => item._id !== id);
        setResults(newResults);

        // Update total immediately after deletion
        const newTotal = newResults.reduce((acc, curr) => acc + curr.amount, 0);
        setTotal(newTotal);

        toast.success('Spending deleted successfully');
      } else {
        toast.error('Failed to delete spending');
      }
    } catch (err) {
      toast.error('Error occurred during deletion');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      <Navbar />

      <main className="pt-0 px-4 h-[calc(100vh-74px)] overflow-hidden">
        <div className="pt-[55px] flex justify-center items-center h-full max-h-[calc(100vh-74px)]">
          <div className="mb-20 mt-10 w-full max-w-3xl bg-white/10 max-h-[calc(100vh-84px)] min-h-[400px] backdrop-blur-md rounded-xl shadow-lg p-8 text-white flex flex-col overflow-auto">
            <h1 className="text-2xl font-bold mb-6">View Spending History</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-200 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-white/20 bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-200 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-white/20 bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-200 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-white/20 bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur-sm appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="text-black bg-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={fetchHistory}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Fetch History
            </button>

            <div className="mt-6 flex flex-col flex-1 overflow-hidden min-h-[161px]">
              <h2 className="text-lg font-semibold">Total Spent: ₹{total}</h2>

              <div className="mt-4 overflow-y-auto pr-2 custom-scroll flex-1">
                {results.length ? (
                  <ul className="space-y-2 min-h-[90px]">
                    {results.map((item) => (
                      <li
                        key={item._id}
                        className="relative border border-white/20 bg-white/5 rounded-md p-4 text-white min-h-[90px]"
                      >
                        {confirmDeleteId === item._id ? (
                          <div className="absolute top-2 right-2 space-x-2">
                            <button
                              onClick={() => deleteSpending(item._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-sm rounded"
                              disabled={deletingId === item._id}
                            >
                              {deletingId === item._id ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 text-sm rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(item._id)}
                            className="absolute top-2 right-2 hover:text-red-600 p-1"
                            title="Delete Entry"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}

                        <div className="font-medium">₹{item.amount}</div>
                        <div className="text-sm text-gray-300">{item.date}</div>
                        {item.category && (
                          <div className="text-sm text-yellow-200 font-semibold">{item.category}</div>
                        )}
                        {item.description && (
                          <div className="text-sm text-gray-200">{item.description}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex-1 pt-[45px] text-2xl flex items-center justify-center text-center text-gray-400">
                    No spending history available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #333;
          border-radius: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 24px;
        }
      `}</style>
    </>
  );
}
