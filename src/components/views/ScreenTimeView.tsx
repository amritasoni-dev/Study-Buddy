import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Heart,
  Eye,
  Smile,
  Zap,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { ScreenTimeStats } from '../../types/student';

interface ScreenTimeViewProps {
  stats: ScreenTimeStats;
  setStats: React.Dispatch<React.SetStateAction<ScreenTimeStats>>;
  liveMinutes: number;
}

export const ScreenTimeView: React.FC<ScreenTimeViewProps> = ({
  stats,
  setStats,
  liveMinutes,
}) => {
  // Focus Pomodoro Timer states
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(stats.focusSessionsCompleted || 2);

  // Web Audio chime player
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playChime();
      setIsRunning(false);
      if (pomodoroMode === 'focus') {
        setCompletedSessions((prev) => prev + 1);
        setStats((prev) => ({
          ...prev,
          focusSessionsCompleted: prev.focusSessionsCompleted + 1,
        }));
        setPomodoroMode('shortBreak');
        setTimeLeft(5 * 60);
      } else {
        setPomodoroMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, pomodoroMode, setStats]);

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setPomodoroMode(mode);
    if (mode === 'focus') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (pomodoroMode === 'focus') setTimeLeft(25 * 60);
    if (pomodoroMode === 'shortBreak') setTimeLeft(5 * 60);
    if (pomodoroMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTimerString = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Screen time breakdown numbers (in minutes)
  const appTime = liveMinutes;
  const toolsTime = stats.todayToolsMinutes || 135;
  const lecturesTime = 80;
  const breaksTime = stats.todayBreaksMinutes || 40;
  const totalScreenTime = appTime + toolsTime + lecturesTime + breaksTime;

  const totalHrs = Math.floor(totalScreenTime / 60);
  const totalMins = totalScreenTime % 60;

  const appPercent = Math.round((appTime / totalScreenTime) * 100) || 20;
  const toolsPercent = Math.round((toolsTime / totalScreenTime) * 100) || 40;
  const lecturesPercent = Math.round((lecturesTime / totalScreenTime) * 100) || 25;
  const breaksPercent = Math.round((breaksTime / totalScreenTime) * 100) || 15;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-yellow-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-yellow-400 text-yellow-950 font-bold">
              <Clock className="w-5 h-5 text-pink-600" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
              Student Screen Time & Focus Monitor ⏱️
            </h2>
          </div>
          <p className="text-xs md:text-sm text-stone-600 italic mt-1">
            Track healthy screen habits, monitor productive study hours vs breaks, and use the built-in Pomodoro focus timer!
          </p>
        </div>

        <div className="p-3 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-2xl border border-pink-200 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Screen Time Today
            </span>
            <span className="text-xl font-black font-mono text-pink-700">
              {totalHrs}h {totalMins}m
            </span>
          </div>
          <div className="w-2.5 h-10 rounded-full bg-pink-400 animate-pulse" />
        </div>
      </div>

      {/* Screen Time Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* App Screen Time */}
        <div className="bg-white rounded-3xl p-4 border-2 border-pink-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-bold text-pink-700 font-shantell italic">Student Buddy App</span>
            <span className="font-mono font-bold text-stone-700">{appPercent}%</span>
          </div>
          <div className="text-2xl font-black font-mono text-pink-700">
            {Math.floor(appTime / 60)}h {appTime % 60}m
          </div>
          <p className="text-[11px] text-stone-500 italic mt-1">Active planner & task sessions</p>
          <div className="w-full h-2 bg-pink-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full" style={{ width: `${appPercent}%` }} />
          </div>
        </div>

        {/* Study Tools & Research */}
        <div className="bg-white rounded-3xl p-4 border-2 border-yellow-300 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-bold text-yellow-950 font-shantell italic">Study Tools & AI</span>
            <span className="font-mono font-bold text-stone-700">{toolsPercent}%</span>
          </div>
          <div className="text-2xl font-black font-mono text-yellow-950">
            {Math.floor(toolsTime / 60)}h {toolsTime % 60}m
          </div>
          <p className="text-[11px] text-stone-500 italic mt-1">Brainly, Gemini, ChatGPT research</p>
          <div className="w-full h-2 bg-yellow-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${toolsPercent}%` }} />
          </div>
        </div>

        {/* Video Lectures */}
        <div className="bg-white rounded-3xl p-4 border-2 border-blue-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-bold text-blue-700 font-shantell italic">Lectures & Tutorials</span>
            <span className="font-mono font-bold text-stone-700">{lecturesPercent}%</span>
          </div>
          <div className="text-2xl font-black font-mono text-blue-700">
            {Math.floor(lecturesTime / 60)}h {lecturesTime % 60}m
          </div>
          <p className="text-[11px] text-stone-500 italic mt-1">Course video modules & slides</p>
          <div className="w-full h-2 bg-blue-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${lecturesPercent}%` }} />
          </div>
        </div>

        {/* Rest & Breaks */}
        <div className="bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-bold text-emerald-700 font-shantell italic">Breaks & Stretches</span>
            <span className="font-mono font-bold text-stone-700">{breaksPercent}%</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {Math.floor(breaksTime / 60)}h {breaksTime % 60}m
          </div>
          <p className="text-[11px] text-stone-500 italic mt-1">Healthy eye rests & coffee walks</p>
          <div className="w-full h-2 bg-emerald-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breaksPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Focus Pomodoro Study Timer */}
      <div className="bg-gradient-to-br from-amber-50 via-pink-50 to-yellow-100 rounded-3xl p-6 md:p-8 border-2 border-pink-300 shadow-sm">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-300 text-yellow-950 rounded-full text-xs font-bold border border-yellow-400">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Buddy's Pomodoro Study Station</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center gap-2 p-1 bg-white/80 rounded-2xl border border-pink-200 shadow-2xs">
            <button
              onClick={() => switchMode('focus')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-shantell italic cursor-pointer transition-colors ${
                pomodoroMode === 'focus'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-stone-700 hover:text-pink-600'
              }`}
            >
              📚 Focus (25m)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-shantell italic cursor-pointer transition-colors ${
                pomodoroMode === 'shortBreak'
                  ? 'bg-yellow-400 text-yellow-950 shadow-xs'
                  : 'text-stone-700 hover:text-yellow-800'
              }`}
            >
              ☕ Short Break (5m)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-shantell italic cursor-pointer transition-colors ${
                pomodoroMode === 'longBreak'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              🌿 Long Break (15m)
            </button>
          </div>

          {/* Timer Display */}
          <div className="py-4">
            <div className="text-6xl md:text-7xl font-black font-mono tracking-tight text-stone-900 drop-shadow-xs">
              {formatTimerString(timeLeft)}
            </div>
            <p className="text-xs text-stone-600 italic mt-2">
              {pomodoroMode === 'focus'
                ? 'Stay zoned in! No social media tabs during this sprint.'
                : 'Step away from screen, hydrate, and stretch your shoulders!'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-7 py-3 rounded-2xl font-bold font-shantell italic text-sm shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95 ${
                isRunning
                  ? 'bg-amber-400 hover:bg-amber-500 text-yellow-950 border border-yellow-500'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Start Focus Sprint
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-3 bg-white hover:bg-stone-50 text-stone-600 rounded-2xl border border-pink-200 cursor-pointer shadow-xs"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600 pt-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed Today: <strong className="text-stone-900">{completedSessions} focus sessions</strong></span>
          </div>
        </div>
      </div>

      {/* Buddy Health & Ergonomics Tips */}
      <div className="bg-white rounded-3xl p-5 border-2 border-yellow-200 shadow-xs">
        <h3 className="font-shantell italic font-bold text-base text-yellow-950 mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-pink-600" />
          Buddy's Healthy Screen Habit Checklist:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-700">
          <div className="p-3 bg-amber-50 rounded-2xl border border-yellow-200">
            <p className="font-bold text-stone-900 font-shantell italic">👀 20-20-20 Eye Rule</p>
            <p className="mt-1 text-stone-600 leading-relaxed">
              Every 20 minutes of study, look at an object 20 feet away for 20 seconds to relax your eye muscles.
            </p>
          </div>
          <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200">
            <p className="font-bold text-stone-900 font-shantell italic">💧 Hydration & Posture</p>
            <p className="mt-1 text-stone-600 leading-relaxed">
              Keep a water bottle on your desk. Roll your shoulders back and adjust your screen to eye level.
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-200">
            <p className="font-bold text-stone-900 font-shantell italic">🌙 Night Study Mode</p>
            <p className="mt-1 text-stone-600 leading-relaxed">
              Switch on warm night mode on your device 1 hour before bed for deeper, rejuvenating sleep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
