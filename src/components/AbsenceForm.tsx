import React, { useState } from "react";
import { Absence } from "../types/Absence";
import { Student } from "../types/Student";
import Button from "./Button";

interface AbsenceFormProps {
  students: Student[];
  initial?: Partial<Absence>;
  onSubmit: (absence: Omit<Absence, "id">) => void;
  onCancel: () => void;
}

const empty: Omit<Absence, "id"> = {
  studentId: "",
  date: "",
  type: "absence",
  justified: false,
  comment: "",
};

const AbsenceForm: React.FC<AbsenceFormProps> = ({ students, initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Omit<Absence, "id">>({ ...empty, ...initial });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({
        ...form,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.date) {
      setError("Champs obligatoires manquants.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
        >
          <option value="">Sélectionner un élève</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.lastName} {s.firstName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="absence">Absence</option>
          <option value="retard">Retard</option>
        </select>
        <label className="flex items-center gap-1">
          <input
            name="justified"
            type="checkbox"
            checked={form.justified}
            onChange={handleChange}
            className="mr-1"
          />
          Justifiée
        </label>
      </div>
      <div>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Commentaire (optionnel)"
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Valider</Button>
      </div>
    </form>
  );
};

export default AbsenceForm; 