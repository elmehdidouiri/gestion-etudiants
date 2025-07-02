import { Grade } from "../types/Grade";

const STORAGE_KEY = "grades";

function loadMock(): Grade[] {
  try {
    // @ts-ignore
    return require("../mocks/grades.json");
  } catch {
    return [];
  }
}

export function getGrades(): Promise<Grade[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return Promise.resolve(JSON.parse(data));
  const mock = loadMock();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
  return Promise.resolve(mock);
}

export function addGrade(grade: Grade): Promise<void> {
  return getGrades().then((grades) => {
    const updated = [...grades, grade];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
}

export function updateGrade(id: string, data: Omit<Grade, "id">): Promise<void> {
  return getGrades().then((grades) => {
    const updated = grades.map((g) => (g.id === id ? { ...g, ...data } : g));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
}

export function deleteGrade(id: string): Promise<void> {
  return getGrades().then((grades) => {
    const updated = grades.filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
} 