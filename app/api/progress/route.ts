import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

//Item geliştirme işlemi ama tek tek geliştirme yapılır

export async function POST(req: NextRequest) {
  try {
    const { cardId } = await req.json();
    if (!cardId) {
      return NextResponse.json({ error: "cardId required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Demo için username 'demo'
    const user = await db.collection("users").findOne({ username: "demo" });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const userItem = await db
      .collection("user_items")
      .findOne({ userId: user._id, cardId });
      
    if (!userItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    
    if (userItem.progress >= 100) {
      return NextResponse.json({
        progress: userItem.progress,
        energy: user.energy,
      });
    }
    
    if (user.energy <= 0) {
      return NextResponse.json({
        progress: userItem.progress,
        energy: user.energy,
      });
    }
    
    //Atomic operation kullanılarak race condition önlenir
    const result = await db.collection("users").findOneAndUpdate(
      { _id: user._id, energy: { $gt: 0 } },
      { $inc: { energy: -1 } },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json({
        progress: userItem.progress,
        energy: user.energy,
      });
    }
    
    const newProgress = Math.min(userItem.progress + 2, 100);
    await db
      .collection("user_items")
      .updateOne({ _id: userItem._id }, { $set: { progress: newProgress } });
      
    return NextResponse.json({ progress: newProgress, energy: result.energy });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
