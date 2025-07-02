import React from "react";
import ParentLayout from "../layouts/ParentLayout";

const ParentDashboard: React.FC = () => {
  return (
    <ParentLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard Parent</h1>
      <p>Bienvenue sur l'espace parent.</p>
    </ParentLayout>
  );
};

export default ParentDashboard; 