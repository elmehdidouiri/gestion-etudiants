import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlusIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

const RegisterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { autoLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !username || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Email invalide.");
      return;
    }
    if (!/^((\+212|0)[5-7][0-9]{8})$/.test(phone)) {
      setError("Téléphone invalide (ex: 0612345678 ou +212612345678)");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (localStorage.getItem("admin")) {
      setError("Un administrateur existe déjà.");
      return;
    }
    localStorage.setItem("admin", JSON.stringify({ fullName, phone, email, username, password }));
    autoLogin();
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background animé */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-600 opacity-80" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a5b4fc" />
            </linearGradient>
          </defs>
          <circle cx="1200" cy="100" r="200" fill="url(#grad1)" opacity="0.2">
            <animate attributeName="cx" values="1200;200;1200" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="300" r="180" fill="url(#grad1)" opacity="0.15">
            <animate attributeName="cy" values="300;100;300" dur="12s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6 border border-violet-100 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <UserPlusIcon className="h-10 w-10 text-violet-600 animate-bounce-slow" />
          <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">Inscription Admin</h1>
        </div>
        {error && <div className="text-red-600 text-sm text-center animate-pulse">{error}</div>}
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
          className="border border-violet-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-violet-400 focus:outline-none transition"
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
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white py-2 rounded-lg font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-violet-400">
          <UserPlusIcon className="h-5 w-5" /> S'inscrire
        </button>
        <button type="button" className="w-full flex items-center justify-center gap-2 bg-white border border-violet-200 text-violet-700 py-2 rounded-lg font-semibold shadow hover:bg-violet-50 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-violet-400" onClick={() => navigate("/login")}> <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Se connecter</button>
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