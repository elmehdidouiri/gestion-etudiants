export interface Payment {
  id: string;
  studentId: string;
  amountDue: number;
  amountPaid: number;
  status: "payé" | "en retard";
  date: string;
  description?: string;
} 