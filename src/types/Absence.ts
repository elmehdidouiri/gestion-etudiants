export interface Absence {
  id: string;
  studentId: string;
  date: string;
  type: "absence" | "retard";
  justified: boolean;
  comment?: string;
  notified?: boolean;
} 