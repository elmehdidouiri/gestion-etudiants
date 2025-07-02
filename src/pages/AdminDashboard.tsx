import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getStudents } from "../services/studentService";
import { getAbsences } from "../services/absenceService";
import { Student } from "../types/Student";
import { Absence } from "../types/Absence";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from "chart.js";
import { UsersIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ClockIcon, AcademicCapIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudents(), getAbsences()]).then(([studs, abs]) => {
      setStudents(studs);
      setAbsences(abs);
      setLoading(false);
    });
  }, []);

  // Statistiques
  const totalStudents = students.length;
  const totalAbsences = absences.filter(a => a.type === "absence").length;
  const totalRetards = absences.filter(a => a.type === "retard").length;
  const totalPayments = students.filter(s => s.payment).length;
  const totalUnpaid = students.filter(s => !s.payment).length;

  // Statistiques avancées
  const totalRetardPaiement = students.filter(s => !s.payment).length;
  const tauxAbsent = totalStudents > 0 ? ((totalAbsences / totalStudents) * 100).toFixed(1) : 0;
  const moyenneGenerale = students.length > 0 ? (students.reduce((acc, s) => acc + (s.average || 0), 0) / students.length).toFixed(2) : 0;

  // Absences par classe
  const classes = Array.from(new Set(students.map(s => s.class)));
  const absencesByClass = classes.map(cls =>
    absences.filter(a => a.type === "absence" && students.find(s => s.id === a.studentId)?.class === cls).length
  );

  // Paiements à jour vs en retard (pie chart)
  const paiementPieData = {
    labels: ["À jour", "En retard"],
    datasets: [
      {
        data: [totalPayments, totalUnpaid],
        backgroundColor: ["#38bdf8", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  // Retards par classe (bar chart)
  const retardsByClass = classes.map(cls =>
    absences.filter(a => a.type === "retard" && students.find(s => s.id === a.studentId)?.class === cls).length
  );
  const retardsBarData = {
    labels: classes,
    datasets: [
      {
        label: "Retards par classe",
        data: retardsByClass,
        backgroundColor: "#6366f1",
      },
    ],
  };

  const chartData = {
    labels: classes,
    datasets: [
      {
        label: "Absences par classe",
        data: absencesByClass,
        backgroundColor: "#38bdf8", // bleu clair
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="w-full min-h-screen flex flex-col items-center justify-start p-2 md:p-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight mb-8 flex items-center gap-3">
          <AcademicCapIcon className="h-10 w-10 text-green-500 animate-bounce-slow" /> Tableau de bord
        </h1>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl mb-8">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
                <UsersIcon className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-3xl font-bold text-blue-600">{totalStudents}</div>
                <div className="text-gray-600">Élèves inscrits</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
                <ExclamationTriangleIcon className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-3xl font-bold text-green-600">{totalAbsences}</div>
                <div className="text-gray-600">Absences</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
                <ClockIcon className="h-8 w-8 text-blue-400 mb-2" />
                <div className="text-3xl font-bold text-blue-500">{totalRetards}</div>
                <div className="text-gray-600">Retards</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-3xl font-bold text-green-600">{totalPayments}</div>
                <div className="text-gray-600">Paiements à jour</div>
                <div className="text-xs text-gray-400">{totalUnpaid} en retard</div>
              </div>
            </div>
            {/* Statistiques avancées */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mb-8">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{tauxAbsent}%</div>
                <div className="text-gray-600">Taux d'absentéisme</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
                <div className="text-2xl font-bold text-red-500">{totalRetardPaiement}</div>
                <div className="text-gray-600">Élèves en retard de paiement</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100">
                <div className="text-2xl font-bold text-green-600">{moyenneGenerale}</div>
                <div className="text-gray-600">Moyenne générale des élèves</div>
              </div>
            </div>
            {/* Liens rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl mb-4 mx-auto">
              <a href="/admin/students" className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400">
                <UsersIcon className="h-5 w-5" /> Gestion des élèves
              </a>
              <a href="/admin/absences" className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400">
                <ExclamationTriangleIcon className="h-5 w-5" /> Suivi des absences
              </a>
              <a href="/admin/grades" className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400">
                <AcademicCapIcon className="h-5 w-5" /> Gestion des notes
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-md mb-8 mx-auto">
              <a href="/admin/schedule" className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400">
                <CalendarDaysIcon className="h-5 w-5" /> Emplois du temps
              </a>
              <a href="/admin/finances" className="w-full flex items-center gap-2 justify-center bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400">
                <CurrencyDollarIcon className="h-5 w-5" /> Finances
              </a>
            </div>
            {/* Analyses visuelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-8">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col items-center">
                <h2 className="font-semibold mb-4 text-blue-700 flex items-center gap-2"><CurrencyDollarIcon className="h-6 w-6 text-blue-400" /> Paiements à jour vs en retard</h2>
                <Pie data={paiementPieData} options={{ plugins: { legend: { position: "bottom" } } }} />
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col items-center">
                <h2 className="font-semibold mb-4 text-blue-700 flex items-center gap-2"><ClockIcon className="h-6 w-6 text-blue-400" /> Retards par classe</h2>
                <Bar data={retardsBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
            </div>
            {/* Graphique */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100 w-full max-w-4xl animate-fade-in">
              <h2 className="font-semibold mb-4 text-blue-700 flex items-center gap-2"><ExclamationTriangleIcon className="h-6 w-6 text-green-400" /> Absences par classe</h2>
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          </>
        )}
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 