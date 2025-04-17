import React, { useState } from "react";
import axios from "axios";
import "../Inscription.css";
import logo from "../images/LOGO.png";

const Inscription = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        nom,
        email,
        password
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Erreur serveur.");
    }
  };

  return (
    // On retire la div .inscription-container
    <div className="inscription-box">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="E-Mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Nom d'utilisateur" 
          value={nom} 
          onChange={(e) => setNom(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Confirmer mot de passe" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        <button type="submit">Inscription</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Inscription;
