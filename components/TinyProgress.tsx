


// TinyProgress: Enerji barını gösteren component
//  Item geliştirme barını gösterir
// Geliştirme barının yüzdesini hesaplar ve gösterir


// Barın içinde gösterilen yüzde
const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));

export default function TinyProgress({ value }: { value: number }) {
    const pct = clamp(Math.round(value), 0, 100);
    return (
      <div className="relative flex-1 h-full shadow-[0_0_4px_1px_#F8B0DC] rounded-full bg-[#1E1E24] overflow-hidden px-2 py-1">
     
        <div
          className="absolute    shadow-[0_0_4px_1px_#F8B0DC]  left-2 right-2 h-4 bg-gradient-to-r from-[#FF37B7] via-[#FF4CCB] to-[#FF82E4] transition-all duration-300 rounded-full"
          style={{ width: `calc(${pct}% - 1rem)` }}
        />
      
        <span className="absolute  inset-0 flex items-center justify-center text-white font-semibold text-sm">
          %{pct}
        </span>
       
        <div className="absolute inset-0 rounded-full pointer-events-none shadow-[0_0_24px_5px_#F8B0DC33]" />
      </div>
    );
  }