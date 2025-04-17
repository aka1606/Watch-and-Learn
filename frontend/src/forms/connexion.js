import React, { useState } from "react";
import axios from "axios";
import "../connexion.css"; // <-- IMPORT CSS
import logo from "../images/LOGO.png";
import { useNavigate } from 'react-router-dom';

const Connexion = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
  
    const navigate = useNavigate(); // Pour la redirection après connexion
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post("http://localhost:5001/api/auth/login", {
          email,
          password,
        });
  
        setMessage(response.data.message);
        console.log("Utilisateur connecté :", response.data.utilisateur);
  
        // Rediriger vers la page CreateSalon après connexion réussie
        navigate("/createSalon");
  
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Erreur serveur.");
        }
      }
    };
  
    return (
      <div className="form-box">
        <div className="logo">
          <img src={logo} alt="Logo Watch & Learn" />
        </div>
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Connexion</button>
        </form>
  
        {message && (
          <p className="message">{message}</p>
        )}
      </div>
    );
  };
  
  export default Connexion;