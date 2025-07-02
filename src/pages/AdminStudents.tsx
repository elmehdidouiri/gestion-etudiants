import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Student } from "../types/Student";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  archiveStudent,
} from "../services/studentService";
import Button from "../components/Button";
import Modal from "../components/Modal";
import StudentForm from "../components/StudentForm";
import { UserPlusIcon, PencilSquareIcon, ArchiveBoxIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    getStudents().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (data: Omit<Student, "id">) => {
    await addStudent({ ...data, id: Date.now().toString() });
    setModalOpen(false);
    toast.success("Élève ajouté avec succès");
    refresh();
  };

  const handleEdit = async (data: Omit<Student, "id">) => {
    if (!editStudent) return;
    await updateStudent(editStudent.id, data);
    setEditStudent(null);
    setModalOpen(false);
    toast.success("Élève modifié avec succès");
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteStudent(deleteId);
    setDeleteId(null);
    toast.info("Élève supprimé");
    refresh();
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    await archiveStudent(archiveId);
    setArchiveId(null);
    toast.success("Élève archivé");
    refresh();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
          <UserPlusIcon className="h-8 w-8 text-green-500 animate-bounce-slow" /> Gestion des élèves
        </h1>
        <Button onClick={() => { setEditStudent(null); setModalOpen(true); }} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-green-400">
          <UserPlusIcon className="h-5 w-5" /> Ajouter un élève
        </Button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="w-full animate-fade-in bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-1 sm:p-2 md:p-6 overflow-x-auto max-h-[calc(100vh-220px)] overflow-y-auto">
          <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-blue-800 border-b border-blue-200">
                <th className="px-3 md:px-5 py-3 font-bold text-left">Nom</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Prénom</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Classe</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Date de naissance</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Parent</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Contact</th>
                <th className="px-3 md:px-5 py-3 font-bold text-left">Niveau</th>
                <th className="px-3 md:px-5 py-3 font-bold text-right">Moyenne</th>
                <th className="px-3 md:px-5 py-3 font-bold text-right">Paiement</th>
                <th className="px-3 md:px-5 py-3 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id} className={
                  `border-b border-blue-100 transition ` +
                  (idx % 2 === 0 ? "bg-white" : "bg-blue-50/60") +
                  " hover:bg-green-50"
                }>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{student.lastName}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{student.firstName}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{student.class}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{student.birthDate}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{student.parentName}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{student.parentPhone}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{student.level}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-right">{student.average}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-right">{student.payment ? "Oui" : "Non"}</td>
                  <td className="px-3 md:px-5 py-3 flex gap-2 justify-center items-center text-center">
                    <Button variant="secondary" className="rounded-full p-2 bg-white border border-blue-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 transition" onClick={() => { setEditStudent(student); setModalOpen(true); }}>
                      <PencilSquareIcon className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button variant="danger" className="rounded-full p-2 bg-white border border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-400 transition" onClick={() => setDeleteId(student.id)}>
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </Button>
                    <Button variant="secondary" className="rounded-full p-2 bg-white border border-green-300 hover:bg-green-100 focus:ring-2 focus:ring-green-400 transition" onClick={() => setArchiveId(student.id)}>
                      <ArchiveBoxIcon className="h-5 w-5 text-green-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modale ajout/modif */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditStudent(null); }} title={editStudent ? "Modifier l'élève" : "Ajouter un élève"}>
        <StudentForm
          initial={editStudent || undefined}
          onSubmit={editStudent ? handleEdit : handleAdd}
          onCancel={() => { setModalOpen(false); setEditStudent(null); }}
        />
      </Modal>
      {/* Modale suppression */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Supprimer l'élève ?">
        <div className="space-y-4">
          <p>Confirmez-vous la suppression de cet élève ?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
            <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
          </div>
        </div>
      </Modal>
      {/* Modale archivage */}
      <Modal isOpen={!!archiveId} onClose={() => setArchiveId(null)} title="Archiver l'élève ?">
        <div className="space-y-4">
          <p>Confirmez-vous l'archivage de cet élève ?</p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setArchiveId(null)}>Annuler</Button>
            <Button variant="primary" onClick={handleArchive}>Archiver</Button>
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
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminStudents; 