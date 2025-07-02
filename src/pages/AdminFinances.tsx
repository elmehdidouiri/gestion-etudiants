import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { CurrencyDollarIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { getPayments } from "../services/financeService";
import { getStudents } from "../services/studentService";
import { Payment } from "../types/Payment";
import { Student } from "../types/Student";
import PaymentForm from "../components/PaymentForm";
import Modal from "../components/Modal";
import { addPayment, updatePayment, deletePayment } from "../services/financeService";
import { toast } from "react-toastify";

const AdminFinances: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    Promise.all([getPayments(), getStudents()]).then(([p, s]) => {
      setPayments(p);
      setStudents(s);
      setLoading(false);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (data: Omit<Payment, "id">) => {
    await addPayment({ ...data, id: Date.now().toString() });
    setModalOpen(false);
    toast.success("Paiement ajouté avec succès");
    refresh();
  };

  const handleEdit = async (data: Omit<Payment, "id">) => {
    if (!editPayment) return;
    await updatePayment(editPayment.id, data);
    setEditPayment(null);
    setModalOpen(false);
    toast.success("Paiement modifié avec succès");
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deletePayment(deleteId);
    setDeleteId(null);
    toast.info("Paiement supprimé");
    refresh();
  };

  // Filtres
  const filtered = payments.filter(p => {
    const stu = students.find(s => s.id === p.studentId);
    return (
      (!filterClass || (stu && stu.class === filterClass)) &&
      (!filterStatus || p.status === filterStatus) &&
      (!filterStudent || p.studentId === filterStudent)
    );
  });

  // Statistiques
  const totalDue = filtered.reduce((sum, p) => sum + p.amountDue, 0);
  const totalPaid = filtered.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalRest = totalDue - totalPaid;
  const countPaid = filtered.filter(p => p.status === "payé").length;
  const countLate = filtered.filter(p => p.status === "en retard").length;
  const percentPaid = filtered.length ? Math.round((countPaid / filtered.length) * 100) : 0;
  const avgPaid = filtered.length ? Math.round(totalPaid / filtered.length) : 0;
  const avgDue = filtered.length ? Math.round(totalDue / filtered.length) : 0;

  // Listes pour filtres
  const classes = Array.from(new Set(students.map(s => s.class)));
  const studentList = students.filter(s => !filterClass || s.class === filterClass);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">Gestion des finances</h1>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-green-400 px-4 py-2 rounded-xl"
          onClick={() => { setEditPayment(null); setModalOpen(true); }}
        >
          <PlusCircleIcon className="h-5 w-5" /> Ajouter un paiement
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
          <label className="font-semibold text-blue-700 mr-2">Statut :</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400">
            <option value="">Tous</option>
            <option value="payé">Payé</option>
            <option value="en retard">En retard</option>
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
      {/* Statistiques */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-blue-100 min-w-[160px]">
          <div className="text-xs text-gray-500">Total dû</div>
          <div className="text-2xl font-bold text-blue-700">{totalDue} DH</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-blue-100 min-w-[160px]">
          <div className="text-xs text-gray-500">Total payé</div>
          <div className="text-2xl font-bold text-green-600">{totalPaid} DH</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-blue-100 min-w-[160px]">
          <div className="text-xs text-gray-500">Reste à payer</div>
          <div className="text-2xl font-bold text-red-500">{totalRest} DH</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-blue-100 min-w-[160px]">
          <div className="text-xs text-gray-500">Élèves à jour</div>
          <div className="text-2xl font-bold text-green-600">{countPaid}</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-blue-100 min-w-[160px]">
          <div className="text-xs text-gray-500">En retard</div>
          <div className="text-2xl font-bold text-red-500">{countLate}</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-green-100 min-w-[160px]">
          <div className="text-xs text-gray-500">% Paiements à jour</div>
          <div className="text-2xl font-bold text-green-700">{percentPaid}%</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-blue-100 min-w-[160px]">
          <div className="text-xs text-gray-500">Moyenne payé</div>
          <div className="text-2xl font-bold text-blue-700">{avgPaid} DH</div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow p-4 border border-blue-100 min-w-[160px]">
          <div className="text-xs text-gray-500">Moyenne dû</div>
          <div className="text-2xl font-bold text-blue-700">{avgDue} DH</div>
        </div>
      </div>
      {/* Tableau des paiements */}
      <div className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-1 sm:p-2 md:p-6 max-h-[calc(100vh-320px)] overflow-y-auto">
        <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-blue-800 border-b border-blue-200">
              <th className="px-3 md:px-5 py-3 font-bold text-left">Élève</th>
              <th className="px-3 md:px-5 py-3 font-bold text-left">Classe</th>
              <th className="px-3 md:px-5 py-3 font-bold text-right">Montant dû</th>
              <th className="px-3 md:px-5 py-3 font-bold text-right">Montant payé</th>
              <th className="px-3 md:px-5 py-3 font-bold text-center">Statut</th>
              <th className="px-3 md:px-5 py-3 font-bold text-left">Date</th>
              <th className="px-3 md:px-5 py-3 font-bold text-left">Description</th>
              <th className="px-3 md:px-5 py-3 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8">Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-500">Aucun paiement trouvé.</td></tr>
            ) : filtered.map((p, idx) => {
              const stu = students.find(s => s.id === p.studentId);
              return (
                <tr key={p.id} className={
                  `border-b border-blue-100 transition ` +
                  (idx % 2 === 0 ? "bg-white" : "bg-blue-50/60") +
                  " hover:bg-green-50"
                }>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{stu ? `${stu.lastName} ${stu.firstName}` : "-"}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{stu ? stu.class : "-"}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-right">{p.amountDue} DH</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-right">{p.amountPaid} DH</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-center">
                    <span className={p.status === "payé" ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold" : "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold"}>{p.status}</span>
                  </td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{p.date}</td>
                  <td className="px-3 md:px-5 py-3 whitespace-nowrap text-left">{p.description || "-"}</td>
                  <td className="px-3 md:px-5 py-3 flex gap-2 justify-center items-center text-center">
                    <button className="rounded-full p-2 bg-white border border-blue-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 transition" title="Modifier"
                      onClick={() => { setEditPayment(p); setModalOpen(true); }}
                    >
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 4.487a2.1 2.1 0 112.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303z" /></svg>
                    </button>
                    <button className="rounded-full p-2 bg-white border border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-400 transition" title="Supprimer"
                      onClick={() => setDeleteId(p.id)}
                    >
                      <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Modale ajout/modif */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditPayment(null); }} title={editPayment ? "Modifier le paiement" : "Ajouter un paiement"}>
        <PaymentForm
          students={students}
          initial={editPayment || undefined}
          onSubmit={editPayment ? handleEdit : handleAdd}
          onCancel={() => { setModalOpen(false); setEditPayment(null); }}
        />
      </Modal>
      {/* Modale suppression */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Supprimer le paiement ?">
        <div className="space-y-4">
          <p>Confirmez-vous la suppression de ce paiement ?</p>
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

export default AdminFinances; 