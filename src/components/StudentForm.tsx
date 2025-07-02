import React, { useState } from "react";
import { Student } from "../types/Student";
import Button from "./Button";

interface StudentFormProps {
  initial?: Partial<Student>;
  onSubmit: (student: Omit<Student, "id">) => void;
  onCancel: () => void;
}

const empty: Omit<Student, "id"> = {
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "M",
  class: "",
  level: "",
  average: 0,
  payment: false,
  parentName: "",
  parentEmail: "",
  parentPhone: "",
};

const StudentForm: React.FC<StudentFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Omit<Student, "id">>({ ...empty, ...initial });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.class) {
      setError("Champs obligatoires manquants.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2">
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Nom"
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Prénom"
          className="border rounded px-2 py-1 flex-1"
          required
        />
      </div>
      <div className="flex gap-2">
        <input
          name="class"
          value={form.class}
          onChange={handleChange}
          placeholder="Classe"
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <input
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          placeholder="Date de naissance"
          type="date"
          className="border rounded px-2 py-1 flex-1"
        />
      </div>
      <div className="flex gap-2">
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="M">Garçon</option>
          <option value="F">Fille</option>
        </select>
        <input
          name="parentName"
          value={form.parentName}
          onChange={handleChange}
          placeholder="Nom du parent"
          className="border rounded px-2 py-1 flex-1"
        />
      </div>
      <div className="flex gap-2">
        <input
          name="parentEmail"
          value={form.parentEmail}
          onChange={handleChange}
          placeholder="Email parent"
          type="email"
          className="border rounded px-2 py-1 flex-1"
        />
        <input
          name="parentPhone"
          value={form.parentPhone}
          onChange={handleChange}
          placeholder="Téléphone parent"
          className="border rounded px-2 py-1 flex-1"
        />
      </div>
      <div className="flex gap-2">
        <input
          name="level"
          value={form.level}
          onChange={handleChange}
          placeholder="Niveau scolaire"
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <input
          name="average"
          value={form.average}
          onChange={e => setForm({ ...form, average: Number(e.target.value) })}
          placeholder="Moyenne générale"
          type="number"
          min="0"
          max="20"
          step="0.01"
          className="border rounded px-2 py-1 flex-1"
        />
        <select
          name="payment"
          value={form.payment ? "oui" : "non"}
          onChange={e => setForm({ ...form, payment: e.target.value === "oui" })}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="oui">Paiement : Oui</option>
          <option value="non">Paiement : Non</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Valider</Button>
      </div>
    </form>
  );
};

export default StudentForm; 