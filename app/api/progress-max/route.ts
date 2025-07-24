import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

// Item geliştirme işlemi ama tümünü geliştirir. 
// Tüm enerjileir item max olana kadar harcar. (sadece o seviye için)

const MAX_PROGRESS = 100;
const COST_PER_CLICK = 1;
const PER_CLICK = 2;
const REGEN_INTERVAL = 30 * 1000; // 30 seconds in ms

const Body = z.object({
  cardId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const parse = Body.safeParse(await req.json());
    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid body", issues: parse.error.format() },
        { status: 422 }
      );
    }

    const { cardId } = parse.data;

  
    const username = "demo";

    const client = await clientPromise;
    const db = client.db();
    const mongoSession = client.startSession();

    let responsePayload: any;

    await mongoSession.withTransaction(async () => {
      // Projection ile sadece gereken alanları çekiyoruz
      const user = await db
        .collection("users")
        .findOne({ username }, { projection: { _id: 1, energy: 1 } });

      if (!user)
        throw new ErrorWithStatus("User not found", 404);

      const userItem = await db.collection("user_items").findOne(
        { userId: user._id, cardId },
        { projection: { _id: 1, progress: 1 } }
      );

      if (!userItem)
        throw new ErrorWithStatus("Item not found", 404);

      // Tek seferde kaç click atılabilir önceden hesapla
      const clicksTo100 = Math.ceil(
        (MAX_PROGRESS - userItem.progress) / PER_CLICK
      );
      const clicksWeCanAfford = Math.floor(user.energy / COST_PER_CLICK);
      const clicks = Math.max(0, Math.min(clicksTo100, clicksWeCanAfford));

      const progressGain = clicks * PER_CLICK;
      const energySpent = clicks * COST_PER_CLICK;

      const newProgress = Math.min(
        MAX_PROGRESS,
        userItem.progress + progressGain
      );
      const newEnergy = user.energy - energySpent;

      // Hiç ilerleme olmayacaksa kapat
      if (clicks === 0) {
        responsePayload = {
          progress: userItem.progress,
          energy: user.energy,
          progressGain: 0,
          energySpent: 0,
        };
        return;
      }

      await db
        .collection("user_items")
        .updateOne(
          { _id: userItem._id },
          {
            $set: { progress: newProgress, updatedAt: new Date() },
            $inc: { totalClicks: clicks },
          },
          { session: mongoSession }
        );

      await db
        .collection("users")
        .updateOne(
          { _id: user._id },
          {
            $set: { energy: newEnergy, updatedAt: new Date() },
          },
          { session: mongoSession }
        );

      responsePayload = {
        progress: newProgress,
        energy: newEnergy,
        progressGain,
        energySpent,
        nextRegen: newEnergy < MAX_PROGRESS ? (user.lastEnergyUpdate || Date.now()) + REGEN_INTERVAL : null,
      };
    });

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status }
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
