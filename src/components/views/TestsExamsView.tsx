import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  CheckCircle,
  FileText,
  Bookmark,
} from 'lucide-react';
import { UpcomingTest, Priority } from '../../types/student';

interface TestsExamsViewProps {
  tests: UpcomingTest[];
  setTests: React.Dispatch<React.SetStateAction<UpcomingTest[]>>;
  onSyncCalendar?: (test: UpcomingTest) => void;
}

export const TestsExamsView: React.FC<TestsExamsViewProps> = ({
  tests,
  setTests,
  onSyncCalendar,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [selectedTestDetails, setSelectedTestDetails] = useState<UpcomingTest | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [newType, setNewType] = useState<UpcomingTest['type']>('Midterm');
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [newTime, setNewTime] = useState('10:00 AM - 12:00 PM');
  const [newRoom, setNewRoom] = useState('Exam Hall A');
  const [newSyllabus, setNewSyllabus] = useState('Chapter 1, Chapter 2, Chapter 3');
  const [newMarks, setNewMarks] = useState('50');
  const [newPriority, setNewPriority] = useState<Priority>('High');
  const [newSubmissionLink, setNewSubmissionLink] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Helper to calculate days remaining
  const getDaysRemaining = (dateStr: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDeleteTest = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
    if (selectedTestDetails?.id === id) {
      setSelectedTestDetails(null);
    }
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const syllabusArray = newSyllabus
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created: UpcomingTest = {
      id: `test-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject.trim(),
      type: newType,
      date: newDate,
      time: newTime,
      roomOrPlatform: newRoom,
      syllabus: syllabusArray.length > 0 ? syllabusArray : ['General coursework syllabus'],
      totalMarks: parseInt(newMarks) || 50,
      priority: newPriority,
      submissionLink: newSubmissionLink.trim() || undefined,
      notes: newNotes.trim() || undefined,
    };

    setTests((prev) => [...prev, created]);
    setIsAddingTest(false);
    setNewTitle('');
    setNewNotes('');
  };

  const filteredTests = tests.filter((t) => {
    if (filterType === 'All') return true;
    if (filterType === 'Exams') return t.type === 'Midterm' || t.type === 'Final Exam' || t.type === 'Unit Test';
    if (filterType === 'Assignments') return t.type === 'College Assignment';
    if (filterType === 'Quizzes/Labs') return t.type === 'Quiz' || t.type === 'Lab Evaluation';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-pink-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-pink-500 text-white font-bold">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
              Upcoming Tests, Exams & College Assignments 📚
            </h2>
          </div>
          <p className="text-xs md:text-sm text-stone-600 italic mt-1">
            Keep track of all exam dates, question patterns, syllabus checklists, and homework assignment submission portals!
          </p>
        </div>

        <button
          onClick={() => setIsAddingTest(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs md:text-sm font-bold rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Test / Assignment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Exams', 'Assignments', 'Quizzes/Labs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-1.5 rounded-2xl text-xs font-bold font-shantell italic transition-all cursor-pointer whitespace-nowrap ${
              filterType === tab
                ? 'bg-yellow-400 text-yellow-950 shadow-xs'
                : 'bg-white text-stone-700 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTests.map((test) => {
          const daysLeft = getDaysRemaining(test.date);
          const isUrgent = daysLeft <= 3 && daysLeft >= 0;
          const isWarning = daysLeft <= 7 && daysLeft > 3;

          return (
            <div
              key={test.id}
              className={`bg-white rounded-3xl p-5 border-2 shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${
                isUrgent
                  ? 'border-pink-400 bg-gradient-to-br from-pink-50/70 to-white'
                  : isWarning
                  ? 'border-yellow-300 bg-gradient-to-br from-amber-50/50 to-white'
                  : 'border-stone-200'
              }`}
            >
              <div>
                {/* Top Badge & Countdown */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      test.type === 'College Assignment'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : test.type.includes('Exam') || test.type === 'Midterm'
                        ? 'bg-pink-100 text-pink-800 border border-pink-200'
                        : 'bg-yellow-200 text-yellow-900 border border-yellow-300'
                    }`}
                  >
                    {test.type}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black font-shantell italic flex items-center gap-1 ${
                      daysLeft < 0
                        ? 'bg-stone-200 text-stone-600'
                        : daysLeft === 0
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isUrgent
                        ? 'bg-rose-500 text-white'
                        : isWarning
                        ? 'bg-amber-400 text-yellow-950 font-bold'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {daysLeft < 0
                      ? 'Completed'
                      : daysLeft === 0
                      ? '🚨 TODAY!'
                      : daysLeft === 1
                      ? '⚠️ TOMORROW!'
                      : `In ${daysLeft} days`}
                  </span>
                </div>

                {/* Title & Subject */}
                <h3 className="font-bold text-base font-shantell italic text-stone-900 leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs font-semibold text-pink-700 mt-1">{test.subject}</p>

                {/* Date / Time / Location metadata */}
                <div className="mt-3 space-y-1.5 text-xs text-stone-600 bg-white/70 p-3 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    <span>
                      <strong className="text-stone-800">Date:</strong> {test.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-yellow-600" />
                    <span>
                      <strong className="text-stone-800">Time:</strong> {test.time}
                    </span>
                  </div>
                  {test.roomOrPlatform && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      <span>
                        <strong className="text-stone-800">Venue / LMS:</strong>{' '}
                        {test.roomOrPlatform}
                      </span>
                    </div>
                  )}
                </div>

                {/* Syllabus Preview */}
                {test.syllabus && test.syllabus.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Syllabus Topics:
                    </span>
                    <ul className="text-xs text-stone-700 space-y-1 pl-1">
                      {test.syllabus.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {test.syllabus.length > 3 && (
                        <li className="text-[11px] text-pink-600 font-semibold italic">
                          +{test.syllabus.length - 3} more topics...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {test.notes && (
                  <p className="mt-3 text-[11px] text-stone-600 bg-amber-50/70 p-2 rounded-xl italic border border-yellow-200">
                    💡 <em>Note:</em> {test.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                {test.submissionLink ? (
                  <a
                    href={test.submissionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Submit on Portal
                  </a>
                ) : (
                  <span className="text-xs text-stone-400 font-medium">Marks: {test.totalMarks}</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Add New Test / Exam */}
      {isAddingTest && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTest}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border-2 border-pink-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-pink-200">
              <h3 className="font-shantell italic font-bold text-lg text-pink-700">
                Record New Test, Exam or Assignment 📝
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingTest(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Title / Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Operating Systems Final Exam"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 focus:outline-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Subject:</label>
                  <input
                    type="text"
                    placeholder="e.g. Operating Systems"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 focus:outline-pink-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300 font-semibold"
                  >
                    <option value="Midterm">Midterm Exam</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Unit Test">Unit Test</option>
                    <option value="Quiz">Quick Quiz</option>
                    <option value="College Assignment">College Assignment</option>
                    <option value="Lab Evaluation">Lab Practical / Viva</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Date:</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Total Marks:</label>
                  <input
                    type="number"
                    value={newMarks}
                    onChange={(e) => setNewMarks(e.target.value)}
                    className="w-full px-3 py-2 bg-pink-50/50 rounded-xl border border-pink-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Time:</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Room / Venue / Portal:</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 204 or Canvas LMS"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Syllabus Checklist (Comma-separated topics):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Process scheduling, Deadlocks, Virtual memory"
                  value={newSyllabus}
                  onChange={(e) => setNewSyllabus(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Online Assignment Portal URL (Optional):
                </label>
                <input
                  type="url"
                  placeholder="https://canvas.college.edu/..."
                  value={newSubmissionLink}
                  onChange={(e) => setNewSubmissionLink(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Important Notes / Rules:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Open book, scientific calculator allowed, submit before 11:59 PM"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-pink-200"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-pink-100">
              <button
                type="button"
                onClick={() => setIsAddingTest(false)}
                className="px-4 py-2 text-xs text-stone-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
