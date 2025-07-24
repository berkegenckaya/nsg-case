import React from "react";
import clsx from "clsx";

// Tabs: Seviye seçmek ve filtrelemek için kullanılan component
// Kullanıcı seviye seçebilir
// Aktif seviye gösterilir
// Tüm seviyeler, Sv1, Sv2 ve Max Sv seçenekleri vardır

interface TabsProps {
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}

const tabList = [
  { key: "all", label: "Tüm Seviyeler" },
  { key: "lv1", label: "Sv1" },
  { key: "lv2", label: "Sv2" },
  { key: "max", label: "Max Sv" },
];

const Tabs: React.FC<TabsProps> = ({ active, onChange, className }) => {
  const count = tabList.length;
  const activeIndex = Math.max(0, tabList.findIndex((t) => t.key === active));
  const segmentWidth = 100 / count;
  const left = `${activeIndex * segmentWidth}%`;

  return (
    <div
      className={clsx(
        "relative w-full max-w-xl mx-auto h-12 px-1",
        "rounded-full border-[3px] border-[#FFFFFF4D] bg-[#111216] flex items-center",
        className
      )}
    >
      {/* Aktif tab */}
      <div
        className="absolute top-1 bottom-1 rounded-full bg-[#FFC980] transition-all duration-200 ease-out"
        style={{
          width: `${segmentWidth}%`,
          left,
          boxShadow: "0px 4.63px 0px 0px #FFFFFF8C inset",
        }}
      />

      {/* Butonlar */}
      <div className="relative z-10 grid grid-cols-4 w-full h-full">
        {tabList.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={clsx(
                "text-sm md:text-base font-semibold flex items-center justify-center rounded-full transition-colors duration-150",
                isActive ? "text-[#111216]" : "text-gray-400"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
