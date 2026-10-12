import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { CalendarMarker, UpcomingTest, CollegeEvent } from '../../types/student';

interface MarkableCalendarViewProps {
  markers: CalendarMarker[];
  setMarkers: React.Dispatch<React.SetStateAction<CalendarMarker[]>>;
  tests: UpcomingTest[];
  events: CollegeEvent[];
}

const MARKER_COLORS = [
  { type: 'test', label: '🌸 Exam / Test', color: '#EC4899', bg: 'bg-pink-100', text: 'text-pink-800' },
  { type: 'holiday', label: '☀️ Holiday / Break', color: '#EAB308', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { type: 'hackathon', label: '🚀 Hackathon / Event', color: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-800' },
  { type: 'assignment', label: '📝 Assignment Deadline', color: '#10B981', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  { type: 'custom', label: '⭐ Important Note', color: '#F97316', bg: 'bg-orange-100', text: 'text-orange-800' },
];

export const MarkableCalendarView: React.FC<MarkableCalendarViewProps> = ({
  markers,
  setMarkers,
  tests,
  events,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  // New Marker fields
  const [markType, setMarkType] = useState<CalendarMarker['type']>('test');
  const [markLabel, setMarkLabel] = useState('');
  const [markNote, setMarkNote] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper date string formatter
  const formatDateKey = (d: number, m: number = month, y: number = year) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Handle adding custom marker
  const handleAddMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markLabel.trim()) return;

    const matchedConfig = MARKER_COLORS.find((c) => c.type === markType);

    const newMarker: CalendarMarker = {
      id: `mark-${Date.now()}`,
      date: selectedDateStr,
      type: markType,
      label: markLabel.trim(),
      color: matchedConfig?.color || '#EC4899',
      note: markNote.trim() || undefined,
    };

    setMarkers((prev) => [...prev, newMarker]);
    setMarkLabel('');
    setMarkNote('');
    setIsMarkModalOpen(false);
  };

  const handleDeleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  // Markers, tests and events on the selected date
  const selectedDateMarkers = markers.filter((m) => m.date === selectedDateStr);
  const selectedDateTests = tests.filter((t) => t.date === selectedDateStr);
  const selectedDateEvents = events.filter((e) => e.date === selectedDateStr);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-pink-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-pink-500 text-white font-bold">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
              Markable Interactive Calendar 📅
            </h2>
          </div>
          <p className="text-xs md:text-sm text-stone-600 italic mt-1">
            Click any date on the calendar to mark it with colors, schedule study targets, tag holidays or exam days!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={jumpToToday}
            className="px-3.5 py-2 bg-yellow-300 hover:bg-yellow-400 text-yellow-950 text-xs font-bold rounded-2xl border border-yellow-400 cursor-pointer shadow-2xs"
          >
            Go to Today
          </button>
          <button
            onClick={() => setIsMarkModalOpen(true)}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mark {selectedDateStr}</span>
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 bg-white p-3.5 rounded-2xl border border-pink-100 text-xs">
        <span className="font-bold text-stone-500 uppercase font-shantell italic text-[11px]">
          Marker Colors:
        </span>
        {MARKER_COLORS.map((c) => (
          <span
            key={c.type}
            className={`px-2.5 py-1 rounded-xl font-bold font-shantell italic flex items-center gap-1.5 ${c.bg} ${c.text}`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
            {c.label}
          </span>
        ))}
      </div>

      {/* Main Grid & Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border-2 border-yellow-300 shadow-sm">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-yellow-200">
            <h3 className="text-lg md:text-xl font-bold font-shantell italic text-stone-900">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-950 cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-950 cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-stone-500 font-shantell italic mb-2">
            <span className="text-rose-500">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-yellow-600">Sat</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty prefix cells from previous month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const prevDateNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-20 md:h-24 p-1.5 rounded-2xl bg-stone-50/50 border border-stone-100 opacity-30 text-stone-400 text-xs font-mono"
                >
                  {prevDateNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateKey = formatDateKey(dayNum);
              const isSelected = selectedDateStr === dateKey;
              const isToday = todayStr === dateKey;

              const dayMarkers = markers.filter((m) => m.date === dateKey);
              const dayTests = tests.filter((t) => t.date === dateKey);
              const dayEvents = events.filter((e) => e.date === dateKey);
              const hasActivity = dayMarkers.length > 0 || dayTests.length > 0 || dayEvents.length > 0;

              return (
                <div
                  key={dateKey}
                  onClick={() => setSelectedDateStr(dateKey)}
                  className={`h-20 md:h-24 p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-400 shadow-sm'
                      : isToday
                      ? 'border-yellow-400 bg-amber-50/60'
                      : 'border-yellow-100 hover:border-pink-300 hover:bg-yellow-50/40 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-lg ${
                        isToday
                          ? 'bg-yellow-400 text-yellow-950 font-black'
                          : isSelected
                          ? 'bg-pink-500 text-white font-bold'
                          : 'text-stone-700'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {hasActivity && (
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    )}
                  </div>

                  {/* Day Markers Preview Pills */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayTests.map((t) => (
                      <div
                        key={t.id}
                        className="text-[9px] truncate px-1 py-0.2 rounded bg-pink-200 text-pink-900 font-bold"
                        title={t.title}
                      >
                        📚 {t.title}
                      </div>
                    ))}
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        className="text-[9px] truncate px-1 py-0.2 rounded bg-purple-200 text-purple-900 font-bold"
                        title={e.title}
                      >
                        🚀 {e.title}
                      </div>
                    ))}
                    {dayMarkers.map((m) => (
                      <div
                        key={m.id}
                        className="text-[9px] truncate px-1 py-0.2 rounded font-bold"
                        style={{ backgroundColor: `${m.color}25`, color: m.color }}
                        title={m.label}
                      >
                        • {m.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector Sidebar (1 Col) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-pink-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-pink-100">
              <div>
                <span className="text-[11px] font-bold text-pink-600 font-shantell italic block">
                  Selected Date Details
                </span>
                <h3 className="font-bold text-lg font-mono text-stone-900">{selectedDateStr}</h3>
              </div>
              <button
                onClick={() => setIsMarkModalOpen(true)}
                className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Mark
              </button>
            </div>

            {/* List of items on this date */}
            <div className="space-y-3">
              {/* Tests on this date */}
              {selectedDateTests.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-pink-700 flex items-center gap-1">
                    📚 Tests & Exams Today:
                  </span>
                  {selectedDateTests.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs"
                    >
                      <p className="font-bold text-pink-900 font-shantell italic">{t.title}</p>
                      <p className="text-[11px] text-pink-700 mt-0.5">
                        {t.time} • Room: {t.roomOrPlatform}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Events on this date */}
              {selectedDateEvents.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                    🚀 Hackathons & Events:
                  </span>
                  {selectedDateEvents.map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs"
                    >
                      <p className="font-bold text-purple-900 font-shantell italic">{e.title}</p>
                      <p className="text-[11px] text-purple-700 mt-0.5">
                        {e.type} • {e.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Markers on this date */}
              {selectedDateMarkers.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                    🏷️ Custom Marks & Notes:
                  </span>
                  {selectedDateMarkers.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2"
                      style={{ borderColor: `${m.color}60`, backgroundColor: `${m.color}10` }}
                    >
                      <div>
                        <p className="font-bold font-shantell italic" style={{ color: m.color }}>
                          {m.label}
                        </p>
                        {m.note && (
                          <p className="text-[11px] text-stone-600 mt-1 italic font-caveat text-sm">
                            "{m.note}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteMarker(m.id)}
                        className="text-stone-300 hover:text-rose-500 p-1 cursor-pointer"
                        title="Remove mark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedDateTests.length === 0 &&
                selectedDateEvents.length === 0 &&
                selectedDateMarkers.length === 0 && (
                  <div className="text-center py-8 text-stone-400 italic text-xs bg-amber-50/50 rounded-2xl border border-yellow-200">
                    <p className="font-shantell text-sm font-bold text-stone-600">
                      Clean slate for this date!
                    </p>
                    <p className="mt-1">Click "Mark" above to set a deadline, holiday tag, or study note.</p>
                  </div>
                )}
            </div>
          </div>

          <div className="pt-4 border-t border-pink-100 text-[11px] text-stone-500 italic">
            💡 *Tip from Buddy:* Marking holidays helps Buddy structure relaxed study routines on those days!
          </div>
        </div>
      </div>

      {/* Modal: Add Date Marker */}
      {isMarkModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMarker}
            className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-pink-300 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-shantell italic font-bold text-base text-pink-700">
                Mark Date: {selectedDateStr}
              </h3>
              <button
                type="button"
                onClick={() => setIsMarkModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Marker Tag Type:</label>
                <div className="space-y-1.5">
                  {MARKER_COLORS.map((cfg) => (
                    <label
                      key={cfg.type}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                        markType === cfg.type
                          ? 'border-pink-500 bg-pink-50 font-bold'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="markType"
                        checked={markType === cfg.type}
                        onChange={() => setMarkType(cfg.type as any)}
                        className="text-pink-600"
                      />
                      <span>{cfg.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Marker Title / Label:</label>
                <input
                  type="text"
                  placeholder="e.g. Physics Midterm or Thanksgiving Holiday"
                  value={markLabel}
                  onChange={(e) => setMarkLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300 focus:outline-pink-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Personal Note (Optional):</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring formula sheet, meet at library, study group session..."
                  value={markNote}
                  onChange={(e) => setMarkNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-pink-100">
              <button
                type="button"
                onClick={() => setIsMarkModalOpen(false)}
                className="px-3 py-1.5 text-xs text-stone-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Add Marker
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
