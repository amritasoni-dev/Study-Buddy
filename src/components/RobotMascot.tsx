import React, { useState } from 'react';
import { Sparkles, Heart, RefreshCw, Volume2, ShieldCheck, Zap } from 'lucide-react';

interface RobotMascotProps {
  urgentAlertCount?: number;
  upcomingTestTitle?: string;
}

const MOTIVATIONAL_QUOTES = [
  "You are capable of mastering tough subjects—one concept at a time!",
  "Take deep breaths! Consistent study beats last-minute cramming every time.",
  "Remember to drink water, stretch your back, and take healthy screen breaks!",
  "Big goals are just small daily to-dos added together. Let's conquer today!",
  "Mistakes in practice are just brain muscles growing. Keep going!",
  "Your future self will thank you for the focus you put in today!"
];

export const RobotMascot: React.FC<RobotMascotProps> = ({
  urgentAlertCount = 1,
  upcomingTestTitle = "Data Structures Midterm",
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isWavingFast, setIsWavingFast] = useState(false);
  const [showCheer, setShowCheer] = useState(false);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    setIsWavingFast(true);
    setShowCheer(true);
    setTimeout(() => {
      setIsWavingFast(false);
      setShowCheer(false);
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-pink-100 to-yellow-100 p-4 md:p-6 shadow-md border-2 border-pink-300/80 mb-6 transition-all hover:shadow-lg">
      {/* Background cute decorative shapes */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-300/30 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-300/30 rounded-full blur-xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center gap-5 justify-between">
        
        {/* Left: Animated Robot Graphic */}
        <div className="flex items-center gap-4 cursor-pointer group" onClick={nextQuote} title="Click Buddy for a high five & motivation!">
          <div className="relative animate-gentle-hover flex-shrink-0">
            {/* Robot SVG with Animated Waving Hand */}
            <svg
              className="w-24 h-24 md:w-28 md:h-28 drop-shadow-md"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Antenna */}
              <line x1="80" y1="36" x2="80" y2="18" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="14" r="7" fill="#F59E0B" className="animate-antenna-blink" />

              {/* Ears / Headphone puffs (Pink & Yellow) */}
              <rect x="24" y="52" width="10" height="26" rx="5" fill="#EC4899" />
              <rect x="126" y="52" width="10" height="26" rx="5" fill="#F59E0B" />
              <path d="M28 54 C28 28, 132 28, 132 54" stroke="#FB7185" strokeWidth="3" fill="none" />

              {/* Head Base */}
              <rect x="32" y="34" width="96" height="64" rx="20" fill="#FFFBEB" stroke="#F43F5E" strokeWidth="3.5" />
              
              {/* Head Visor / Face Screen */}
              <rect x="42" y="44" width="76" height="42" rx="14" fill="#1E1B4B" />

              {/* Rosy Cheeks */}
              <circle cx="50" cy="74" r="5" fill="#FB7185" opacity="0.8" />
              <circle cx="110" cy="74" r="5" fill="#FB7185" opacity="0.8" />

              {/* Eyes (Happy curved or glowing) */}
              <ellipse cx="60" cy="62" rx="7" ry="8" fill="#FDE047" />
              <circle cx="62" cy="60" r="3" fill="#1E1B4B" />
              <ellipse cx="100" cy="62" rx="7" ry="8" fill="#FDE047" />
              <circle cx="98" cy="60" r="3" fill="#1E1B4B" />

              {/* Cute smiling mouth */}
              <path d="M72 72 Q80 80 88 72" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Neck */}
              <rect x="72" y="98" width="16" height="8" rx="3" fill="#FCD34D" />

              {/* Body */}
              <rect x="44" y="104" width="72" height="48" rx="16" fill="#FCE7F3" stroke="#F43F5E" strokeWidth="3.5" />
              
              {/* Screen on tummy with Heart & Pulse */}
              <rect x="56" y="112" width="48" height="26" rx="8" fill="#FFF" stroke="#F472B6" strokeWidth="2" />
              <path d="M66 125 L73 125 L76 118 L80 131 L84 125 L94 125" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="88" cy="119" r="2.5" fill="#F59E0B" />

              {/* Left Hand (resting nicely) */}
              <g>
                <path d="M44 116 C32 122 30 134 38 140" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" fill="none" />
                <circle cx="38" cy="140" r="5" fill="#FBBF24" />
              </g>

              {/* Right Arm & Hand - Animated Moving / Waving Hand */}
              <g
                className={isWavingFast ? 'animate-bounce' : 'animate-waving-hand'}
                style={{
                  transformOrigin: '116px 116px',
                }}
              >
                {/* Arm bending upward in wave */}
                <path d="M116 116 C128 108 136 94 130 80" stroke="#F43F5E" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                {/* Waving Paw / Hand */}
                <circle cx="130" cy="78" r="9" fill="#FBBF24" stroke="#F43F5E" strokeWidth="2.5" />
                {/* Cute little waving fingers / lines */}
                <line x1="126" y1="71" x2="124" y2="67" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                <line x1="130" y1="69" x2="130" y2="65" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                <line x1="134" y1="71" x2="136" y2="67" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
              </g>
            </svg>

            {/* Tap Buddy badge */}
            <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-yellow-600 shadow-xs flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" /> Tap me!
            </span>
          </div>

          {/* Welcome Speech Bubble */}
          <div className="flex flex-col">
            <div className="relative bg-white/90 backdrop-blur-xs px-4 py-3 rounded-2xl rounded-tl-xs border-2 border-pink-400 shadow-xs max-w-md">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-300 text-yellow-900 border border-yellow-400 shadow-2xs">
                  Buddy Bot
                </span>
                <span className="text-xs text-pink-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Online & Cheering for You!
                </span>
              </div>

              {/* Exact user requested greeting in italic writing */}
              <h1 className="text-xl md:text-2xl font-bold font-shantell italic text-pink-700 tracking-tight mt-1">
                “Hello student i m your Buddy!!”
              </h1>

              {/* Rotating quote in italic */}
              <p className="text-xs md:text-sm text-stone-700 italic font-medium mt-1 transition-opacity duration-300 leading-snug">
                "{MOTIVATIONAL_QUOTES[quoteIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Alert Highlights & Cheerful Student Status */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 md:gap-1.5">
          {urgentAlertCount > 0 && (
            <div className="flex items-center gap-2 bg-pink-500/10 text-pink-700 px-3 py-1.5 rounded-xl border border-pink-300 text-xs font-semibold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
              </span>
              <span>Next Up: <em className="not-italic font-bold text-pink-800">{upcomingTestTitle}</em></span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={nextQuote}
              className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-yellow-950 rounded-xl text-xs font-bold border border-yellow-500 flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>More Motivation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
