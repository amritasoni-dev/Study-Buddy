export type Priority = 'High' | 'Medium' | 'Low';

export interface TodoTask {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: Priority;
  dueTime?: string;
  estimatedMinutes?: number;
  category?: 'study' | 'assignment' | 'revision' | 'personal';
  createdAt: string;
}

export interface WeeklyTask {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  title: string;
  subject: string;
  duration: string;
  priority: Priority;
  completed: boolean;
  type: 'Study' | 'Assignment' | 'Revision' | 'Quiz Prep' | 'Lab' | 'Review';
}

export interface WeekendPlanItem {
  id: string;
  dayType: 'Saturday' | 'Sunday' | 'Holiday';
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  title: string;
  category: 'Study & Catchup' | 'Project & Hackathon' | 'Fun & Relaxation' | 'Hobby & Skills' | 'Health & Exercise';
  duration: string;
  completed: boolean;
}

export interface UpcomingTest {
  id: string;
  title: string;
  subject: string;
  type: 'Midterm' | 'Final Exam' | 'Unit Test' | 'Quiz' | 'College Assignment' | 'Lab Evaluation';
  date: string; // YYYY-MM-DD
  time: string;
  roomOrPlatform?: string;
  syllabus: string[];
  totalMarks?: number;
  priority: Priority;
  submissionLink?: string;
  notes?: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Seminar' | 'College Fest' | 'Custom Plan';
  date: string; // YYYY-MM-DD
  time: string;
  organizer: string;
  location: string;
  description: string;
  alertDaysBefore: number;
  link?: string;
  tags?: string[];
  isRegistered?: boolean;
}

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: 'yellow' | 'pink' | 'mint' | 'peach' | 'lavender';
  isPinned: boolean;
  date: string;
  tags: string[];
}

export interface CalendarMarker {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'test' | 'assignment' | 'hackathon' | 'holiday' | 'custom';
  label: string;
  color: string;
  note?: string;
}

export interface ScreenTimeStats {
  sessionSeconds: number;
  todayAppMinutes: number;
  todayToolsMinutes: number;
  todayBreaksMinutes: number;
  dailyGoalHours: number;
  dailyLimitHours: number;
  focusSessionsCompleted: number;
}
