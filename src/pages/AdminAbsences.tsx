import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Absence } from "../types/Absence";
import { getAbsences } from "../services/absenceService";
import { getStudents } from "../services/studentService";
import { Student } from "../types/Student";
import Button from "../components/Button";
import Modal from "../components/Modal";
import AbsenceForm from "../components/AbsenceForm";
import { addAbsence, updateAbsence, deleteAbsence } from "../services/absenceService";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { CalendarDaysIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
dayjs.extend(isBetween);

const AdminAbsences: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAbsence, setEditAbsence] = useState<Absence | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [period, setPeriod] = useState<"semaine" | "mois">("semaine");
  const [periodStart, setPeriodStart] = useState<string>(dayjs().startOf("week").format("YYYY-MM-DD"));

  const refresh = () => {
    setLoading(true);
    Promise.all([getAbsences(), getStudents()]).then(([abs, studs]) => {
      setAbsences(abs);
      setStudents(studs);
      setLoading(false);
    });
  };

  const handleAdd = async (data: Omit<Absence, "id">) => {
    const absenceWithNotif = { ...data, id: Date.now().toString(), notified: true };
    await addAbsence(absenceWithNotif);
    setModalOpen(false);
    toast.success("Absence/retard ajouté(e). Notification envoyée au parent (simulation SMS/email)");
    refresh();
  };

  const handleEdit = async (data: Omit<Absence, "id">) => {
    if (!editAbsence) return;
    await updateAbsence(editAbsence.id, data);
    setEditAbsence(null);
    setModalOpen(false);
    toast.success("Absence/retard modifié(e)");
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteAbsence(deleteId);
    setDeleteId(null);
    toast.info("Absence/retard supprimé(e)");
    refresh();
  };

  useEffect(() => {
    refresh();
  }, []);

  const getStudentName = (id: string) => {
    const s = students.find(stu => stu.id === id);
    return s ? `${s.lastName} ${s.firstName}` : "-";
  };

  // Filtrage des absences selon la période
  const filteredAbsences = absences.filter(a => {
    const date = dayjs(a.date);
    const start = dayjs(periodStart);
    const end = period === "semaine" ? start.add(6, "day") : start.add(1, "month").subtract(1, "day");
    return date.isBetween(start.subtract(1, 'day'), end.add(1, 'day'), null, '[]');
  });

  // Rapport par élève
  const report = students.map(s => {
    const abs = filteredAbsences.filter(a => a.studentId === s.id && a.type === "absence").length;
    const ret = filteredAbsences.filter(a => a.studentId === s.id && a.type === "retard").length;
    return { ...s, abs, ret };
  }).filter(r => r.abs > 0 || r.ret > 0);

  const showNoDataMsg = report.length === 0 && (period !== 'semaine' || periodStart !== dayjs().startOf('week').format('YYYY-MM-DD'));

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">Suivi des absences et retards</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center bg-blue-50/60 rounded-xl px-4 py-2 shadow border border-blue-100">
          <label className="font-semibold text-blue-700 flex items-center gap-1"><CalendarDaysIcon className="h-5 w-5 text-green-500" />Période :</label>
          <select value={period} onChange={e => {
            setPeriod(e.target.value as "semaine" | "mois");
            setPeriodStart(period === "semaine"
              ? dayjs().startOf("week").format("YYYY-MM-DD")
              : dayjs().startOf("month").format("YYYY-MM-DD")
            );
          }} className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400">
            <option value="semaine">Semaine</option>
            <option value="mois">Mois</option>
          </select>
          <input
            type="date"
            value={periodStart}
            onChange={e => setPeriodStart(e.target.value)}
            className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <Button onClick={() => { setEditAbsence(null); setModalOpen(true); }} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-green-400 px-4 py-2 rounded-xl">
          <PlusCircleIcon className="h-5 w-5" /> Saisir une absence/retard
        </Button>
      </div>
      {/* Rapport récapitulatif */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Rapport {period === "semaine" ? "hebdomadaire" : "mensuel"}</h2>
        {showNoDataMsg && (
          <div className="text-gray-500">Aucune absence ou retard sur la période sélectionnée.</div>
        )}
        {report.length > 0 && (
          <div className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-1 sm:p-2 md:p-6">
            <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-blue-100 text-blue-800 border-b border-blue-200">
                  <th className="px-3 md:px-5 py-3 font-bold text-left">Élève</th>
                  <th className="px-3 md:px-5 py-3 font-bold text-left">Classe</th>
                  <th className="px-3 md:px-5 py-3 font-bold text-right">Absences</th>
                  <th className="px-3 md:px-5 py-3 font-bold text-right">Retards</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r, idx) => (
                  <tr key={r.id} className={
                    `border-b border-blue-100 transition ` +
                    (idx % 2 === 0 ? "bg-white" : "bg-blue-50/60") +
                    " hover:bg-green-50"
                  }>
                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{r.lastName} {r.firstName}</td>
                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{r.class}</td>
                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-right">{r.abs}</td>
                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-right">{r.ret}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-1 sm:p-2 md:p-6 max-h-[calc(100vh-320px)] overflow-y-auto">
          <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-blue-800 border-b border-blue-200">
                <th className="px-3 md:px-5 py-3 font-bold text-left">Élève</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Date</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Type</th>
                <th className="px-3 md:px-5 py-3 font-bold text-center">Justifiée</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Commentaire</th>
                <th className="px-3 md:px-5 py-3 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence, idx) => (
                <tr key={absence.id} className={
                  `border-b border-blue-100 transition ` +
                  (idx % 2 === 0 ? "bg-white" : "bg-blue-50/60") +
                  " hover:bg-green-50"
                }>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{getStudentName(absence.studentId)}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{absence.date}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{absence.type === "absence" ? "Absence" : "Retard"}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-center">{absence.justified ? "Oui" : "Non"}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{absence.comment || "-"}</td>
                  <td className="px-3 md:px-5 py-3 flex gap-2 justify-center items-center text-center">
                    {absence.notified && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mr-2">Notification envoyée</span>
                    )}
                    <Button variant="secondary" className="rounded-full p-2 bg-white border border-blue-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 transition" onClick={() => { setEditAbsence(absence); setModalOpen(true); }}>
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 4.487a2.1 2.1 0 112.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303z" /></svg>
                    </Button>
                    <Button variant="danger" className="rounded-full p-2 bg-white border border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-400 transition" onClick={() => setDeleteId(absence.id)}>
                      <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modale ajout/modif */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditAbsence(null); }} title={editAbsence ? "Modifier l'absence/retard" : "Saisir une absence/retard"}>
        <AbsenceForm
          students={students}
          initial={editAbsence || undefined}
          onSubmit={editAbsence ? handleEdit : handleAdd}
          onCancel={() => { setModalOpen(false); setEditAbsence(null); }}
        />
      </Modal>
      {/* Modale suppression */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Supprimer l'absence/retard ?">
        <div className="space-y-4">
          <p>Confirmez-vous la suppression de cette absence/retard ?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
            <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
          </div>
        </div>
      </Modal>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminAbsences; 