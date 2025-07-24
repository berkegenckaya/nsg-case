"use client";

import React, { useMemo, useState, useEffect } from "react";

import { ITEM_DEFS } from "@/data/items";
import CardList, { CardData } from "@/components/CardList";
import EnergyBar from "@/components/EnergyBar";
import Tabs from "@/components/Tabs";

type TabKey = "all" | "lv1" | "lv2" | "max";

const buildInitialCards = (): CardData[] =>
  Object.values(ITEM_DEFS).map((def) => ({
    id: def.id,
    currentLevel: 1,
    progress: 0,
    maxLevel: def.maxLevel,
    levels: def.levels,
  }));

const HomePage: React.FC = () => {
  const MAX_ENERGY = 100;
  const clampEnergy = (e: number) => Math.max(0, Math.min(MAX_ENERGY, e));
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [nextRegen, setNextRegen] = useState<number | null>(null);
  const [timer, setTimer] = useState<string>("");
  const [cards, setCards] = useState<CardData[]>(buildInitialCards());
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const effEnergy = useMemo(() => clampEnergy(energy), [energy]);

  const shouldRunTimer = useMemo(
    () => effEnergy < MAX_ENERGY && nextRegen !== null,
    [effEnergy, nextRegen]
  );

  // Enerji 100'e çıktığında regen bilgisini sıfırla
  useEffect(() => {
    if (effEnergy >= MAX_ENERGY) {
      setNextRegen(null);
      setTimer("");
    }
  }, [effEnergy]);

  useEffect(() => {
    if (effEnergy >= MAX_ENERGY || !nextRegen) {
      setTimer("");
      return;
    }

    const tick = () => {
      const diff = Math.max(
        0,
        Math.floor(((nextRegen as number) - Date.now()) / 1000)
      );
      const min = Math.floor(diff / 60);
      const sec = diff % 60;
      setTimer(`${min}:${sec.toString().padStart(2, "0")}`);
      if (diff <= 0) {
        fetchEnergy();
      }
    };

    tick(); // ilk anda da göster
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [effEnergy, nextRegen]);

  // Fetch energy from API
  const fetchEnergy = async () => {
    const res = await fetch("/api/energy");
    const data = await res.json();
    setEnergy(clampEnergy(data.energy ?? 0));
    setNextRegen(data.nextRegen ?? null);
  };
  // Fetch user items from API (new)
  const fetchUserItems = async () => {
    const res = await fetch("/api/user-items");
    const data = await res.json();
    setCards(
      Object.values(ITEM_DEFS).map((def) => {
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

  // Toast otomatik kapanma
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (activeTab === "all") return true;
      if (activeTab === "max") return card.currentLevel === card.maxLevel;
      const lv = Number(activeTab.replace("lv", ""));
      return card.currentLevel === lv;
    });
  }, [cards, activeTab]);

  const handleDevelop = async (id: string) => {
    if (effEnergy === 0) {
      setToast({ message: "Enerji yetersiz. Lütfen bekleyin veya enerjiyi yenileyin.", type: 'error' });
      return;
    }
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: id }),
    });
    const data = await res.json();
    setEnergy(clampEnergy(data.energy ?? 0));
    setNextRegen(data.nextRegen ?? null);
    await fetchUserItems();
  };

  const handleDevelopMax = async (id: string) => {
    if (effEnergy === 0) {
      setToast({ message: "Enerji yetersiz. Lütfen bekleyin veya enerjiyi yenileyin.", type: 'error' });
      return;
    }
    const res = await fetch("/api/progress-max", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: id }),
    });
    const data = await res.json();
    setEnergy(clampEnergy(data.energy ?? 0));
    setNextRegen(data.nextRegen ?? null);
    await fetchUserItems();
  };

  const handleUpgrade = async (id: string) => {
    const res = await fetch("/api/level-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: id }),
    });
    const data = await res.json();
    setEnergy(clampEnergy(data.energy ?? 0));
    setNextRegen(data.nextRegen ?? null);
    await fetchUserItems();
  };

  const handleReset = async () => {
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        await fetchUserItems();
        fetchEnergy();
      }
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#111118] to-[#353345] py-8 px-2">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors duration-200 shadow-lg"
        >
          Reset Demo
        </button>
      </div>
      <div className="flex flex-col items-center w-full">
        <EnergyBar
          current={effEnergy}
          max={MAX_ENERGY}
          timer={
            effEnergy < MAX_ENERGY 
              ? `Yenilenmesine kalan: ${timer}`
              : ""
          }
        />
        <Tabs active={activeTab} onChange={(t) => setActiveTab(t as TabKey)} />
        <CardList
          cards={filteredCards}
          onUpgrade={handleUpgrade}
          onDevelop={handleDevelop}
          onDevelopMax={handleDevelopMax}
        />
      </div>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
