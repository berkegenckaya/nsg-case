'use client';

import React, { useMemo, useState, useEffect } from 'react';

import { ITEM_DEFS } from '@/data/items';
import CardList, { CardData } from '@/components/CardList';
import EnergyBar from '@/components/EnergyBar';
import Tabs from '@/components/Tabs';


const MAX_ENERGY = 100;
type TabKey = 'all' | 'lv1' | 'lv2' | 'max';

const buildInitialCards = (): CardData[] =>
  Object.values(ITEM_DEFS).map(def => ({
    id: def.id,
    currentLevel: 1,
    progress: 0,
    maxLevel: def.maxLevel,
    levels: def.levels,
  }));

const HomePage: React.FC = () => {
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [nextRegen, setNextRegen] = useState<number | null>(null);
  const [timer, setTimer] = useState<string>('');
  const [cards, setCards] = useState<CardData[]>(buildInitialCards());
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  // Fetch energy from API
  const fetchEnergy = async () => {
    const res = await fetch('/api/energy');
    const data = await res.json();
    setEnergy(data.energy);
    setNextRegen(data.nextRegen ?? null);
  };

  // Fetch user items from API (new)
  const fetchUserItems = async () => {
    const res = await fetch('/api/user-items');
    const data = await res.json();
    setCards(
      Object.values(ITEM_DEFS).map(def => {
        const userItem = data.find((item: any) => item.cardId === def.id);
        return {
          id: def.id,
          currentLevel: userItem ? userItem.level : 1,
          progress: userItem ? userItem.progress : 0,
          maxLevel: def.maxLevel,
          levels: def.levels,
        };
      })
    );
  };

  useEffect(() => {
    fetchEnergy();
    fetchUserItems();
  }, []);

  // Countdown timer for next energy regen
  useEffect(() => {
    if (!nextRegen) {
      setTimer('');
      return;
    }
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((nextRegen - now) / 1000));
      const min = Math.floor(diff / 60);
      const sec = diff % 60;
      setTimer(`${min}:${sec.toString().padStart(2, '0')}`);
      if (diff <= 0) {
        fetchEnergy();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextRegen]);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (activeTab === 'all') return true;
      if (activeTab === 'max') return card.currentLevel === card.maxLevel;
      const lv = Number(activeTab.replace('lv', ''));
      return card.currentLevel === lv;
    });
  }, [cards, activeTab]);

  const handleDevelop = async (id: string) => {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: id }),
    });
    await fetchUserItems();
    fetchEnergy();
  };

  const handleDevelopMax = async (id: string) => {
    const res = await fetch('/api/progress-max', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: id }),
    });
    await fetchUserItems();
    fetchEnergy();
  };

  const handleUpgrade = async (id: string) => {
    const res = await fetch('/api/level-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: id }),
    });
    await fetchUserItems();
    fetchEnergy();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#111118] to-[#353345] py-8 px-2">
      <div className="flex flex-col items-center w-full">
        <EnergyBar current={energy} max={MAX_ENERGY} timer={timer ? `%1 Yenilenmesine Kalan: ${timer}` : ''} />
        <Tabs active={activeTab} onChange={(t) => setActiveTab(t as TabKey)} />
        <CardList cards={filteredCards} onUpgrade={handleUpgrade} onDevelop={handleDevelop} onDevelopMax={handleDevelopMax} />
      </div>
    </main>
  );
};

export default HomePage;
