import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Users,
  Tag,
} from 'lucide-react';
import { CollegeEvent } from '../../types/student';

interface EventsRadarViewProps {
  events: CollegeEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CollegeEvent[]>>;
}

export const EventsRadarView: React.FC<EventsRadarViewProps> = ({
  events,
  setEvents,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CollegeEvent['type']>('Hackathon');
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [newTime, setNewTime] = useState('Starts 09:00 AM');
  const [newOrganizer, setNewOrganizer] = useState('Tech Society');
  const [newLocation, setNewLocation] = useState('Main Campus Innovation Center');
  const [newDescription, setNewDescription] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newTags, setNewTags] = useState('Prizes, Innovation, Teams');

  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const toggleRegistered = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRegistered: !e.isRegistered } : e))
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArr = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created: CollegeEvent = {
      id: `ev-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      date: newDate,
      time: newTime,
      organizer: newOrganizer.trim(),
      location: newLocation.trim(),
      description: newDescription.trim() || 'Exciting college event to boost skills and network!',
      alertDaysBefore: 5,
      link: newLink.trim() || undefined,
      tags: tagsArr,
      isRegistered: false,
    };

    setEvents((prev) => [created, ...prev]);
    setIsAddingEvent(false);
    setNewTitle('');
    setNewDescription('');
  };

  // Urgent events (within 5 days)
  const urgentEvents = events.filter((e) => {
    const days = getDaysUntil(e.date);
    return days >= 0 && days <= 5;
  });

  const filteredEvents = events.filter((e) => {
    if (filterType === 'All') return true;
    return e.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border-2 border-yellow-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-yellow-400 text-yellow-950 font-bold">
              <Sparkles className="w-5 h-5 text-pink-600" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-shantell italic text-stone-900">
              Events, Hackathons & Workshop Radar 🚀
            </h2>
          </div>
          <p className="text-xs md:text-sm text-stone-600 italic mt-1">
            Stay in the loop for student hackathons, hands-on tech workshops, guest lectures, and your customized learning sprints!
          </p>
        </div>

        <button
          onClick={() => setIsAddingEvent(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-pink-400 hover:opacity-95 text-stone-900 text-xs md:text-sm font-bold rounded-2xl shadow-sm border border-yellow-500 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 text-pink-700" />
          <span>Add Custom Event / Plan</span>
        </button>
      </div>

      {/* Active High-Priority Alert Banner if events are coming up */}
      {urgentEvents.length > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse-glow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-shantell italic font-bold text-base leading-snug">
                🚨 Alert: {urgentEvents.length} Event{urgentEvents.length > 1 ? 's' : ''} Starting Very Soon!
              </h3>
              <p className="text-xs text-white/90">
                "{urgentEvents[0].title}" is in {getDaysUntil(urgentEvents[0].date)} day(s)! Don't miss registration or team check-in!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-pink-700 px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap">
            Priority Alert Active
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Hackathon', 'Workshop', 'Seminar', 'College Fest', 'Custom Plan'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-1.5 rounded-2xl text-xs font-bold font-shantell italic transition-all cursor-pointer whitespace-nowrap ${
              filterType === tab
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-yellow-100 border border-yellow-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((event) => {
          const daysLeft = getDaysUntil(event.date);

          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl p-5 border-2 border-yellow-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header badge & countdown */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-200 text-yellow-950 border border-yellow-300">
                    {event.type}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-shantell italic ${
                      daysLeft <= 4 && daysLeft >= 0
                        ? 'bg-rose-500 text-white font-black'
                        : 'bg-amber-100 text-yellow-950'
                    }`}
                  >
                    {daysLeft === 0 ? 'Starts Today!' : daysLeft > 0 ? `In ${daysLeft} days` : 'Past Event'}
                  </span>
                </div>

                <h3 className="font-bold text-base font-shantell italic text-stone-900 leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1">Organized by: {event.organizer}</p>

                {/* Event Description */}
                <p className="text-xs text-stone-700 mt-2.5 leading-relaxed bg-amber-50/50 p-2.5 rounded-2xl border border-yellow-100">
                  {event.description}
                </p>

                {/* Metadata */}
                <div className="mt-3 space-y-1 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    <span>{event.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-yellow-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {event.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-lg border border-pink-100"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleRegistered(event.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    event.isRegistered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-stone-700 hover:bg-yellow-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{event.isRegistered ? 'Registered! 🎉' : 'Mark Registered'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-pink-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Event Link
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Custom Event / Plan */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border-2 border-yellow-400 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-yellow-200">
              <h3 className="font-shantell italic font-bold text-lg text-yellow-950">
                Add Event or Customized Plan 🚀
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Event / Plan Title:</label>
                <input
                  type="text"
                  placeholder="e.g. National Student Web3 Hackathon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-amber-50 rounded-xl border border-yellow-300 focus:outline-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300 font-semibold"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar / Guest Talk</option>
                    <option value="College Fest">College Fest</option>
                    <option value="Custom Plan">Customized Student Plan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Event Date:</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Time / Duration:</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 05:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Organizer / Host:</label>
                  <input
                    type="text"
                    placeholder="e.g. Coding Club / Tech Society"
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Venue / Online Link:</label>
                <input
                  type="text"
                  placeholder="e.g. Innovation Hall or Zoom Meeting"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Registration URL (Optional):</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description / Details:</label>
                <textarea
                  rows={2}
                  placeholder="What is this event about? Team details, prize money, agenda..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Tags (Comma-separated):</label>
                <input
                  type="text"
                  placeholder="e.g. AI, $5000 Prizes, Certificate, Networking"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-yellow-300"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-yellow-200">
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="px-4 py-2 text-xs text-stone-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-bold rounded-2xl shadow-sm border border-yellow-500 cursor-pointer"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
