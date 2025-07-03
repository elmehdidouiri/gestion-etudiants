import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LockClosedIcon, UserPlusIcon } from "@heroicons/react/24/solid";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) {
      navigate("/admin/dashboard");
    } else {
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-sky-100">
      {/* Overlay animé subtil + SVG éducatif */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-200 via-sky-200 to-violet-200 opacity-60 pointer-events-none" />
      {/* SVG éducatif animé */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.13">
            {/* Livre ouvert */}
            <g>
              <rect x="200" y="60" width="60" height="40" rx="8" fill="#2563eb">{/* bleu roi */}
                <animate attributeName="y" values="60;100;60" dur="8s" repeatCount="indefinite" />
              </rect>
              <rect x="260" y="60" width="60" height="40" rx="8" fill="#fbbf24">{/* jaune-or */}
                <animate attributeName="y" values="60;100;60" dur="8s" repeatCount="indefinite" />
              </rect>
              <rect x="230" y="80" width="60" height="8" rx="4" fill="#22c55e">{/* vert */}
                <animate attributeName="y" values="80;120;80" dur="8s" repeatCount="indefinite" />
              </rect>
            </g>
            {/* Chapeau de diplômé */}
            <g>
              <polygon points="900,200 950,180 1000,200 950,220" fill="#a21caf">{/* violet */}
                <animate attributeName="points" values="900,200 950,180 1000,200 950,220;900,220 950,200 1000,220 950,240;900,200 950,180 1000,200 950,220" dur="10s" repeatCount="indefinite" />
              </polygon>
              <rect x="940" y="200" width="20" height="30" rx="6" fill="#f59e42">{/* orange */}
                <animate attributeName="y" values="200;240;200" dur="10s" repeatCount="indefinite" />
              </rect>
            </g>
            {/* Crayon */}
            <g>
              <rect x="600" y="100" width="80" height="16" rx="8" fill="#fbbf24">{/* jaune-or */}
                <animate attributeName="y" values="100;140;100" dur="12s" repeatCount="indefinite" />
              </rect>
              <polygon points="680,100 690,108 680,116" fill="#2563eb">{/* bleu roi */}
                <animate attributeName="points" values="680,100 690,108 680,116;680,120 690,128 680,136;680,100 690,108 680,116" dur="12s" repeatCount="indefinite" />
              </polygon>
            </g>
            {/* Globe */}
            <g>
              <circle cx="1200" cy="100" r="30" fill="#22c55e">{/* vert */}
                <animate attributeName="cy" values="100;140;100" dur="11s" repeatCount="indefinite" />
              </circle>
              <rect x="1170" y="130" width="60" height="8" rx="4" fill="#2563eb">{/* bleu roi */}
                <animate attributeName="y" values="130;170;130" dur="11s" repeatCount="indefinite" />
              </rect>
            </g>
          </g>
        </svg>
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl w-full max-w-lg space-y-6 border border-blue-100 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <LockClosedIcon className="h-10 w-10 text-blue-600 animate-bounce-slow" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Connexion</h1>
        </div>
        {error && <div className="text-blue-700 text-sm text-center animate-pulse font-semibold">{error}</div>}
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-blue-700 placeholder-blue-300"
        />
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-400">
          <LockClosedIcon className="h-5 w-5" /> Se connecter
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 py-2 rounded-full text-lg font-semibold shadow border border-blue-400 hover:bg-blue-50 transition-all duration-200 focus:ring-2 focus:ring-blue-400 mt-2"
          onClick={() => navigate("/register-admin")}
        >
          <UserPlusIcon className="h-5 w-5 text-blue-700" /> S'inscrire
        </button>
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

export default Login; 