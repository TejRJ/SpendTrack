import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { date, amount, description, category } = await req.json();
    const client = await clientPromise;
    const db = client.db("spendtrack");

    await db.collection("spendings").insertOne({
      username: session.user.name, // 👈 associate spending with user
      date,
      amount: parseFloat(amount),
      description,
      category,
      createdAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("POST error:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("spendtrack");

    const result = await db.collection("spendings").deleteOne({
      _id: new ObjectId(id),
      username: session.user.name, 
    });

    if (result.deletedCount === 1) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, message: "Not found or unauthorized" }, { status: 404 });
    }
  } catch (err) {
    console.error("DELETE error:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
