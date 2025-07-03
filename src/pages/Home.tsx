import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full bg-white shadow flex items-center justify-end px-8 py-4">
      <div className="space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
          onClick={() => navigate("/login")}
        >
          Connexion
        </button>
        <button
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition"
          onClick={() => navigate("/register-admin")}
        >
          Inscription
        </button>
      </div>
    </header>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const adminExists = Boolean(localStorage.getItem("admin"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow">Bienvenue sur EduManager</h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">Gérez facilement les élèves, absences, notes et paiements dans votre établissement scolaire. Plateforme moderne, intuitive et sécurisée.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!adminExists && (
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => navigate("/register-admin")}
            >
              S'inscrire comme admin
            </button>
          )}
          <button
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-yellow-500 transition"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home; 