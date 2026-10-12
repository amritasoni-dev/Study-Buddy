import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  BookOpen,
  Send,
  Trash2,
  Filter,
  Check,
} from 'lucide-react';
import { WeeklyTask, TodoTask, Priority } from '../../types/student';

interface WeeklyPlannerViewProps {
  weeklyTasks: WeeklyTask[];
  setWeeklyTasks: React.Dispatch<React.SetStateAction<WeeklyTask[]>>;
  setTodos: React.Dispatch<React.SetStateAction<TodoTask[]>>;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  weeklyTasks,
  setWeeklyTasks,
  setTodos,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');
  const [isGeneratingModal, setIsGeneratingModal] = useState(false);
  const [isGeneratingLoading, setIsGeneratingLoading] = useState(false);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  // Generator form fields
  const [genSubjects, setGenSubjects] = useState('Data Structures, Linear Algebra, Web Dev');
  const [genGoals, setGenGoals] = useState('Prepare for Midterms & Complete College Assignments');
  const [genIntensity, setGenIntensity] = useState<'Light' | 'Balanced' | 'Crunch'>('Balanced');

  // Add individual task modal state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskDay, setNewTaskDay] = useState<typeof WEEKDAYS[number]>('Monday');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Computer Science');
  const [newTaskDuration, setNewTaskDuration] = useState('45 mins');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');

  const toggleTaskComplete = (id: string) => {
    setWeeklyTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setWeeklyTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Transfer task from weekly plan to today's to-do list
  const transferToToday = (task: WeeklyTask) => {
    const newTodo: TodoTask = {
      id: `todo-${Date.now()}`,
      title: task.title,
      subject: task.subject,
      completed: false,
      priority: task.priority,
      dueTime: '17:00',
      estimatedMinutes: parseInt(task.duration) || 45,
      category: 'study',
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setCopiedTaskId(task.id);
    setTimeout(() => setCopiedTaskId(null), 2500);
  };

  // Generate Weekly Tasks via Gemini endpoint or smart fallback
  const handleGeneratePlan = async () => {
    setIsGeneratingLoading(true);
    try {
      const subjectsArray = genSubjects.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/gemini/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'weekly',
          subjects: subjectsArray,
          goals: genGoals,
          intensity: genIntensity,
        }),
      });

