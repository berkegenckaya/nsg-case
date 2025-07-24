import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

//Kullanıcının itemlerini getirir

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection('users').findOne({ username: 'demo' });
    if (!user) {
      return NextResponse.json([]);
    }
    
    const items = await db.collection('user_items')
      .find({ userId: user._id })
      .project({ cardId: 1, level: 1, progress: 1, _id: 0 })
      .toArray();
      
    return NextResponse.json(items);
  } catch (error) {
    console.error('User items API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user items' },
      { status: 500 }
    );
  }
} 