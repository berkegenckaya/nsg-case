import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Item seviyesini artırır

const MAX_ENERGY = 100;
const REGEN_INTERVAL = 30 * 1000; // 30 seconds in ms

export async function POST(req: NextRequest) {
  try {
    const { cardId } = await req.json();
    if (!cardId) {
      return NextResponse.json({ error: 'cardId required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Demo için username 'demo'
    const user = await db.collection('users').findOne({ username: 'demo' });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    //Atomic operation kullanılarak race condition önlenir
    const result = await db.collection('user_items').findOneAndUpdate(
      { userId: user._id, cardId, progress: { $gte: 100 } },
      { $inc: { level: 1 }, $set: { progress: 0 } },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json({ error: 'Item not found or progress not 100' }, { status: 400 });
    }
    
    // nextRegen hesapla
    const now = Date.now();
    let nextRegen = null;
    
    if (user.energy < MAX_ENERGY) {
      const lastUpdate = user.lastEnergyUpdate || now;
      nextRegen = lastUpdate + REGEN_INTERVAL;
    }
    
    return NextResponse.json({ level: result.level, progress: 0, energy: user.energy, nextRegen });
  } catch (error) {
    console.error('Level-up API error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade item' },
      { status: 500 }
    );
  }
} 