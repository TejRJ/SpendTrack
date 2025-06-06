import { hash } from "bcrypt";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json({ message: "Username and password required." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("spendtrack");

    const existing = await db.collection("users").findOne({ username });
    if (existing) {
      return Response.json({ message: "Username already exists." }, { status: 400 });
    }

    const hashed = await hash(password, 10);
    await db.collection("users").insertOne({ username, password: hashed });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
