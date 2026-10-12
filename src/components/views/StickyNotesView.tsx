import React, { useState } from 'react';
import {
  StickyNote as StickyIcon,
  Plus,
  Pin,
  Trash2,
  Edit2,
  Search,
  Check,
  Sparkles,
} from 'lucide-react';
import { StickyNote } from '../../types/student';

interface StickyNotesViewProps {
  notes: StickyNote[];
  setNotes: React.Dispatch<React.SetStateAction<StickyNote[]>>;
}

const COLOR_MAP = {
  yellow: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    shadow: 'shadow-yellow-200/50',
    header: 'bg-yellow-200/70',
    text: 'text-stone-900',
  },
  pink: {
    bg: 'bg-pink-100',
    border: 'border-pink-300',
    shadow: 'shadow-pink-200/50',
    header: 'bg-pink-200/70',
    text: 'text-stone-900',
  },
  mint: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    shadow: 'shadow-emerald-200/50',
    header: 'bg-emerald-200/70',
    text: 'text-stone-900',
  },
  peach: {
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    shadow: 'shadow-orange-200/50',
    header: 'bg-orange-200/70',
    text: 'text-stone-900',
  },
  lavender: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    shadow: 'shadow-purple-200/50',
    header: 'bg-purple-200/70',
    text: 'text-stone-900',
  },
};

export const StickyNotesView: React.FC<StickyNotesViewProps> = ({
  notes,
  setNotes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<StickyNote['color']>('yellow');
  const [tagsInput, setTagsInput] = useState('ImpDate, Study');

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleStartEdit = (note: StickyNote) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color);
    setTagsInput(note.tags.join(', '));
    setIsAddingNote(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingNoteId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNoteId
            ? {
                ...n,
                title: title.trim() || 'Untitled Note',
                content: content.trim(),
                color: selectedColor,
                tags,
              }
            : n
        )
      );
      setEditingNoteId(null);
    } else {
      const newNote: StickyNote = {
        id: `note-${Date.now()}`,
        title: title.trim() || 'Quick Note',
        content: content.trim(),
        color: selectedColor,
        isPinned: false,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tags,
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setTitle('');
    setContent('');
    setIsAddingNote(false);
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-yellow-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-yellow-300 text-yellow-950 font-bold">
              <StickyIcon className="w-5 h-5 text-pink-600" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
              Student Sticky Notes Board 📌
            </h2>
          </div>
          <p className="text-xs md:text-sm text-stone-600 italic mt-1">
            Pin important dates, formula cheat-sheets, professor office hours, or quick scratchpad reminders in pastel colors!
          </p>
        </div>

        <button
          onClick={() => {
            setEditingNoteId(null);
            setTitle('');
            setContent('');
            setIsAddingNote(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs md:text-sm font-bold rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Sticky Note</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-yellow-200">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-yellow-300 focus:outline-pink-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-stone-600 font-shantell italic">
          <span className="text-pink-600">{notes.filter((n) => n.isPinned).length} Pinned</span>
          <span>•</span>
          <span>{notes.length} Total Notes</span>
        </div>
      </div>

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedNotes.map((note) => {
          const style = COLOR_MAP[note.color] || COLOR_MAP.yellow;

          return (
            <div
              key={note.id}
              className={`relative rounded-3xl p-5 border-2 ${style.bg} ${style.border} shadow-md ${style.shadow} transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between min-h-[220px]`}
            >
              {/* Pushpin at top center/right */}
              <button
                onClick={() => togglePin(note.id)}
                className={`absolute -top-3 right-5 p-1.5 rounded-full shadow-xs transition-transform active:scale-90 cursor-pointer ${
                  note.isPinned
                    ? 'bg-rose-500 text-white ring-2 ring-white scale-110'
                    : 'bg-white/80 text-stone-400 hover:text-rose-500'
                }`}
                title={note.isPinned ? 'Unpin note' : 'Pin to top'}
              >
                <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
              </button>

              <div>
                {/* Note Date & Header */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium mb-1.5">
                  <span className="font-mono">{note.date}</span>
                  {note.isPinned && (
                    <span className="text-[10px] font-bold text-rose-700 font-shantell italic">
                      ★ PINNED
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base font-shantell italic text-stone-900 leading-snug">
                  {note.title}
                </h3>

                {/* Content in handwritten/italic style */}
                <p className="mt-2 text-sm text-stone-800 font-caveat italic whitespace-pre-line leading-relaxed min-h-[70px]">
                  {note.content}
                </p>
              </div>

              {/* Tags & Action Buttons */}
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold bg-white/80 text-stone-800 px-2 py-0.5 rounded-md shadow-2xs"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(note)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-white/60 cursor-pointer"
                    title="Edit Note"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-white/60 cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Write / Edit Sticky Note */}
      {isAddingNote && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNote}
            className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-yellow-400 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-yellow-200">
              <h3 className="font-shantell italic font-bold text-base text-yellow-950 flex items-center gap-1.5">
                <StickyIcon className="w-4 h-4 text-pink-600" />
                {editingNoteId ? 'Edit Sticky Note' : 'New Sticky Note'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Pick Color:</label>
                <div className="flex gap-2.5">
                  {(['yellow', 'pink', 'mint', 'peach', 'lavender'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        c === 'yellow'
                          ? 'bg-yellow-300'
                          : c === 'pink'
                          ? 'bg-pink-300'
                          : c === 'mint'
                          ? 'bg-emerald-300'
                          : c === 'peach'
                          ? 'bg-orange-300'
                          : 'bg-purple-300'
                      } ${selectedColor === c ? 'scale-110 border-stone-800 ring-2 ring-yellow-400' : 'border-white'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Note Title:</label>
                <input
                  type="text"
                  placeholder="e.g. ⚠️ Important Test Date!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300 focus:outline-pink-500 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Note Content (Notes / Work / Formulas):</label>
                <textarea
                  rows={4}
                  placeholder="Write important dates, formulas, assignment tips, room codes..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300 focus:outline-pink-500 font-caveat text-base leading-snug italic"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Tags (Comma-separated):</label>
                <input
                  type="text"
                  placeholder="ImpDate, Math, Homework, Room302"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-yellow-100">
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="px-3 py-1.5 text-xs text-stone-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save to Board
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