      const data = await res.json();
      if (data?.tasks && Array.isArray(data.tasks)) {
        const formatted: WeeklyTask[] = data.tasks.map((t: any, idx: number) => ({
          id: `w-gen-${Date.now()}-${idx}`,
          day: WEEKDAYS.includes(t.day) ? t.day : WEEKDAYS[idx % 5],
          title: t.title || 'Review core chapter',
          subject: subjectsArray[idx % subjectsArray.length] || 'Core Subject',
          duration: t.duration || '45 mins',
          priority: (t.priority as Priority) || 'Medium',
          completed: false,
          type: t.type || 'Study',
        }));

        setWeeklyTasks(formatted);
        setIsGeneratingModal(false);
      }
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      setIsGeneratingLoading(false);
    }
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: WeeklyTask = {
      id: `w-custom-${Date.now()}`,
      day: newTaskDay,
      title: newTaskTitle.trim(),
      subject: newTaskSubject.trim() || 'General',
      duration: newTaskDuration,
      priority: newTaskPriority,
      completed: false,
      type: 'Study',
    };

    setWeeklyTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const displayedTasks =
    selectedDayFilter === 'All'
      ? weeklyTasks
      : weeklyTasks.filter((t) => t.day === selectedDayFilter);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-yellow-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-yellow-300 text-yellow-950 font-bold">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
              Weekly Task Generator & Schedule 📋
            </h2>
          </div>
          <p className="text-xs md:text-sm text-stone-600 italic mt-1">
            Let Buddy generate a smart, balanced Monday–Friday study timetable tailored to your subjects!
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsGeneratingModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-pink-400 hover:opacity-95 text-yellow-950 font-bold text-xs md:text-sm rounded-2xl shadow-sm border border-yellow-500 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-pink-700" />
            <span>Generate Weekly Tasks with Buddy</span>
          </button>

          <button
            onClick={() => setIsAddingTask(true)}
            className="px-3.5 py-2.5 bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs md:text-sm font-bold rounded-2xl border border-pink-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-shantell italic flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Day Filter:
        </span>
        {['All', ...WEEKDAYS].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDayFilter(day)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDayFilter === day
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-yellow-100 border border-yellow-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Days Grid View */}
      {selectedDayFilter === 'All' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WEEKDAYS.map((day) => {
            const dayTasks = weeklyTasks.filter((t) => t.day === day);
            return (
              <div
                key={day}
                className="bg-white rounded-3xl p-4 border-2 border-pink-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-pink-100">
                    <h3 className="font-bold text-sm font-shantell italic text-pink-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                      {day}
                    </h3>
                    <span className="text-[11px] font-semibold text-stone-500">
                      {dayTasks.filter((t) => t.completed).length}/{dayTasks.length} Done
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[140px]">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-stone-400 italic py-4 text-center">
                        No tasks yet for {day}.
                      </p>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            task.completed
                              ? 'bg-stone-50 border-stone-200 opacity-60'
                              : 'bg-amber-50/50 hover:bg-pink-50/60 border-yellow-200/80 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <button
                                onClick={() => toggleTaskComplete(task.id)}
                                className="mt-0.5 text-stone-400 hover:text-pink-600 cursor-pointer"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Circle className="w-4 h-4 text-stone-300" />
                                )}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`font-semibold leading-tight ${
                                    task.completed ? 'line-through text-stone-400' : 'text-stone-800'
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                                  <span className="font-bold text-pink-700">{task.subject}</span>
                                  <span>• {task.duration}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-stone-300 hover:text-rose-500 p-0.5 rounded cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-yellow-200/60 flex items-center justify-between">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-yellow-200 text-yellow-900'
                              }`}
                            >
                              {task.priority}
                            </span>

                            <button
                              onClick={() => transferToToday(task)}
                              disabled={copiedTaskId === task.id}
                              className="text-[10px] text-pink-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                              title="Copy this task into Today's To-Do list"
                            >
                              {copiedTaskId === task.id ? (
                                <span className="text-emerald-600 flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Added to Today!
                                </span>
                              ) : (
                                <>
                                  <span>Do Today</span> <ArrowRight className="w-2.5 h-2.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewTaskDay(day);
                    setIsAddingTask(true);
                  }}
                  className="mt-3 w-full py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-950 text-xs font-bold rounded-xl border border-yellow-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add {day} Goal
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Filtered Single Day List */
        <div className="bg-white rounded-3xl p-5 border-2 border-pink-200 shadow-sm space-y-3">
          <h3 className="font-shantell italic font-bold text-lg text-pink-700">
            {selectedDayFilter} Tasks & Focus
          </h3>
          {displayedTasks.length === 0 ? (
            <p className="text-sm text-stone-500 italic py-6 text-center">
              No tasks for {selectedDayFilter}. Click 'Add Task' to schedule one!
            </p>
          ) : (
            displayedTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-yellow-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300" />
                    )}
                  </button>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {task.subject} • {task.duration} • Priority: {task.priority}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => transferToToday(task)}
                    className="px-3 py-1 bg-yellow-300 hover:bg-yellow-400 text-yellow-950 text-xs font-bold rounded-xl border border-yellow-400 flex items-center gap-1 cursor-pointer"
                  >
                    Send to Today
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Buddy AI Weekly Task Generator */}
      {isGeneratingModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border-2 border-yellow-400 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-yellow-200">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-yellow-300 text-yellow-950 font-bold">
                  🤖
                </span>
                <h3 className="font-shantell italic font-bold text-lg text-stone-900">
                  Buddy's Smart Schedule Generator
                </h3>
              </div>
              <button
                onClick={() => setIsGeneratingModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 italic">
              Tell Buddy what subjects you have this semester and your main focus. Buddy will structure your Monday to Friday timetable!
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Subjects (Comma Separated):
                </label>
                <input
                  type="text"
                  value={genSubjects}
                  onChange={(e) => setGenSubjects(e.target.value)}
                  className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300 focus:outline-pink-500 font-medium"
                  placeholder="e.g. Data Structures, Linear Algebra, Operating Systems"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Weekly Goals / Focus:
                </label>
                <input
                  type="text"
                  value={genGoals}
                  onChange={(e) => setGenGoals(e.target.value)}
                  className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300 focus:outline-pink-500 font-medium"
                  placeholder="e.g. Master Tree algorithms, submit Web Dev project"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Study Intensity:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Light', 'Balanced', 'Crunch'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setGenIntensity(lvl)}
                      className={`py-2 rounded-xl font-bold cursor-pointer transition-colors ${
                        genIntensity === lvl
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-amber-100/70 text-yellow-950 hover:bg-yellow-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsGeneratingModal(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePlan}
                disabled={isGeneratingLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-pink-400 hover:opacity-90 text-stone-950 text-xs font-bold rounded-2xl shadow-sm border border-yellow-500 flex items-center gap-2 cursor-pointer"
              >
                {isGeneratingLoading ? (
                  <>
                    <span className="animate-spin">⚡</span> Buddy is Crafting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-pink-700" /> Generate Weekly Schedule!
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Task */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustomTask}
            className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-pink-300 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-shantell italic font-bold text-base text-pink-700">
                Add Task for {newTaskDay}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Select Day:</label>
                <select
                  value={newTaskDay}
                  onChange={(e) => setNewTaskDay(e.target.value as any)}
                  className="w-full px-3 py-2 bg-pink-50/60 rounded-xl border border-pink-200"
                >
                  {WEEKDAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Task Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Solve Tutorial Sheet 4"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200 focus:outline-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Subject:</label>
                  <input
                    type="text"
                    placeholder="e.g. Physics"
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Duration:</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 mins"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-3 py-1.5 text-xs text-stone-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
