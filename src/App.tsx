/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, Sparkles, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import {
  TodoTask,
  WeeklyTask,
  WeekendPlanItem,
  UpcomingTest,
  CollegeEvent,
  StickyNote,
  CalendarMarker,
  ScreenTimeStats,
} from './types/student';
import {
  initialTodos,
  initialWeeklyTasks,
  initialWeekendPlans,
  initialTests,
  initialEvents,
  initialStickyNotes,
  initialCalendarMarkers,
} from './data/initialData';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { RobotMascot } from './components/RobotMascot';
import { BuddyHubView } from './components/views/BuddyHubView';
import { WeeklyPlannerView } from './components/views/WeeklyPlannerView';
import { WeekendHolidayView } from './components/views/WeekendHolidayView';
import { TestsExamsView } from './components/views/TestsExamsView';
import { EventsRadarView } from './components/views/EventsRadarView';
import { StickyNotesView } from './components/views/StickyNotesView';
import { MarkableCalendarView } from './components/views/MarkableCalendarView';
import { StudyToolsView } from './components/views/StudyToolsView';
import { ScreenTimeView } from './components/views/ScreenTimeView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hub');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Persistent States with local storage fallback
  const [todos, setTodos] = useState<TodoTask[]>(() => {
    try {
      const saved = localStorage.getItem('sb_todos');
      return saved ? JSON.parse(saved) : initialTodos;
    } catch {
      return initialTodos;
    }
  });

  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() => {
    try {
      const saved = localStorage.getItem('sb_weekly_tasks');
      return saved ? JSON.parse(saved) : initialWeeklyTasks;
    } catch {
      return initialWeeklyTasks;
    }
  });

  const [weekendPlans, setWeekendPlans] = useState<WeekendPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem('sb_weekend_plans');
      return saved ? JSON.parse(saved) : initialWeekendPlans;
    } catch {
      return initialWeekendPlans;
    }
  });

  const [tests, setTests] = useState<UpcomingTest[]>(() => {
    try {
      const saved = localStorage.getItem('sb_tests');
      return saved ? JSON.parse(saved) : initialTests;
    } catch {
      return initialTests;
    }
  });

  const [events, setEvents] = useState<CollegeEvent[]>(() => {
    try {
      const saved = localStorage.getItem('sb_events');
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(() => {
    try {
      const saved = localStorage.getItem('sb_stickies');
      return saved ? JSON.parse(saved) : initialStickyNotes;
    } catch {
      return initialStickyNotes;
    }
  });

  const [markers, setMarkers] = useState<CalendarMarker[]>(() => {
    try {
      const saved = localStorage.getItem('sb_markers');
      return saved ? JSON.parse(saved) : initialCalendarMarkers;
    } catch {
      return initialCalendarMarkers;
    }
  });

  const [screenTimeStats, setScreenTimeStats] = useState<ScreenTimeStats>(() => {
    try {
      const saved = localStorage.getItem('sb_screentime');
      return saved
        ? JSON.parse(saved)
        : {
            sessionSeconds: 0,
            todayAppMinutes: 45,
            todayToolsMinutes: 110,
            todayBreaksMinutes: 30,
            dailyGoalHours: 4,
            dailyLimitHours: 6,
            focusSessionsCompleted: 2,
          };
    } catch {
      return {
        sessionSeconds: 0,
        todayAppMinutes: 45,
        todayToolsMinutes: 110,
        todayBreaksMinutes: 30,
        dailyGoalHours: 4,
        dailyLimitHours: 6,
        focusSessionsCompleted: 2,
      };
    }
  });

  const [liveMinutes, setLiveMinutes] = useState(screenTimeStats.todayAppMinutes || 45);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sb_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('sb_weekly_tasks', JSON.stringify(weeklyTasks));
  }, [weeklyTasks]);

  useEffect(() => {
    localStorage.setItem('sb_weekend_plans', JSON.stringify(weekendPlans));
  }, [weekendPlans]);

  useEffect(() => {
    localStorage.setItem('sb_tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('sb_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sb_stickies', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  useEffect(() => {
    localStorage.setItem('sb_markers', JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    localStorage.setItem('sb_screentime', JSON.stringify(screenTimeStats));
  }, [screenTimeStats]);

  // Live Screen Time Counter (every 60 seconds adds 1 minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMinutes((prev) => {
        const next = prev + 1;
        setScreenTimeStats((s) => ({ ...s, todayAppMinutes: next }));
        return next;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Compute urgent badges
  const pendingTodos = todos.filter((t) => !t.completed).length;

  const urgentEventCount = events.filter((e) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(e.date);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 5;
  }).length;

  const upcomingTestCount = tests.filter((t) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(t.date);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;

  const nearestTest = tests[0];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-stone-800 flex flex-col lg:flex-row antialiased selection:bg-pink-300 selection:text-pink-900">
      {/* Left Menu Bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        urgentEventCount={urgentEventCount}
        upcomingTestCount={upcomingTestCount}
        todayPendingTodoCount={pendingTodos}
        liveScreenTimeMinutes={liveMinutes}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Top Navbar with Hamburger */}
        <header className="lg:hidden sticky top-0 z-30 bg-amber-50/90 backdrop-blur-md border-b-2 border-pink-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="p-2 rounded-xl bg-yellow-300 text-yellow-950 hover:bg-yellow-400 cursor-pointer shadow-2xs"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🤖</span>
              <span className="font-shantell italic font-bold text-lg text-pink-700 tracking-tight">
                Student Buddy
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('screentime')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-yellow-200/90 border border-yellow-300 text-[11px] font-bold text-yellow-950 font-mono shadow-2xs"
          >
            <Clock className="w-3 h-3 text-pink-600" />
            <span>{Math.floor(liveMinutes / 60)}h {liveMinutes % 60}m</span>
          </button>
        </header>

        {/* Inner Page View Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Top Cute Robot Mascot Greeting */}
          <RobotMascot
            urgentAlertCount={upcomingTestCount}
            upcomingTestTitle={nearestTest ? nearestTest.title : 'Study & Quiz Sprint'}
          />

          {/* Current Active Tab View */}
          {activeTab === 'hub' && (
            <BuddyHubView
              todos={todos}
              setTodos={setTodos}
              tests={tests}
              events={events}
              stickyNotes={stickyNotes}
              setActiveTab={setActiveTab}
              openToolTab={() => setActiveTab('tools')}
            />
          )}

          {activeTab === 'weekly' && (
            <WeeklyPlannerView
              weeklyTasks={weeklyTasks}
              setWeeklyTasks={setWeeklyTasks}
              setTodos={setTodos}
            />
          )}

          {activeTab === 'weekend' && (
            <WeekendHolidayView plans={weekendPlans} setPlans={setWeekendPlans} />
          )}

          {activeTab === 'tests' && (
            <TestsExamsView
              tests={tests}
              setTests={setTests}
              onSyncCalendar={(test) => {
                const newMarker: CalendarMarker = {
                  id: `sync-${Date.now()}`,
                  date: test.date,
                  type: 'test',
                  label: test.title,
                  color: '#EC4899',
                  note: `${test.subject} - ${test.time}`,
                };
                setMarkers((prev) => [...prev, newMarker]);
                setActiveTab('calendar');
              }}
            />
          )}

          {activeTab === 'events' && (
            <EventsRadarView events={events} setEvents={setEvents} />
          )}

          {activeTab === 'stickies' && (
            <StickyNotesView notes={stickyNotes} setNotes={setStickyNotes} />
          )}

          {activeTab === 'calendar' && (
            <MarkableCalendarView
              markers={markers}
              setMarkers={setMarkers}
              tests={tests}
              events={events}
            />
          )}

          {activeTab === 'tools' && <StudyToolsView />}

          {activeTab === 'screentime' && (
            <ScreenTimeView
              stats={screenTimeStats}
              setStats={setScreenTimeStats}
              liveMinutes={liveMinutes}
            />
          )}
        </main>
      </div>
    </div>
  );
}
