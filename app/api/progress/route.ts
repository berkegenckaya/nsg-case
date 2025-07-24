import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

//Item geliştirme işlemi ama tek tek geliştirme yapılır

const MAX_ENERGY = 100;
const REGEN_INTERVAL = 30 * 1000; // 30 seconds in ms

export async function POST(req: NextRequest) {
  try {
    const { cardId } = await req.json();
    if (!cardId) {
      return NextResponse.json({ error: "cardId required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    const mongoSession = client.startSession();
    
    let responsePayload: any;
    
    await mongoSession.withTransaction(async () => {
    
    // Demo için username 'demo'
    const user = await db.collection("users").findOne({ username: "demo" }, { projection: { _id: 1, energy: 1, lastEnergyUpdate: 1 } });
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    
    const userItem = await db
      .collection("user_items")
      .findOne({ userId: user._id, cardId });
      
    if (!userItem) {
      throw new ErrorWithStatus("Item not found", 404);
    }
    
    const nextRegen = user.energy < MAX_ENERGY ? (user.lastEnergyUpdate || Date.now()) + REGEN_INTERVAL : null;
    
    if (userItem.progress >= 100) {
      responsePayload = {
        progress: userItem.progress,
        energy: Math.min(user.energy, MAX_ENERGY),
        nextRegen,
      };
      return;
    }
    
    if (user.energy <= 0) {
      responsePayload = {
        progress: userItem.progress,
        energy: Math.min(user.energy, MAX_ENERGY),
        nextRegen,
      };
      return;
    }
    
    //Atomic operation kullanılarak race condition önlenir
    const result = await db.collection("users").findOneAndUpdate(
      { _id: user._id, energy: { $gt: 0 } },
      { $inc: { energy: -1 } },
      { returnDocument: 'after', session: mongoSession }
    );
    
    if (!result) {
      responsePayload = {
        progress: userItem.progress,
        energy: Math.min(user.energy, MAX_ENERGY),
        nextRegen,
      };
      return;
    }
    
    const newProgress = Math.min(userItem.progress + 2, 100);
    await db
      .collection("user_items")
      .updateOne(
        { _id: userItem._id }, 
        { $set: { progress: newProgress, updatedAt: new Date() } },
        { session: mongoSession }
      );
      
    responsePayload = {
      progress: newProgress,
      energy: Math.min(result.energy, MAX_ENERGY),
      nextRegen: result.energy < MAX_ENERGY ? (user.lastEnergyUpdate || Date.now()) + REGEN_INTERVAL : null,
    };
    });
    
    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

class ErrorWithStatus extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
