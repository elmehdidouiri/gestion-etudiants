import { ScheduleEntry } from "../types/ScheduleEntry";

const STORAGE_KEY = "schedule";

function loadMock(): ScheduleEntry[] {
  try {
    // @ts-ignore
    return require("../mocks/schedule.json");
  } catch {
    return [];
  }
}

export function getSchedule(): Promise<ScheduleEntry[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return Promise.resolve(JSON.parse(data));
  const mock = loadMock();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
  return Promise.resolve(mock);
}

export function addScheduleEntry(entry: ScheduleEntry): Promise<void> {
  return getSchedule().then((schedule) => {
    const updated = [...schedule, entry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
}

export function updateScheduleEntry(id: string, data: Omit<ScheduleEntry, "id">): Promise<void> {
  return getSchedule().then((schedule) => {
    const updated = schedule.map((e) => (e.id === id ? { ...e, ...data } : e));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
}

export function deleteScheduleEntry(id: string): Promise<void> {
  return getSchedule().then((schedule) => {
    const updated = schedule.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
} 