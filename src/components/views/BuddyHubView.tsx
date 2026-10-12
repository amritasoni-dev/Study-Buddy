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
  Edit3,
  Sliders,
  Tag,
  FileText,
  Check,
  Zap,
} from 'lucide-react';
import { TodoTask, UpcomingTest, CollegeEvent, StickyNote, Priority } from '../../types/student';
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

const QUICK_WORK_TEMPLATES = [
  {
    name: '📚 Homework Practice',
    title: 'Solve textbook practice problems & exercises',
    subject: 'Mathematics',
    priority: 'High' as Priority,
    category: 'study' as const,
    estimatedMinutes: 45,
  },
  {
    name: '📝 Assignment Polish',
    title: 'Finish & submit assignment requirements',
    subject: 'Computer Science',
    priority: 'High' as Priority,
    category: 'assignment' as const,
    estimatedMinutes: 60,
  },
  {
    name: '⚡ Quick Flashcard Drill',
    title: 'Active recall formulas & key definitions',
    subject: 'All Subjects',
    priority: 'Medium' as Priority,
    category: 'revision' as const,
    estimatedMinutes: 25,
  },
  {
    name: '🔬 Lab Code & Report',
    title: 'Implement code logic & write lab observations',
    subject: 'Operating Systems',
    priority: 'Medium' as Priority,
    category: 'project' as const,
    estimatedMinutes: 50,
  },
];

