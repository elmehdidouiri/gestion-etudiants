import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminAbsences from "./pages/AdminAbsences";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegisterAdmin from "./pages/RegisterAdmin";
import AdminGrades from "./pages/AdminGrades";
import AdminSchedule from "./pages/AdminSchedule";
import AdminFinances from "./pages/AdminFinances";

// Composant de route protégée
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/login" element={<Login />} />
          {/* Redirection racine selon authentification */}
          <Route path="/" element={<RootRedirect />} />
          {/* Interface Administration protégée */}
          <Route path="/admin/*" element={<PrivateRoute><Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="absences" element={<AdminAbsences />} />
            <Route path="grades" element={<AdminGrades />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="finances" element={<AdminFinances />} />
            {/* Ajouter d'autres routes admin ici */}
            <Route path="*" element={<div className="p-8 text-center text-xl">Page non trouvée</div>} />
          </Routes></PrivateRoute>} />
          {/* Interface Parent (non protégée ici, à adapter si besoin) */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          {/* 404 */}
          <Route path="*" element={<div className="p-8 text-center text-xl">Page non trouvée</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Redirection racine selon authentification
const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace />;
};

export default App;
