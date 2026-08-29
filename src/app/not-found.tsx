import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay z-0" />
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          404
        </h1>
        <h2 className="text-2xl font-bold tracking-widest uppercase text-zinc-300">
          Target Not Found
        </h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          The quadrant you are attempting to access does not exist in this sector.
        </p>
        <Link 
          href="/home" 
          replace
          className="mt-8 px-8 py-3 bg-zinc-900 text-zinc-300 font-bold uppercase tracking-widest rounded-xl hover:bg-purple-900/40 hover:text-purple-300 hover:border-purple-500/50 transition-all border border-zinc-800 flex items-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          Return to System Root
        </Link>
      </div>
    </div>
  );
}
