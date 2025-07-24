import React from "react";

import clsx from "clsx";
import { DevelopButton } from "./DevelopButton";
import TinyProgress from "./TinyProgress";

// CardItem: Oyun kartlarını gösteren ana component
// Her kart için info, seviye, progress, geliştirme butonları ve görsel içerir
// Kullanıcı kartları geliştirebilir, seviye atlatabilir veya max geliştirme yapabilir.

export interface CardItemProps {
  id: string;
  name: string;
  description: string;
  image: string;
  progress: number; // 0-100
  level: number;
  maxLevel: number;
  energyCost: number;
  onUpgrade: (id: string) => void;
  onDevelop?: (id: string) => void; // progress < 100 iken çağrılır
  onDevelopMax?: (id: string) => void; // Bar dolana kadar geliştir
  isMax: boolean;
  energyIconSrc?: string;
  isLoading?: boolean;
}

const LEVEL_BORDER: Record<number, string> = {
  1: "border-[#FFFFFF14]  shadow-[0_0_4px_1px_#FFFFFF]", // beyaz
  2: "border-[#FFC980]  shadow-[0_0_4px_1px_#FFC980]", // sarı
  3: "border-[#4ADE80]  shadow-[0_0_4px_1px_#4ADE80]", // yeşil
};

function getLevelBorder(level: number) {
  if (level >= 3) return LEVEL_BORDER[3];
  if (level === 2) return LEVEL_BORDER[2];
  return LEVEL_BORDER[1];
}

const INNER_SHADOW = { boxShadow: "0px 4.63px 0px 0px #FFFFFF8C inset" };
const BTN_SHADOW =
  "1px 2px 3px 0px #F8F8F8 inset, -1px -1px 2px 0px #5D536B inset, 0px 4px 4px 0px #00000040";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const CardItem: React.FC<CardItemProps> = ({
  id,
  name,
  description,
  image,
  progress,
  level,
  maxLevel,
  energyCost,
  onUpgrade,
  onDevelop,
  onDevelopMax,
  isMax,
  energyIconSrc = "/energy.png",
  isLoading = false,
}) => {
  const pct = clamp(Math.round(progress), 0, 100);
  const isMaxLevel = isMax || level >= maxLevel;
  const canUpgrade = pct >= 100 && !isMaxLevel;
  const canDevelop = pct < 100 && !isMaxLevel;

  const borderColorCls = getLevelBorder(level);

  return (
    <div
      className={clsx(
        "relative rounded-2xl overflow-hidden md:aspect-square aspect-[4/5] transition-all duration-300",
        "border",
        borderColorCls,
        canUpgrade &&
          "ring-2 ring-[#EE39A8]/60 shadow-[0_0_25px_rgba(238,57,168,0.15)]"
      )}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/85" />

      <span className="absolute top-3 right-3 z-20 text-white font-semibold text-sm">
        Seviye {level}
      </span>

      <div className="relative z-10 p-4 flex flex-col h-full">
        <div className="mt-auto flex flex-col gap-3">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              {name}
            </h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
          {isMaxLevel ? null : (
            <div className="flex justify-center h-6">
              <TinyProgress value={pct} />
            </div>
          )}

          <div className="flex items-center gap-3">
            {canDevelop ? (
              <div className="flex flex-col md:flex-row justify-center items-center w-full gap-2 md:gap-3">
                <DevelopButton
                  className="w-full md:flex-1"
                  cost={energyCost}
                  iconSrc={energyIconSrc}
                  disabled={isLoading}
                  onClick={() => onDevelop?.(id)}
                />
                {/* Bar dolana kadar geliştir */}
                <button
                  className={`inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-full px-4 py-1 text-sm font-bold transition-all duration-150 bg-[#FFC980] ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:brightness-110 active:brightness-95"
                  }`}
                  style={INNER_SHADOW}
                  onClick={() => !isLoading && onDevelopMax?.(id)}
                  disabled={isLoading}
                >
                  Max Geliştirme
                </button>
              </div>
            ) : (
              <button
                onClick={() => !isMaxLevel && !isLoading && onUpgrade(id)}
                disabled={isMaxLevel || !canUpgrade || isLoading}
                className={[
                  "flex-1 px-4 py-1 cursor-pointer rounded-full text-sm font-bold transition-all duration-200",
                  isMaxLevel
                    ? "text-white/40 bg-white/5 cursor-not-allowed"
                    : canUpgrade
                    ? "text-white bg-gradient-to-b from-[#FF6FCC] to-[#EE39A8] hover:opacity-90 shadow-[0_0_20px_rgba(238,57,168,0.35)]"
                    : "text-white/40 bg-white/5 cursor-not-allowed",
                ].join(" ")}
                style={
                  !isMaxLevel && canUpgrade
                    ? { boxShadow: BTN_SHADOW }
                    : undefined
                }
              >
                {isMaxLevel ? "Maks Seviye" : "Yükselt"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardItem;
