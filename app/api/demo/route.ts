import clientPromise from '@/lib/mongodb';
import { ITEM_DEFS } from '@/data/items';
import { NextRequest, NextResponse } from 'next/server';

// Demo için kullanıcıyı sıfırla ve itemleri oluşturur

export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db();

  // Silme işlemi
  await db.collection('users').deleteMany({ username: 'demo' });

  // Oluşturma işlemi
  const userRes = await db.collection('users').insertOne({ username: 'demo', energy: 100 });
  const userId = userRes.insertedId;

  // Eski user_items silme işlemi
  await db.collection('user_items').deleteMany({ userId });

  // Her item için user_items oluşturma işlemi
  const items = Object.values(ITEM_DEFS);
  await db.collection('user_items').insertMany(
    items.map(item => ({
      userId,
      cardId: item.id,
      level: 1,
      progress: 0,
    }))
  );

  return NextResponse.json({ ok: true });
}