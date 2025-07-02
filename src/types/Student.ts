export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "M" | "F";
  class: string;
  level: string;
  average: number;
  payment: boolean;
  archived?: boolean;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
} 