import React, { useState } from "react";
import axios from "axios";
import "../PlanifierSalon.css"; // Assurez-vous que le chemin est correct

const PlanifierSalonModal = ({ toggleModal }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState("");
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construire la date de début et calculer une date de fin (ici, durée fixe de 1 heure)
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 3600000);

    // Construire l'objet événement pour Google Calendar
    const event = {
      summary: "Salon Planifié",
      description: tasks,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Europe/Paris"  // Ajustez selon votre fuseau horaire
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Europe/Paris"
      },
      attendees: emails.split(",").map(email => ({ email: email.trim() }))
    };

    try {
      // Remplacez l'URL par celle de votre backend qui gère l'intégration avec Google Calendar
      const response = await axios.post("http://localhost:5001/api/calendar/add-event", event);
      setMessage("Salon planifié avec succès !");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Erreur lors de la planification du salon.");
      }
    }
  };

  return (
    <div className="planifier-salon-box">
      <span className="close-btn" onClick={toggleModal}>&times;</span>
      <h1>Planifier un Salon</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date :</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Heure :</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Tâches / Notes :</label>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Listez les tâches à réaliser..."
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Emails des participants :</label>
          <input 
            type="text" 
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="email1@example.com, email2@example.com"
            required 
          />
        </div>
        <button type="submit">Planifier</button>
      </form>
      {message && <p className="response-message">{message}</p>}
    </div>
  );
};

export default PlanifierSalonModal;
