import React from "react";

const ParentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <div className="font-semibold text-lg">Espace Parent</div>
        {/* Place pour le profil, notifications, etc. */}
      </header>
      <main className="flex-1 p-4">{children}</main>
      {/* Navigation bas de page (mobile) */}
      <nav className="bg-white shadow-inner p-2 flex justify-around md:hidden">
        <a href="/parent/dashboard" className="flex flex-col items-center text-xs">Accueil</a>
        <a href="/parent/grades" className="flex flex-col items-center text-xs">Notes</a>
        <a href="/parent/absences" className="flex flex-col items-center text-xs">Absences</a>
        <a href="/parent/finances" className="flex flex-col items-center text-xs">Paiements</a>
        <a href="/parent/communication" className="flex flex-col items-center text-xs">Messages</a>
      </nav>
    </div>
  );
};

export default ParentLayout; 