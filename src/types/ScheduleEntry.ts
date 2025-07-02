export interface ScheduleEntry {
  id: string;
  class: string;
  day: string; // ex: 'Lundi', 'Mardi', ...
  startTime: string; // ex: '08:00'
  endTime: string;   // ex: '09:00'
  subject: string;
  teacher: string;
  room: string;
  description?: string;
} 