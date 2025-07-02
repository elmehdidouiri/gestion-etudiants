import { Absence } from "../types/Absence";
import absencesData from "../mocks/absences.json";

let absences: Absence[] = absencesData as Absence[];

export const getAbsences = async (): Promise<Absence[]> => {
  return absences;
};

export const addAbsence = async (absence: Absence): Promise<void> => {
  absences.push(absence);
};

export const updateAbsence = async (id: string, updated: Partial<Absence>): Promise<void> => {
  absences = absences.map(a => (a.id === id ? { ...a, ...updated } : a));
};

export const deleteAbsence = async (id: string): Promise<void> => {
  absences = absences.filter(a => a.id !== id);
}; 