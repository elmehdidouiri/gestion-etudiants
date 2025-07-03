import React from "react";
import { UsersIcon, AcademicCapIcon, CalendarDaysIcon, CurrencyDollarIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: AcademicCapIcon },
  { href: "/admin/students", label: "Élèves", icon: UsersIcon },
  { href: "/admin/absences", label: "Absences", icon: CalendarDaysIcon },
  { href: "/admin/grades", label: "Notes", icon: AcademicCapIcon },
  { href: "/admin/schedule", label: "Emplois du temps", icon: CalendarDaysIcon },
  { href: "/admin/finances", label: "Finances", icon: CurrencyDollarIcon },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen items-stretch relative">
      {/* Fond animé */}
      <div className="fixed inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-400 via-green-200 to-white opacity-80 pointer-events-none" />
      {/* Sidebar verticale responsive */}
      <aside
        className={
          (sidebarOpen ? "translate-x-0" : "-translate-x-full") +
          " flex flex-col justify-between min-h-screen w-64 bg-white/90 backdrop-blur-xl shadow-2xl z-40 border-r border-blue-100 transition-transform duration-300 fixed md:static top-0 left-0 md:translate-x-0"
        }
        aria-label="Navigation principale"
      >
        <div>
          {/* Logo */}
          <div className="py-5 px-6 font-extrabold text-2xl text-blue-700 border-b border-blue-100 flex items-center gap-2 select-none">
            <AcademicCapIcon className="h-8 w-8 text-green-500 drop-shadow" />
            <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">École Privée</span>
          </div>
          {/* Liens */}
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={
                  `flex items-center gap-2 font-semibold px-3 py-2 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-400 ` +
                  (location.pathname.startsWith(link.href)
                    ? "bg-gradient-to-r from-blue-500 to-green-400 text-white shadow border-l-4 border-green-400 scale-[1.03]"
                    : "text-blue-700 hover:bg-blue-50/80 hover:scale-105")
                }
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className="h-5 w-5 text-green-500" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col z-10 min-h-screen">
        <header className="w-full bg-white/90 backdrop-blur-md shadow-md px-4 py-3 flex items-center justify-between border-b border-blue-100 z-30 relative">
          <button
            className={
              `md:hidden p-2 rounded-full transition focus:ring-2 focus:ring-blue-400 ${sidebarOpen ? 'bg-blue-100 rotate-90' : 'hover:bg-blue-100'}`
            }
            aria-label={sidebarOpen ? "Fermer la navigation" : "Ouvrir la navigation"}
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-7 w-7 text-blue-700 transition-transform duration-300" />
            ) : (
              <Bars3Icon className="h-7 w-7 text-blue-700 transition-transform duration-300" />
            )}
          </button>
          <span className="font-extrabold text-xl md:text-2xl text-blue-700 tracking-tight drop-shadow ml-2">Administration</span>
          {/* Actions à droite : notifications + avatar admin */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 rounded-full hover:bg-blue-100 transition focus:ring-2 focus:ring-blue-400" title="Notifications">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">3</span>
            </button>
            <div className="relative">
              <button
                className="flex items-center gap-2 p-2 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:scale-105 transition focus:ring-2 focus:ring-green-400"
                onClick={() => setDropdownOpen(v => !v)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                tabIndex={0}
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/30 text-blue-700 font-extrabold text-lg">A</span>
                <span className="hidden md:inline font-semibold">Admin</span>
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-blue-100 py-2 z-20 animate-fade-in-down"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 text-green-500" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 pt-8">{children}</main>
      </div>
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout; 