const COMMON_SUBJECTS = ['Computer Science', 'Mathematics', 'Physics', 'Web Development', 'Operating Systems', 'Chemistry', 'English'];

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
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Modal State for Adding OR Customizing Work
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Customize Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Computer Science');
  const [formPriority, setFormPriority] = useState<Priority>('Medium');
  const [formCategory, setFormCategory] = useState<TodoTask['category']>('study');
  const [formDueTime, setFormDueTime] = useState('17:00');
  const [formDuration, setFormDuration] = useState<number>(45);
  const [formNotes, setFormNotes] = useState('');

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

  // Quick cycle priority directly from the card
  const handleCyclePriority = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cycleMap: Record<Priority, Priority> = {
      Low: 'Medium',
      Medium: 'High',
      High: 'Low',
    };
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: cycleMap[t.priority] } : t))
    );
  };

  // Delete todo
  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Open modal to add brand new work
  const handleOpenAddModal = (template?: typeof QUICK_WORK_TEMPLATES[0]) => {
    setEditingTaskId(null);
    if (template) {
      setFormTitle(template.title);
      setFormSubject(template.subject);
      setFormPriority(template.priority);
      setFormCategory(template.category);
      setFormDuration(template.estimatedMinutes);
    } else {
      setFormTitle('');
      setFormSubject('Computer Science');
      setFormPriority('Medium');
      setFormCategory('study');
      setFormDuration(45);
    }
    setFormDueTime('18:00');
    setFormNotes('');
    setIsCustomizeModalOpen(true);
  };

  // Open modal to customize / edit existing work
  const handleOpenEditModal = (task: TodoTask) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormSubject(task.subject);
    setFormPriority(task.priority);
    setFormCategory(task.category || 'study');
    setFormDueTime(task.dueTime || '18:00');
    setFormDuration(task.estimatedMinutes || 45);
    setFormNotes(task.notes || '');
    setIsCustomizeModalOpen(true);
  };

  // Save customized task (either add new or update existing)
  const handleSaveCustomizedWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTaskId) {
      // Update existing work
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: formTitle.trim(),
                subject: formSubject.trim() || 'General',
                priority: formPriority,
                category: formCategory,
                dueTime: formDueTime,
                estimatedMinutes: Number(formDuration) || 45,
                notes: formNotes.trim() || undefined,
              }
            : t
        )
      );
      setCelebrationMsg('✨ Work customized and saved successfully!');
    } else {
      // Add new customized work
      const newTask: TodoTask = {
        id: `todo-${Date.now()}`,
        title: formTitle.trim(),
        subject: formSubject.trim() || 'General',
        completed: false,
        priority: formPriority,
        category: formCategory,
        dueTime: formDueTime,
        estimatedMinutes: Number(formDuration) || 45,
        notes: formNotes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      setTodos((prev) => [newTask, ...prev]);
      setCelebrationMsg("✨ Added new customized work to today's schedule!");
    }

    setTimeout(() => setCelebrationMsg(null), 3000);
    setIsCustomizeModalOpen(false);
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
            className="text-xs bg-yellow-400 px-2.5 py-1 rounded-xl text-yellow-950 hover:bg-yellow-500 font-bold cursor-pointer"
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

      {/* Main Section: Today's To-Do List with Add & Customize Options */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-pink-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
                Today's To-Do List & Work Customizer 📝
              </h2>
              <span className="px-2.5 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded-full border border-pink-200">
                {completedCount}/{todos.length} Done
              </span>
            </div>
            <p className="text-xs text-stone-500 italic mt-0.5">
              Add new work, customize duration, subject, priority, and notes anytime!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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

            {/* Main Add & Customize Work Button */}
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white text-xs md:text-sm font-bold rounded-2xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Customize Work</span>
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

        {/* Quick Work Templates Bar */}
        <div className="mb-4 p-3 bg-amber-50/70 rounded-2xl border border-yellow-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold font-shantell italic text-yellow-950">
            <Zap className="w-3.5 h-3.5 text-pink-600 fill-current" />
            <span>Quick Work Templates:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {QUICK_WORK_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                onClick={() => handleOpenAddModal(tmpl)}
                className="px-2.5 py-1 bg-white hover:bg-yellow-100 text-stone-800 text-[11px] font-semibold rounded-xl border border-yellow-300 shadow-2xs whitespace-nowrap cursor-pointer transition-colors"
                title={`Click to add: ${tmpl.title}`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Task Items List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-10 bg-amber-50/50 rounded-2xl border border-dashed border-yellow-300">
              <div className="text-3xl mb-1">🎉</div>
              <p className="font-shantell italic font-bold text-stone-700">No tasks in this list!</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Take a break or click "Add / Customize Work" above to plan your next session.
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  todo.completed
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : 'bg-white hover:bg-pink-50/40 border-pink-100 hover:border-pink-300 shadow-2xs'
                }`}
              >
                {/* Left side: checkbox & task details */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className="p-1 mt-0.5 text-stone-400 hover:text-pink-600 transition-colors flex-shrink-0 cursor-pointer"
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-pink-500" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-semibold leading-snug ${
                          todo.completed
                            ? 'line-through text-stone-400 italic'
                            : 'text-stone-900 font-bold'
                        }`}
                      >
                        {todo.title}
                      </p>

                      {/* Category tag */}
                      {todo.category && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-900 border border-yellow-300">
                          {todo.category}
                        </span>
                      )}
                    </div>

                    {/* Custom notes preview if present */}
                    {todo.notes && (
                      <p className="text-xs text-stone-600 mt-1 italic bg-amber-50/80 px-2.5 py-1 rounded-xl border border-yellow-200 font-caveat text-sm">
                        💡 {todo.notes}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-500 flex-wrap">
                      <span className="font-medium text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                        {todo.subject}
                      </span>

                      {todo.dueTime && (
                        <span className="flex items-center gap-1 text-stone-600">
                          <Clock className="w-3 h-3 text-yellow-600" /> {todo.dueTime}
                        </span>
                      )}

                      {todo.estimatedMinutes && (
                        <span className="text-stone-600 font-mono">
                          ⏱️ {todo.estimatedMinutes}m
                        </span>
                      )}

                      {/* Clickable priority toggle badge */}
                      <button
                        onClick={(e) => handleCyclePriority(todo.id, e)}
                        className={`font-bold px-2 py-0.5 rounded-md text-[10px] cursor-pointer transition-transform active:scale-95 ${
                          todo.priority === 'High'
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : todo.priority === 'Medium'
                            ? 'bg-yellow-200 text-yellow-900 border border-yellow-400'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                        title="Click to toggle priority (High / Medium / Low)"
                      >
                        {todo.priority === 'High' ? '🚨 High' : todo.priority === 'Medium' ? '⚡ Medium' : '🌱 Low'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons (Customize & Delete) */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEditModal(todo)}
                    className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-950 rounded-xl text-xs font-bold border border-yellow-300 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    title="Customize / Edit this work"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-pink-600" />
                    <span>Customize</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Add or Customize Work */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCustomizedWork}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border-2 border-yellow-400 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-yellow-200">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-yellow-300 text-yellow-950 font-bold">
                  <Sliders className="w-5 h-5 text-pink-600" />
                </span>
                <div>
                  <h3 className="font-shantell italic font-bold text-lg text-stone-900">
                    {editingTaskId ? 'Customize Work Details ✏️' : 'Add & Customize Work 📝'}
                  </h3>
                  <p className="text-[11px] text-stone-500 italic">
                    Tune subjects, focus duration, priority, and sub-steps!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold cursor-pointer text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs">
              {/* Work Title */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Work / Task Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solve Chapter 4 Practice Set (Graph Algorithms)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-amber-50/50 rounded-xl border border-yellow-300 focus:outline-pink-500 font-semibold"
                  autoFocus
                  required
                />
              </div>

              {/* Subject Selection with quick chips */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Subject / Topic:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures, Linear Algebra"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300 focus:outline-pink-500"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_SUBJECTS.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setFormSubject(sub)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                        formSubject === sub
                          ? 'bg-pink-500 text-white'
                          : 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Priority */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Priority Level:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['High', 'Medium', 'Low'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormPriority(p)}
                        className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          formPriority === p
                            ? p === 'High'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : p === 'Medium'
                              ? 'bg-yellow-400 text-yellow-950 shadow-xs'
                              : 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category Type:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300 font-semibold"
                  >
                    <option value="study">Study (Concepts / Reading)</option>
                    <option value="assignment">Assignment (College submission)</option>
                    <option value="revision">Revision (Flashcards / Practice)</option>
                    <option value="project">Project / Lab code</option>
                    <option value="personal">Personal / Extracurricular</option>
                  </select>
                </div>
              </div>

              {/* Due Time & Estimated Focus Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Due Time:</label>
                  <input
                    type="time"
                    value={formDueTime}
                    onChange={(e) => setFormDueTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Estimated Focus Time (Mins):
                  </label>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="number"
                      min="5"
                      max="300"
                      step="5"
                      value={formDuration}
                      onChange={(e) => setFormDuration(parseInt(e.target.value) || 30)}
                      className="w-20 px-3 py-2 bg-white rounded-xl border border-yellow-300 font-mono font-bold"
                    />
                    <div className="flex gap-1">
                      {[25, 45, 60, 90].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormDuration(m)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                            formDuration === m ? 'bg-pink-500 text-white' : 'bg-yellow-100 text-yellow-950'
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Work Notes & Sub-steps */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Custom Notes / Checklist Steps (Optional):
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1. Review slides 2. Solve odd numbered exercises 3. Check formula sheet"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300 focus:outline-pink-500 font-caveat text-base"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-yellow-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{editingTaskId ? 'Save Customized Work' : 'Add Customized Work'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

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
