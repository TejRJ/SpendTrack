import clientPromise from '@/app/lib/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const category = searchParams.get('category');

  if (!start || !end) {
    return Response.json({ success: false, message: 'Missing dates' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('spendtrack');

    const query = {
      username: session.user.name, 
      date: { $gte: start, $lte: end },
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    const spendings = await db.collection('spendings').find(query).toArray();
    return Response.json({ success: true, spendings });
  } catch (err) {
    console.error('GET error:', err);
    return Response.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
