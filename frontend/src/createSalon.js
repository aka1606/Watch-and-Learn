import React, { useState } from "react";
import "./createSalon.css";
import InviteModal from "./forms/InviteModal";

const CreateSalon = () => {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const handleCreerSalon = () => {
    // → Ici tu peux appeler ton back pour générer un roomId
    // par exemple : const { data } = await axios.post('/api/salon');
    // const roomId = data.id;
    // Pour l'exemple, on génère un code pseudo‑aléatoire :
    const code = Math.random().toString(36).substr(2, 9);
    const link = `${window.location.origin}/salon/${code}`;
    setInviteLink(link);
    setShowInvite(true);
  };

  const toggleInvite = () => setShowInvite(!showInvite);

  return (
    <div className="salon-container">
      <h1>Gérer vos salons</h1>
      <div className="buttons-container">
        <button className="btn salon-btn" onClick={handleCreerSalon}>
          Créer un salon
        </button>
        <button className="btn salon-btn" onClick={() => setShowInvite(false)}>
          Planifier un salon
        </button>
      </div>

      {showInvite && (
        <InviteModal link={inviteLink} onClose={toggleInvite} />
      )}
    </div>
  );
};

export default CreateSalon;
