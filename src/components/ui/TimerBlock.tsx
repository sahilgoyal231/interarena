import { Clock } from "lucide-react";

export const TimerBlock = ({
  timeLeft,
  defaultTime
}: {
  timeLeft: number;
  defaultTime: number;
}) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0)
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const timePercentage = (timeLeft / defaultTime) * 100;
  
  let timerStyle = "bg-zinc-900 border-zinc-800 text-zinc-300";
  if (timePercentage > 50) {
    timerStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  } else if (timePercentage > 20) {
    timerStyle = "bg-amber-500/10 border-amber-500/30 text-amber-400";
  } else {
    timerStyle =
      "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]";
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 font-mono tabular-nums tracking-widest font-bold text-sm px-4 py-1.5 rounded-full border ${timerStyle}`}
    >
      <Clock className="w-4 h-4" />
      {formatTime(timeLeft)}
    </div>
  );
};
