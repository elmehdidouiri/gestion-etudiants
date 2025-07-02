import React, { useState } from "react";
import { Payment } from "../types/Payment";
import { Student } from "../types/Student";

interface PaymentFormProps {
  students: Student[];
  initial?: Partial<Payment>;
  onSubmit: (data: Omit<Payment, "id">) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ students, initial = {}, onSubmit, onCancel }) => {
  const [studentId, setStudentId] = useState(initial.studentId || "");
  const [amountDue, setAmountDue] = useState(initial.amountDue?.toString() || "");
  const [amountPaid, setAmountPaid] = useState(initial.amountPaid?.toString() || "");
  const [status, setStatus] = useState<"payé" | "en retard">(initial.status || "payé");
  const [date, setDate] = useState(initial.date || new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(initial.description || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !amountDue || !amountPaid || isNaN(Number(amountDue)) || isNaN(Number(amountPaid))) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    onSubmit({
      studentId,
      amountDue: Number(amountDue),
      amountPaid: Number(amountPaid),
      status,
      date,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      <div>
        <label className="block font-semibold mb-1">Élève <span className="text-red-500">*</span></label>
        <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400">
          <option value="">Sélectionner un élève</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>)}
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Montant dû <span className="text-red-500">*</span></label>
          <input type="number" min="0" value={amountDue} onChange={e => setAmountDue(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Montant payé <span className="text-red-500">*</span></label>
          <input type="number" min="0" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Statut <span className="text-red-500">*</span></label>
        <select value={status} onChange={e => setStatus(e.target.value as "payé" | "en retard")} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400">
          <option value="payé">Payé</option>
          <option value="en retard">En retard</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Date <span className="text-red-500">*</span></label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" rows={2} />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100 text-blue-700 font-semibold hover:bg-gray-200 transition">Annuler</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-green-400">Valider</button>
      </div>
    </form>
  );
};

export default PaymentForm; 