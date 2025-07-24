import React from "react";
import clsx from "clsx";
import Image from "next/image";

// EnergyBar: Enerji barını gösteren component
// Kullanıcının enerji durumunu gösterir
// Enerji barının yüzdesini hesaplar ve gösterir
// Timer ile enerji barının süresini gösterir



interface EnergyBarProps {
  current: number;
  max: number;
  timer?: string;
  className?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const EnergyBar: React.FC<EnergyBarProps> = ({
  current,
  max,
  timer,
  className,
}) => {
  const percent = clamp(Math.round((current / max) * 100), 0, 100);

  return (
    <div
      className={clsx(
        "relative w-full md:max-w-[860px] max-w-full mx-auto py-4 px-2 rounded-2xl",
        className
      )}
    >
     
      <div className="flex items-center justify-between ">
        <div className="absolute mt-16 -ml-4 z-10">
          <Image src="/energy.png" alt="Energy" width={70} height={70} />
        </div>
        <span className="font-bold text-[#FFC980] ml-16 text-xl">Enerji</span>
        <div className="flex text-sm text-[#5B5B60] mr-8 items-center gap-3 top-2">
       {timer && (
            <span className=" ">
              {timer}
            </span>
          )}
        </div>
      </div>

      
      <div className="px-4 py-2">
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className={clsx(
            "relative max-h-[48px] h-6 md:h-7 p-[5px] rounded-full overflow-hidden bg-[#1B1C22]",
            "shadow-[0_0_4px_1px_#F8B0DC]"
          )}
        >
          
          <div
            className={clsx(
              "h-full max-h-[24px] rounded-full transition-all duration-300",
              "bg-gradient-to-r from-[#FF37B7] via-[#FF4CCB] to-[#FF82E4]",
              "shadow-[0_0_1px_1px_#F8B0DC]"
            )}
            style={{ width: `${percent}%` }}
          />
      
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 font-semibold text-[#EE39A8] text-lg  px-2 py-0.5 rounded-full shadow"
          >
            %{percent}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnergyBar;
