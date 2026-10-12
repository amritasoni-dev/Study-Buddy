import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  BookOpen,
  Sparkles,
  Calendar,
  Flame,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { TodoTask, UpcomingTest, CollegeEvent, StickyNote } from '../../types/student';
import { ActiveTab } from '../Sidebar';

interface BuddyHubViewProps {
  todos: TodoTask[];
  setTodos: React.Dispatch<React.SetStateAction<TodoTask[]>>;
  tests: UpcomingTest[];
  events: CollegeEvent[];
  stickyNotes: StickyNote[];
  setActiveTab: (tab: ActiveTab) => void;
  openToolTab: () => void;
}

export const BuddyHubView: React.FC<BuddyHubViewProps> = ({
  todos,
  setTodos,
  tests,
  events,
  stickyNotes,
  setActiveTab,
  openToolTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDueTime, setNewDueTime] = useState('18:00');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Toggle todo completion
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = !t.completed;
          if (updated) {
            setCelebrationMsg(`🎉 Awesome job completing "${t.title.slice(0, 30)}..."!`);
            setTimeout(() => setCelebrationMsg(null), 3000);
          }
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  // Delete todo
  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Add new todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TodoTask = {
      id: `todo-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      completed: false,
      priority: newPriority,
      dueTime: newDueTime,
      estimatedMinutes: 45,
      category: 'study',
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTask, ...prev]);
    setNewTitle('');
    setIsAddingTask(false);
    setCelebrationMsg("✨ Added to today's list! Let's get it done!");
    setTimeout(() => setCelebrationMsg(null), 2500);
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  // Filter urgent tests & events (within 7 days)
  const urgentTests = tests.slice(0, 2);
  const urgentEvents = events.slice(0, 2);
  const pinnedSticky = stickyNotes.find((n) => n.isPinned) || stickyNotes[0];

  return (
    <div className="space-y-6">
      {/* Celebration Alert Toast */}
      {celebrationMsg && (
        <div className="p-3.5 bg-yellow-200 border-2 border-yellow-400 text-yellow-950 font-bold rounded-2xl shadow-md flex items-center justify-between animate-bounce">
          <span className="font-shantell italic flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-600 fill-current" />
            {celebrationMsg}
          </span>
          <button
            onClick={() => setCelebrationMsg(null)}
            className="text-xs bg-yellow-400 px-2.5 py-1 rounded-xl text-yellow-950 hover:bg-yellow-500"
          >
            Yay!
          </button>
        </div>
      )}

      {/* Quick Alerts Radar Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgent Test Alert */}
        {urgentTests.length > 0 && (
          <div
            onClick={() => setActiveTab('tests')}
            className="p-4 rounded-3xl bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200/70 border-2 border-pink-300 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-500 text-white flex items-center gap-1 shadow-2xs">
                <AlertTriangle className="w-3 h-3" /> Upcoming Exam Alert
              </span>
              <span className="text-xs font-semibold text-pink-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-800 font-shantell italic group-hover:text-pink-800">
              {urgentTests[0].title}
            </h3>
            <p className="text-xs text-stone-600 mt-1 flex items-center gap-2">
              <span className="font-medium text-pink-700">Subject: {urgentTests[0].subject}</span>
              <span>·</span>
              <span className="font-bold text-pink-900 bg-pink-200/80 px-2 py-0.5 rounded-md">
                Date: {urgentTests[0].date} ({urgentTests[0].time})
              </span>
            </p>
          </div>
        )}

        {/* Urgent Hackathon / Event Alert */}
        {urgentEvents.length > 0 && (
          <div
            onClick={() => setActiveTab('events')}
            className="p-4 rounded-3xl bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-200/70 border-2 border-yellow-300 shadow-xs cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500 text-yellow-950 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-yellow-950" /> Hackathon / Event Radar
              </span>
              <span className="text-xs font-semibold text-yellow-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Check Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-800 font-shantell italic group-hover:text-amber-900">
              {urgentEvents[0].title}
            </h3>
            <p className="text-xs text-stone-600 mt-1 flex items-center gap-2">
              <span className="font-semibold text-yellow-900 bg-yellow-300/80 px-2 py-0.5 rounded-md">
                {urgentEvents[0].type}
              </span>
              <span>·</span>
              <span>Date: {urgentEvents[0].date}</span>
            </p>
          </div>
        )}
      </div>

      {/* Main Section: Today's To-Do List */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-pink-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
                Today's To-Do List 📝
              </h2>
              <span className="px-2.5 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded-full border border-pink-200">
                {completedCount}/{todos.length} Done
              </span>
            </div>
            <p className="text-xs text-stone-500 italic mt-0.5">
              Check off tasks as you finish them! Buddy tracks your progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex bg-amber-50 p-1 rounded-2xl border border-yellow-200 text-xs">
              {(['all', 'pending', 'completed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1 rounded-xl font-medium capitalize cursor-pointer transition-colors ${
                    filter === mode
                      ? 'bg-yellow-400 text-yellow-950 font-bold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-bold rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-4">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-shantell italic font-bold text-stone-600">Daily Completion Goal</span>
            <span className="font-black text-pink-600 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-pink-50 rounded-full overflow-hidden border border-pink-200">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Inline Add Task Form */}
        {isAddingTask && (
          <form
            onSubmit={handleAddTodo}
            className="mb-5 p-4 rounded-2xl bg-amber-50/80 border-2 border-yellow-300 space-y-3"
          >
            <div className="font-shantell italic font-bold text-sm text-yellow-950">
              Add New Daily Task
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="What do you need to study or finish today?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="sm:col-span-2 px-3.5 py-2 text-sm bg-white rounded-xl border border-yellow-300 focus:outline-pink-500"
                autoFocus
                required
              />
              <input
                type="text"
                placeholder="Subject (e.g. Math, CS)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="px-3.5 py-2 text-sm bg-white rounded-xl border border-yellow-300 focus:outline-pink-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-stone-600 font-medium">Priority:</span>
                {(['High', 'Medium', 'Low'] as const).map((p) => (
                  <label key={p} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={newPriority === p}
                      onChange={() => setNewPriority(p)}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className={p === 'High' ? 'text-pink-600 font-bold' : 'text-stone-700'}>
                      {p}
                    </span>
                  </label>
                ))}
                <span className="text-stone-400">|</span>
                <span className="text-stone-600 font-medium">Target Time:</span>
                <input
                  type="time"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                  className="px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Task Items List */}
        <div className="space-y-2.5">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-10 bg-amber-50/50 rounded-2xl border border-dashed border-yellow-300">
              <div className="text-3xl mb-1">🎉</div>
              <p className="font-shantell italic font-bold text-stone-700">No tasks in this list!</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Take a break or add a new study goal above.
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  todo.completed
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : 'bg-white hover:bg-pink-50/40 border-pink-100 hover:border-pink-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className="p-1 text-stone-400 hover:text-pink-600 transition-colors flex-shrink-0 cursor-pointer"
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-pink-500" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        todo.completed
                          ? 'line-through text-stone-400 italic'
                          : 'text-stone-900 font-semibold'
                      }`}
                    >
                      {todo.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                      <span className="font-medium text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                        {todo.subject}
                      </span>
                      {todo.dueTime && (
                        <span className="flex items-center gap-1 text-stone-600">
                          <Clock className="w-3 h-3 text-yellow-600" /> {todo.dueTime}
                        </span>
                      )}
                      <span
                        className={`font-semibold ${
                          todo.priority === 'High'
                            ? 'text-rose-600'
                            : todo.priority === 'Medium'
                            ? 'text-amber-700'
                            : 'text-stone-500'
                        }`}
                      >
                        • {todo.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Quick Row: Sticky Note Peek & Study Tools Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sticky Note Quick Glance */}
        <div
          onClick={() => setActiveTab('stickies')}
          className="p-5 rounded-3xl bg-amber-100/90 border-2 border-yellow-300 shadow-xs cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-shantell italic text-yellow-950 flex items-center gap-1.5">
              📌 Pinned Sticky Note
            </span>
            <span className="text-xs font-semibold text-yellow-800 flex items-center gap-1">
              Open Board <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          {pinnedSticky ? (
            <div>
              <h4 className="font-bold text-stone-900 text-sm font-shantell italic">
                {pinnedSticky.title}
              </h4>
              <p className="text-xs text-stone-700 mt-1 line-clamp-2 italic font-caveat text-sm leading-relaxed">
                "{pinnedSticky.content}"
              </p>
              <div className="flex gap-1.5 mt-2">
                {pinnedSticky.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] bg-white/70 px-2 py-0.5 rounded-md font-semibold text-stone-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">No sticky notes created yet. Click to write one!</p>
          )}
        </div>

        {/* Study Tools Launcher shortcut */}
        <div
          onClick={openToolTab}
          className="p-5 rounded-3xl bg-gradient-to-r from-pink-100 via-yellow-100 to-pink-50 border-2 border-pink-300 shadow-xs cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-shantell italic text-pink-900 flex items-center gap-1.5">
              ⚡ Quick Study Helpers
            </span>
            <span className="text-xs font-semibold text-pink-700 flex items-center gap-1">
              Launch Tools <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-stone-700 mb-3 italic">
            Instantly search questions or ask homework explanations across your favorite platforms:
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-white text-stone-800 text-xs font-bold rounded-xl border border-pink-200 shadow-2xs">
              🧠 Brainly
            </span>
            <span className="px-2.5 py-1 bg-white text-stone-800 text-xs font-bold rounded-xl border border-pink-200 shadow-2xs">
              💬 ChatGPT
            </span>
            <span className="px-2.5 py-1 bg-white text-pink-700 text-xs font-bold rounded-xl border border-pink-200 shadow-2xs">
              ✨ Gemini Buddy
            </span>
            <span className="px-2.5 py-1 bg-white text-stone-800 text-xs font-bold rounded-xl border border-pink-200 shadow-2xs">
              🔍 Google
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
