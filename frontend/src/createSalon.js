import React, { useState } from 'react';
import './createSalon.css';
import PlanifierSalonModal from './forms/PlanifierSalonModal'; // Assurez-vous que le chemin est correct

const CreateSalon = () => {  // ou const createSalon = () => { ... }
  const [showPlanifierModal, setShowPlanifierModal] = useState(false);

  const handleCreerSalon = () => {
    console.log("Créer un salon");
  };

  const handlePlanifierSalon = () => {
    setShowPlanifierModal(true);
    console.log("Planifier un salon");
  };

  const togglePlanifierModal = () => {
    setShowPlanifierModal(!showPlanifierModal);
  };

  return (
    <div className="salon-container">
      <h1>Gérer vos salons</h1>
      <div className="buttons-container">
        <button className="btn salon-btn" onClick={handleCreerSalon}>
          Créer un salon
        </button>
        <button className="btn salon-btn" onClick={handlePlanifierSalon}>
          Planifier un salon
        </button>
      </div>

      {showPlanifierModal && (
        <div className="modal-overlay" onClick={togglePlanifierModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PlanifierSalonModal toggleModal={togglePlanifierModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSalon;
