import React from 'react';
import {
  CheckSquare,
  CalendarDays,
  SunMedium,
  GraduationCap,
  Sparkles,
  StickyNote,
  Calendar,
  Wrench,
  Clock,
  BookOpen,
  Menu,
  X,
  Zap,
} from 'lucide-react';

export type ActiveTab =
  | 'hub'
  | 'weekly'
  | 'weekend'
  | 'tests'
  | 'events'
  | 'stickies'
  | 'calendar'
  | 'tools'
  | 'screentime';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  urgentEventCount: number;
  upcomingTestCount: number;
  todayPendingTodoCount: number;
  liveScreenTimeMinutes: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  urgentEventCount,
  upcomingTestCount,
  todayPendingTodoCount,
  liveScreenTimeMinutes,
}) => {
  const navItems = [
    {
      id: 'hub' as ActiveTab,
      label: "Today's To-Do",
      subtext: 'Daily goals & checklist',
      icon: CheckSquare,
      badge: todayPendingTodoCount > 0 ? `${todayPendingTodoCount}` : undefined,
      badgeColor: 'bg-yellow-400 text-yellow-950',
    },
    {
      id: 'weekly' as ActiveTab,
      label: 'Weekly Tasks',
      subtext: 'Auto generator & weekdays',
      icon: CalendarDays,
    },
    {
      id: 'weekend' as ActiveTab,
      label: 'Sat, Sun & Holidays',
      subtext: 'Weekend & break planner',
      icon: SunMedium,
    },
    {
      id: 'tests' as ActiveTab,
      label: 'Tests & Assignments',
      subtext: 'Exams, midterms & deadlines',
      icon: GraduationCap,
      badge: upcomingTestCount > 0 ? `${upcomingTestCount}` : undefined,
      badgeColor: 'bg-pink-500 text-white',
    },
    {
      id: 'events' as ActiveTab,
      label: 'Events & Hackathons',
      subtext: 'Workshops & alerts',
      icon: Sparkles,
      badge: urgentEventCount > 0 ? `🚨 ${urgentEventCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'stickies' as ActiveTab,
      label: 'Sticky Notes',
      subtext: 'Important dates & quick notes',
      icon: StickyNote,
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'Markable Calendar',
      subtext: 'Highlight & color-tag dates',
      icon: Calendar,
    },
    {
      id: 'tools' as ActiveTab,
      label: 'Study Tools Hub',
      subtext: 'Brainly, ChatGPT, Gemini, Google',
      icon: Wrench,
    },
    {
      id: 'screentime' as ActiveTab,
      label: 'Screen Time & Focus',
      subtext: 'Session monitor & pomodoro',
      icon: Clock,
    },
  ];

  const formatScreenTime = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    if (hrs > 0) return `${hrs}h ${m}m`;
    return `${m}m`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-stone-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container on the Left */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-amber-50 via-pink-50 to-amber-100/90 border-r-2 border-pink-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:static lg:shadow-none'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-pink-200/80 bg-white/70 backdrop-blur-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-400 to-yellow-400 p-0.5 shadow-xs flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-pink-600 font-extrabold text-lg">
                  🤖
                </div>
              </div>
              <div>
                <h2 className="font-shantell italic font-bold text-lg text-pink-700 tracking-tight leading-none">
                  Student Buddy
                </h2>
                <p className="text-[11px] font-medium text-stone-500 italic mt-0.5">
                  Your daily study bestie ✨
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 text-stone-500 hover:text-pink-600 rounded-lg hover:bg-pink-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <div className="px-2 py-1 text-[11px] font-bold text-pink-800/70 uppercase tracking-wider italic">
              Menu Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold shadow-md shadow-pink-300/40 translate-x-1'
                      : 'text-stone-700 hover:bg-white/80 hover:text-pink-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-yellow-200/80 text-yellow-900 group-hover:bg-pink-100 group-hover:text-pink-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className={`text-sm font-medium leading-snug font-shantell italic ${isActive ? 'text-white' : 'text-stone-800'}`}>
                        {item.label}
                      </div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-pink-100' : 'text-stone-500'}`}>
                        {item.subtext}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap ml-1 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Screen Time & Buddy Widget */}
          <div className="p-3 border-t border-pink-200/70 bg-white/60">
            <div
              onClick={() => {
                setActiveTab('screentime');
                setIsOpenMobile(false);
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-yellow-100 via-amber-50 to-pink-100 border border-yellow-300 hover:border-pink-300 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-shantell italic text-yellow-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-pink-600" /> Screen Time Today
                </span>
                <span className="text-xs font-black text-pink-700 font-mono bg-white px-2 py-0.5 rounded-lg border border-pink-200 shadow-2xs">
                  {formatScreenTime(liveScreenTimeMinutes)}
                </span>
              </div>
              <p className="text-[10px] text-stone-600 italic mt-1 leading-tight">
                Click to open Focus Pomodoro & screen habits monitor!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
