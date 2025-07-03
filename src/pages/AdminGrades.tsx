import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { AcademicCapIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { getGrades } from "../services/gradeService";
import { getStudents } from "../services/studentService";
import { Grade } from "../types/Grade";
import { Student } from "../types/Student";
import GradeForm from "../components/GradeForm";
import Modal from "../components/Modal";
import { addGrade, updateGrade, deleteGrade } from "../services/gradeService";
import { toast } from "react-toastify";
import { getSchedule } from "../services/scheduleService";
import { ScheduleEntry } from "../types/ScheduleEntry";

const subjects = ["Mathématiques", "Français", "Histoire", "SVT", "Anglais"];

const AdminGrades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editGrade, setEditGrade] = useState<Grade | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  const refresh = () => {
    Promise.all([getGrades(), getStudents()]).then(([g, s]) => {
      setGrades(g);
      setStudents(s);
    });
  };

  useEffect(() => {
    refresh();
    getSchedule().then(setSchedule);
  }, []);

  const handleAdd = async (data: Omit<Grade, "id">) => {
    await addGrade({ ...data, id: Date.now().toString() });
    setModalOpen(false);
    toast.success("Note ajoutée avec succès");
    refresh();
  };

  const handleEdit = async (data: Omit<Grade, "id">) => {
    if (!editGrade) return;
    await updateGrade(editGrade.id, data);
    setEditGrade(null);
    setModalOpen(false);
    toast.success("Note modifiée avec succès");
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteGrade(deleteId);
    setDeleteId(null);
    toast.info("Note supprimée");
    refresh();
  };

  // Liste complète de classes à afficher
  const allPossibleClasses = [
    "3A", "3B", "3C",
    "4A", "4B", "4C",
    "5A", "5B", "5C", "5D",
    "6A", "6B", "6C", "6D"
  ];
  const classesFromStudents = students.map(s => s.class);
  const classesFromSchedule = schedule.map(e => e.class);
  const classes = Array.from(new Set([...allPossibleClasses, ...classesFromStudents, ...classesFromSchedule]));
  const studentList = students.filter(s => !filterClass || s.class === filterClass);

  // Debug : affichage de la liste des classes
  <div className="mb-4 text-xs text-gray-500">Classes détectées : {classes.join(", ")}</div>

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <AcademicCapIcon className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">Gestion des notes</h1>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-green-400 px-4 py-2 rounded-xl"
          onClick={() => { setEditGrade(null); setModalOpen(true); }}
        >
          <PlusCircleIcon className="h-5 w-5" /> Ajouter une note
        </button>
      </div>
      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6 items-center bg-blue-50/60 rounded-xl px-4 py-3 shadow border border-blue-100">
        <div>
          <label className="font-semibold text-blue-700 mr-2">Classe :</label>
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400">
            <option value="">Toutes</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="font-semibold text-blue-700 mr-2">Matière :</label>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400">
            <option value="">Toutes</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="font-semibold text-blue-700 mr-2">Élève :</label>
          <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)} className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400">
            <option value="">Tous</option>
            {studentList.map(s => <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>)}
          </select>
        </div>
      </div>
      {/* Affichage des notes par classe et par matière avec Voir plus / Voir moins */}
      <div className="space-y-10 mb-8">
        {(filterClass ? [filterClass] : classes).map(classe => {
          // Récupérer toutes les notes de la classe
          const notesClasse = grades.filter(g => {
            const stu = students.find(s => s.id === g.studentId);
            return stu && stu.class === classe && (!filterSubject || g.subject === filterSubject) && (!filterStudent || g.studentId === filterStudent);
          });
          if (notesClasse.length === 0) return null;
          return (
            <div key={classe} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-blue-700">Classe {classe}</h2>
                <button
                  className="px-4 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                  onClick={() => setExpandedClass(expandedClass === classe ? null : classe)}
                >
                  {expandedClass === classe ? 'Voir moins' : 'Voir plus'}
                </button>
              </div>
              {expandedClass === classe && (
                <div className="space-y-6 mt-4">
                  {(filterSubject ? [filterSubject] : subjects).map(subject => {
                    const notesMatiere = notesClasse.filter(g => g.subject === subject);
                    if (notesMatiere.length === 0) return null;
                    return (
                      <div key={subject} className="mb-6">
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">{subject}</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
                            <thead>
                              <tr className="bg-blue-100 text-blue-800 border-b border-blue-200">
                                <th className="px-3 md:px-5 py-3 font-bold text-left">Élève</th>
                                <th className="px-3 md:px-5 py-3 font-bold text-right">Note</th>
                                <th className="px-3 md:px-5 py-3 font-bold text-left">Appréciation</th>
                                <th className="px-3 md:px-5 py-3 font-bold text-left">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {notesMatiere.map((g, idx) => {
                                const stu = students.find(s => s.id === g.studentId);
                                return (
                                  <tr key={g.id} className={
                                    `border-b border-blue-100 transition ` +
                                    (idx % 2 === 0 ? "bg-white" : "bg-blue-50/60") +
                                    " hover:bg-green-50"
                                  }>
                                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{stu ? `${stu.lastName} ${stu.firstName}` : "-"}</td>
                                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-right">{g.value}</td>
                                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{g.appreciation || "-"}</td>
                                    <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{g.date}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Modale ajout/modif */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditGrade(null); }} title={editGrade ? "Modifier la note" : "Ajouter une note"}>
        <GradeForm
          students={students}
          initial={editGrade || undefined}
          onSubmit={editGrade ? handleEdit : handleAdd}
          onCancel={() => { setModalOpen(false); setEditGrade(null); }}
        />
      </Modal>
      {/* Modale suppression */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Supprimer la note ?">
        <div className="space-y-4">
          <p>Confirmez-vous la suppression de cette note ?</p>
          <div className="flex gap-2 justify-end">
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-blue-700 font-semibold hover:bg-gray-200 transition" onClick={() => setDeleteId(null)}>Annuler</button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-red-400" onClick={handleDelete}>Supprimer</button>
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

export default AdminGrades; 