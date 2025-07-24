import React from "react";
import CardItem from "./CardItem";

// CardList: Kartların grid layout'ta listelendiği container component
// CardData array'ini alıp her kart için CardItem render eder
// Seviye meta verilerini resolve eder ve kartların durumunu yönetir

export interface CardLevelMeta {
  level: number;
  name: string;
  description: string;
  image: string;
  energyCost: number;
}

export interface CardData {
  id: string;
  currentLevel: number; // 1
  progress: number;     // 0-100
  maxLevel: number;
  levels: Record<number, CardLevelMeta>;
}

interface CardListProps {
  cards: CardData[];
  onUpgrade: (id: string) => void;
  onDevelop?: (id: string) => void;
  onDevelopMax?: (id: string) => void;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

function resolveLevelMeta(card: CardData): CardLevelMeta {
  const lvl = clamp(card.currentLevel, 1, card.maxLevel);
  return (
    card.levels[lvl] ??
    card.levels[card.maxLevel] ??
    Object.values(card.levels).sort((a, b) => a.level - b.level).at(-1)!
  );
}

const CardList: React.FC<CardListProps> = ({ cards, onUpgrade, onDevelop, onDevelopMax }) => {
  if (!cards?.length)
    return (
      <div className="w-full text-center text-white/60 py-10">
        No cards to display.
      </div>
    );

  return (
    <div className="grid grid-cols-2  md:grid-cols-3 gap-4 w-full max-w-[430px] md:max-w-5xl mx-auto mt-4">
      {cards.map((card) => {
        const meta = resolveLevelMeta(card);
        const lvl = clamp(card.currentLevel, 1, card.maxLevel);
        const isMax = lvl >= card.maxLevel;

        return (
          <CardItem
            key={`${card.id}-${lvl}`}
            id={card.id}
            name={meta.name}
            description={meta.description}
            image={meta.image}
            progress={clamp(card.progress, 0, 100)}
            level={lvl}
            maxLevel={card.maxLevel}
            energyCost={meta.energyCost}
            isMax={isMax}
            onUpgrade={onUpgrade}
            onDevelop={onDevelop}
            onDevelopMax={onDevelopMax}
          />
        );
      })}
    </div>
  );
};

export default CardList;
