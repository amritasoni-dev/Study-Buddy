import React, { useState } from 'react';
import {
  SunMedium,
  Coffee,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Gamepad2,
  BookOpen,
  Heart,
  Smile,
  Flame,
} from 'lucide-react';
import { WeekendPlanItem } from '../../types/student';

interface WeekendHolidayViewProps {
  plans: WeekendPlanItem[];
  setPlans: React.Dispatch<React.SetStateAction<WeekendPlanItem[]>>;
}

export const WeekendHolidayView: React.FC<WeekendHolidayViewProps> = ({
  plans,
  setPlans,
}) => {
  const [activeDayType, setActiveDayType] = useState<'Saturday' | 'Sunday' | 'Holiday'>('Saturday');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState<WeekendPlanItem['timeSlot']>('Morning');
  const [newCategory, setNewCategory] = useState<WeekendPlanItem['category']>('Study & Catchup');
  const [newDuration, setNewDuration] = useState('1.5 hours');

  const toggleComplete = (id: string) => {
    setPlans((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const deleteItem = (id: string) => {
    setPlans((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: WeekendPlanItem = {
      id: `wplan-${Date.now()}`,
      dayType: activeDayType,
      timeSlot: newTimeSlot,
      title: newTitle.trim(),
      category: newCategory,
      duration: newDuration,
      completed: false,
    };

    setPlans((prev) => [...prev, newItem]);
    setNewTitle('');
    setIsAddingItem(false);
  };

  // Preset generators for weekends & holidays
  const applyPreset = (presetName: string) => {
    if (presetName === 'chill') {
      const chillItems: WeekendPlanItem[] = [
        {
          id: `chill-1-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Morning',
          title: 'Sleep in + Cook delicious pancake breakfast',
          category: 'Fun & Relaxation',
          duration: '2 hours',
          completed: false,
        },
        {
          id: `chill-2-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Afternoon',
          title: 'Watch favorite anime / gaming session with friends',
          category: 'Fun & Relaxation',
          duration: '3 hours',
          completed: false,
        },
        {
          id: `chill-3-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Evening',
          title: 'Light review of 20 flashcards (Stress-free)',
          category: 'Study & Catchup',
          duration: '30 mins',
          completed: false,
        },
        {
          id: `chill-4-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Night',
          title: 'Skincare routine & calming music',
          category: 'Health & Exercise',
          duration: '1 hour',
          completed: false,
        },
      ];
      setPlans((prev) => [...prev.filter((p) => p.dayType !== activeDayType), ...chillItems]);
    } else if (presetName === 'hackathon') {
      const sprintItems: WeekendPlanItem[] = [
        {
          id: `hack-1-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Morning',
          title: 'Team standup & wireframe review for Hackathon',
          category: 'Project & Hackathon',
          duration: '1.5 hours',
          completed: false,
        },
        {
          id: `hack-2-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Afternoon',
          title: 'Deep coding session: Implement core backend API & UI',
          category: 'Project & Hackathon',
          duration: '4 hours',
          completed: false,
        },
        {
          id: `hack-3-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Evening',
          title: 'Walk in the fresh air + Energy smoothie break',
          category: 'Health & Exercise',
          duration: '45 mins',
          completed: false,
        },
        {
          id: `hack-4-${Date.now()}`,
          dayType: activeDayType,
          timeSlot: 'Night',
          title: 'Record demo video & polish Devpost submission',
          category: 'Project & Hackathon',
          duration: '2 hours',
          completed: false,
        },
      ];
      setPlans((prev) => [...prev.filter((p) => p.dayType !== activeDayType), ...sprintItems]);
    }
  };

  const currentPlans = plans.filter((p) => p.dayType === activeDayType);
  const timeSlots: WeekendPlanItem['timeSlot'][] = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-yellow-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-yellow-300 text-yellow-950 font-bold">
              <SunMedium className="w-5 h-5 text-pink-600" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
              Weekend & Holiday Master Routine 🌅
            </h2>
          </div>
          <p className="text-xs md:text-sm text-stone-600 italic mt-1">
            Weekends and holidays are different from school days! Balance catching up on backlogs with guilt-free relaxation and creative projects.
          </p>
        </div>

        {/* Tab Toggle for Sat / Sun / Holiday */}
        <div className="flex bg-amber-50 p-1.5 rounded-2xl border-2 border-yellow-300 shadow-2xs">
          {(['Saturday', 'Sunday', 'Holiday'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveDayType(tab)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold font-shantell italic cursor-pointer transition-all ${
                activeDayType === tab
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                  : 'text-stone-700 hover:text-pink-600'
              }`}
            >
              {tab === 'Saturday' && '☀️ Saturday'}
              {tab === 'Sunday' && '🌸 Sunday'}
              {tab === 'Holiday' && '🎉 Holiday'}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Quick Loaders */}
      <div className="flex items-center justify-between gap-2 flex-wrap bg-gradient-to-r from-pink-50 via-yellow-50 to-amber-50 p-3.5 rounded-2xl border border-pink-200">
        <div className="flex items-center gap-2 text-xs font-bold font-shantell italic text-stone-700">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span>Quick Routine Templates for {activeDayType}:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => applyPreset('chill')}
            className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-yellow-950 text-xs font-bold rounded-xl border border-yellow-400 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Smile className="w-3.5 h-3.5" /> Relax & Recharge
          </button>
          <button
            onClick={() => applyPreset('hackathon')}
            className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold rounded-xl border border-pink-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5" /> Hackathon / Project Mode
          </button>
          <button
            onClick={() => setIsAddingItem(true)}
            className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> Custom Activity
          </button>
        </div>
      </div>

      {/* Time Slots Quadrant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {timeSlots.map((slot) => {
          const slotItems = currentPlans.filter((p) => p.timeSlot === slot);
          const icon =
            slot === 'Morning' ? '☕' : slot === 'Afternoon' ? '💻' : slot === 'Evening' ? '🏸' : '🌙';

          return (
            <div
              key={slot}
              className="bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-pink-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-shantell italic font-bold text-base text-pink-800">
                      {slot} Slot
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500">
                    {slotItems.filter((i) => i.completed).length}/{slotItems.length} Done
                  </span>
                </div>

                <div className="space-y-3 min-h-[110px]">
                  {slotItems.length === 0 ? (
                    <p className="text-xs text-stone-400 italic py-4 text-center">
                      Free time! No planned activity for {slot.toLowerCase()}.
                    </p>
                  ) : (
                    slotItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          item.completed
                            ? 'bg-stone-50 border-stone-200 opacity-60'
                            : 'bg-amber-50/60 hover:bg-pink-50/70 border-yellow-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => toggleComplete(item.id)}
                            className="mt-0.5 text-stone-400 hover:text-pink-600 cursor-pointer"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-stone-300" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-semibold leading-snug ${
                                item.completed ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px]">
                              <span className="font-bold text-yellow-950 bg-yellow-200/90 px-2 py-0.5 rounded-md">
                                {item.category}
                              </span>
                              <span className="text-stone-500">⏱️ {item.duration}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-stone-300 hover:text-rose-500 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setNewTimeSlot(slot);
                  setIsAddingItem(true);
                }}
                className="mt-3 w-full py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-950 text-xs font-bold rounded-xl border border-yellow-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add {slot} Routine
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddItem}
            className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-yellow-400 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-yellow-200">
              <h3 className="font-shantell italic font-bold text-base text-yellow-950">
                Add to {activeDayType} Routine
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Time Slot:</label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value as any)}
                  className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300 font-semibold"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Activity Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Badminton match with campus friends"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300 focus:outline-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300"
                  >
                    <option value="Study & Catchup">Study & Catchup</option>
                    <option value="Project & Hackathon">Project & Hackathon</option>
                    <option value="Fun & Relaxation">Fun & Relaxation</option>
                    <option value="Hobby & Skills">Hobby & Skills</option>
                    <option value="Health & Exercise">Health & Exercise</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Duration:</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 hours"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="px-3 py-1.5 text-xs text-stone-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Add Routine
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
