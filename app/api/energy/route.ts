import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

//Kullanıcının enerjisini getirir ve yenileme zamanını hesaplar

const MAX_ENERGY = 100;
const REGEN_INTERVAL = 30 * 1000; // 30 seconds in ms

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Demo için username 'demo' authentication olsaydı ona uygun bir şekilde değiştirilirdi
    const user = await db.collection('users').findOne({ username: 'demo' });
    const now = Date.now();
    
    if (!user) {
      return NextResponse.json({ energy: 0, nextRegen: now + REGEN_INTERVAL });
    }

    let lastUpdate = user.lastEnergyUpdate;
    let energy = user.energy;
    let regenCount = 0;
    let nextRegen = null;

    // Eğer lastEnergyUpdate yoksa, doğru yenileme için başlangıç değerini ayarla
    if (!lastUpdate) {
      lastUpdate = energy < MAX_ENERGY
        ? now - (MAX_ENERGY - energy) * REGEN_INTERVAL
        : now;
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { lastEnergyUpdate: lastUpdate } }
      );
    }

    if (energy < MAX_ENERGY) {
      const elapsed = now - lastUpdate;
      regenCount = Math.floor(elapsed / REGEN_INTERVAL);
      if (regenCount > 0) {
        energy = Math.min(energy + regenCount, MAX_ENERGY);
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              energy,
              lastEnergyUpdate: energy === MAX_ENERGY ? now : lastUpdate + regenCount * REGEN_INTERVAL,
            },
          }
        );
      }
      nextRegen = (energy === MAX_ENERGY)
        ? null
        : (lastUpdate + (regenCount + 1) * REGEN_INTERVAL);
    } else if (energy >= MAX_ENERGY) {
      // Enerji zaten maksimumda ise güncelleme yapma, sadece mevcut değeri döndür
      nextRegen = null;
      // lastEnergyUpdate'i güncelleme - bu zamanlama karışıklığını önler
    }

    return NextResponse.json({ energy, nextRegen });
  } catch (error) {
    console.error('Energy API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch energy data' },
      { status: 500 }
    );
  }
} 