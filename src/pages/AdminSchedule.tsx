import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { CalendarDaysIcon, PlusCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getSchedule } from "../services/scheduleService";
import { ScheduleEntry } from "../types/ScheduleEntry";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const defaultSlots = [
  { start: "08:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
];

const AdminSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchedule().then((data) => {
      setSchedule(data);
      setLoading(false);
    });
  }, []);

  // Liste des classes pour la vue principale
  const classes = Array.from(new Set(schedule.map(e => e.class)));

  // Créneaux horaires dynamiques pour la classe sélectionnée
  const slots = React.useMemo(() => {
    if (!selectedClass) return defaultSlots;
    const entries = schedule.filter(e => e.class === selectedClass);
    const allSlots = entries.map(e => ({ start: e.startTime, end: e.endTime }));
    const uniqueSlots = [
      ...defaultSlots,
      ...allSlots.filter(s => !defaultSlots.some(d => d.start === s.start && d.end === s.end))
    ];
    // Tri par heure de début
    return uniqueSlots.sort((a, b) => a.start.localeCompare(b.start));
  }, [selectedClass, schedule]);

  // Emploi du temps de la classe sélectionnée
  const classSchedule = schedule.filter(e => e.class === selectedClass);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">Emploi du temps</h1>
        </div>
      </div>
      {/* Vue principale : liste des classes */}
      {!selectedClass ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {classes.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-500 py-12">Aucune classe trouvée.</div>
          )}
          {loading && (
            <div className="col-span-full text-center py-12">Chargement...</div>
          )}
          {classes.map(c => (
            <div key={c} className="rounded-2xl shadow-xl border border-blue-100 bg-white/90 backdrop-blur-md p-6 flex flex-col items-center gap-4 hover:scale-105 hover:shadow-2xl transition cursor-pointer group" onClick={() => setSelectedClass(c)}>
              <div className="text-2xl font-bold text-blue-700 group-hover:text-green-600 transition">Classe {c}</div>
              <div className="flex items-center gap-2 text-blue-500">
                <CalendarDaysIcon className="h-6 w-6" /> Voir l'emploi du temps
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button onClick={() => setSelectedClass(null)} className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 font-semibold shadow hover:scale-105 transition">
            <ArrowLeftIcon className="h-5 w-5" /> Retour aux classes
          </button>
          <div className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-2 md:p-6">
            <div className="text-xl font-bold text-blue-700 mb-4">Classe {selectedClass}</div>
            <table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-blue-100 text-blue-800 border-b border-blue-200">
                  <th className="px-3 md:px-5 py-3 font-bold text-left">Heure</th>
                  {days.map(day => (
                    <th key={day} className="px-3 md:px-5 py-3 font-bold text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map(slot => (
                  <tr key={slot.start + slot.end}>
                    <td className="px-3 md:px-5 py-3 font-semibold text-blue-700 bg-blue-50/60 whitespace-nowrap">{slot.start} - {slot.end}</td>
                    {days.map(day => {
                      const entry = classSchedule.find(e => e.day === day && e.startTime === slot.start && e.endTime === slot.end);
                      return (
                        <td key={day} className="px-3 md:px-5 py-3 align-top min-w-[120px]">
                          {entry ? (
                            <div className="rounded-xl bg-gradient-to-br from-blue-100 to-green-50 p-2 shadow flex flex-col gap-1">
                              <div className="font-bold text-blue-700">{entry.subject}</div>
                              <div className="text-xs text-green-700">{entry.teacher}</div>
                              <div className="text-xs text-blue-500">Salle {entry.room}</div>
                              {entry.description && <div className="text-xs text-gray-500 italic mt-1">{entry.description}</div>}
                              <div className="flex gap-1 mt-2">
                                <button className="rounded-full p-1 bg-white border border-blue-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 transition" title="Modifier">
                                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 4.487a2.1 2.1 0 112.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303z" /></svg>
                                </button>
                                <button className="rounded-full p-1 bg-white border border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-400 transition" title="Supprimer">
                                  <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button className="w-full h-16 rounded-xl border-2 border-dashed border-blue-200 text-blue-300 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition" title="Ajouter un cours">
                              <PlusCircleIcon className="h-6 w-6" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
      `}</style>
    </AdminLayout>
  );
};

export default AdminSchedule; 