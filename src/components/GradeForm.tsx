import React, { useState } from "react";
import { Grade } from "../types/Grade";
import { Student } from "../types/Student";

interface GradeFormProps {
  students: Student[];
  initial?: Partial<Grade>;
  onSubmit: (data: Omit<Grade, "id">) => void;
  onCancel: () => void;
}

const subjects = ["Mathématiques", "Français", "Histoire", "SVT", "Anglais"];

const GradeForm: React.FC<GradeFormProps> = ({ students, initial = {}, onSubmit, onCancel }) => {
  const [studentId, setStudentId] = useState(initial.studentId || "");
  const [subject, setSubject] = useState(initial.subject || subjects[0]);
  const [value, setValue] = useState(initial.value?.toString() || "");
  const [appreciation, setAppreciation] = useState(initial.appreciation || "");
  const [date, setDate] = useState(initial.date || new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !subject || !value || isNaN(Number(value))) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    onSubmit({
      studentId,
      subject,
      value: Number(value),
      appreciation,
      date,
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
      <div>
        <label className="block font-semibold mb-1">Matière <span className="text-red-500">*</span></label>
        <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400">
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Note <span className="text-red-500">*</span></label>
        <input type="number" min="0" max="20" step="0.1" value={value} onChange={e => setValue(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Appréciation</label>
        <textarea value={appreciation} onChange={e => setAppreciation(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" rows={2} />
      </div>
      <div>
        <label className="block font-semibold mb-1">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100 text-blue-700 font-semibold hover:bg-gray-200 transition">Annuler</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-green-400">Valider</button>
      </div>
    </form>
  );
};

export default GradeForm; 