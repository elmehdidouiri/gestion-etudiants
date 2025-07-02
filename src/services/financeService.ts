import { Payment } from "../types/Payment";

const STORAGE_KEY = "payments";

function loadMock(): Payment[] {
  try {
    // @ts-ignore
    return require("../mocks/payments.json");
  } catch {
    return [];
  }
}

export function getPayments(): Promise<Payment[]> {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return Promise.resolve(JSON.parse(data));
  const mock = loadMock();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
  return Promise.resolve(mock);
}

export function addPayment(payment: Payment): Promise<void> {
  return getPayments().then((payments) => {
    const updated = [...payments, payment];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
}

export function updatePayment(id: string, data: Omit<Payment, "id">): Promise<void> {
  return getPayments().then((payments) => {
    const updated = payments.map((p) => (p.id === id ? { ...p, ...data } : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
}

export function deletePayment(id: string): Promise<void> {
  return getPayments().then((payments) => {
    const updated = payments.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  });
} 