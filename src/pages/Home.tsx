import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const adminExists = Boolean(localStorage.getItem("admin"));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur la gestion scolaire</h1>
        <p className="text-gray-600 mb-4">Veuillez vous inscrire comme administrateur ou vous connecter.</p>
        <div className="flex flex-col gap-4">
          {!adminExists && (
            <button className="bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700" onClick={() => navigate("/register-admin")}>S'inscrire comme admin</button>
          )}
          <button className="bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300" onClick={() => navigate("/login")}>Se connecter</button>
        </div>
      </div>
    </div>
  );
};

export default Home; 