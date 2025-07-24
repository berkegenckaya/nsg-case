import React from "react";

// DevelopButton: Geliştirme butonu component
// Geliştirme için enerji maliyetini gösterir
// Kullanıcı geliştirme yapabilir veya geliştirme yapamazsa buton pasif hale gelir

type DevelopButtonProps = {
  cost: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  iconSrc?: string; 
};

const DEVELOP_SHADOW =
  "1px 2px 3px 0px #F8F8F8 inset, -1px -1px 2px 0px #5D536B inset, 0px 4px 4px 0px #00000040";

export const DevelopButton: React.FC<DevelopButtonProps> = ({
  cost,
  onClick,
  disabled,
  className,
  iconSrc = "/energy.png",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex cursor-pointer  items-center justify-center gap-2 rounded-full px-4 py-1",
        "text-sm font-bold transition-all duration-150",
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:brightness-110 active:brightness-95",
        "bg-[#FFC980]",
        className || "",
      ].join(" ")}
      style={{ boxShadow: DEVELOP_SHADOW }}
    >
      <img src={iconSrc} alt="energy" className="w-5 h-5" />
      <span className="text-[#EE39A8]">-{cost}</span>
      <span className="text-[#111216] font-extrabold">Geliştir</span>
    </button>
  );
};
