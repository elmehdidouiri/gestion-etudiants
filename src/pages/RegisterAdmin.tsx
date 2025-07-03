import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { UserPlusIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

const RegisterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin", JSON.stringify({ fullName, phone, email, username, password }));
    setTimeout(() => {
      navigate("/login");
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-sky-100">
      {/* Overlay animé subtil + SVG éducatif (identique à Login) */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-200 via-sky-200 to-violet-200 opacity-60 pointer-events-none" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.13">
            {/* Livre ouvert */}
            <g>
              <rect x="200" y="60" width="60" height="40" rx="8" fill="#2563eb">
                <animate attributeName="y" values="60;100;60" dur="8s" repeatCount="indefinite" />
              </rect>
              <rect x="260" y="60" width="60" height="40" rx="8" fill="#fbbf24">
                <animate attributeName="y" values="60;100;60" dur="8s" repeatCount="indefinite" />
              </rect>
              <rect x="230" y="80" width="60" height="8" rx="4" fill="#22c55e">
                <animate attributeName="y" values="80;120;80" dur="8s" repeatCount="indefinite" />
              </rect>
            </g>
            {/* Chapeau de diplômé */}
            <g>
              <polygon points="900,200 950,180 1000,200 950,220" fill="#a21caf">
                <animate attributeName="points" values="900,200 950,180 1000,200 950,220;900,220 950,200 1000,220 950,240;900,200 950,180 1000,200 950,220" dur="10s" repeatCount="indefinite" />
              </polygon>
              <rect x="940" y="200" width="20" height="30" rx="6" fill="#f59e42">
                <animate attributeName="y" values="200;240;200" dur="10s" repeatCount="indefinite" />
              </rect>
            </g>
            {/* Crayon */}
            <g>
              <rect x="600" y="100" width="80" height="16" rx="8" fill="#fbbf24">
                <animate attributeName="y" values="100;140;100" dur="12s" repeatCount="indefinite" />
              </rect>
              <polygon points="680,100 690,108 680,116" fill="#2563eb">
                <animate attributeName="points" values="680,100 690,108 680,116;680,120 690,128 680,136;680,100 690,108 680,116" dur="12s" repeatCount="indefinite" />
              </polygon>
            </g>
            {/* Globe */}
            <g>
              <circle cx="1200" cy="100" r="30" fill="#22c55e">
                <animate attributeName="cy" values="100;140;100" dur="11s" repeatCount="indefinite" />
              </circle>
              <rect x="1170" y="130" width="60" height="8" rx="4" fill="#2563eb">
                <animate attributeName="y" values="130;170;130" dur="11s" repeatCount="indefinite" />
              </rect>
            </g>
          </g>
        </svg>
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl w-full max-w-lg space-y-6 border border-blue-100 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <UserPlusIcon className="h-10 w-10 text-blue-600 animate-bounce-slow" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Inscription Admin</h1>
        </div>
        <input
          type="text"
          placeholder="Nom complet"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
          required
        />
        <input
          type="tel"
          placeholder="Téléphone (ex: 0612345678 ou +212612345678)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
          required
        />
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
          required
        />
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400">
          <UserPlusIcon className="h-5 w-5" /> S'inscrire
        </button>
        <button type="button" className="w-full flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-2 rounded-lg font-semibold shadow hover:bg-blue-50 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-blue-400" onClick={() => navigate("/login")}> <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-700" /> Se connecter</button>
      </form>
      {/* Animation CSS pour le gradient */}
      <style>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
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
  );
};

export default RegisterAdmin; 