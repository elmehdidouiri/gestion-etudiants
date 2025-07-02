import { Student } from "../types/Student";
import studentsData from "../mocks/students.json";

let students: Student[] = studentsData as Student[];

export const getStudents = async (): Promise<Student[]> => {
  return students.filter(s => !s.archived);
};

export const getArchivedStudents = async (): Promise<Student[]> => {
  return students.filter(s => s.archived);
};

export const addStudent = async (student: Student): Promise<void> => {
  students.push(student);
};

export const updateStudent = async (id: string, updated: Partial<Student>): Promise<void> => {
  students = students.map(s => (s.id === id ? { ...s, ...updated } : s));
};

export const deleteStudent = async (id: string): Promise<void> => {
  students = students.filter(s => s.id !== id);
};

export const archiveStudent = async (id: string): Promise<void> => {
  students = students.map(s => (s.id === id ? { ...s, archived: true } : s));
}; 