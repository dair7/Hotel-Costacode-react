import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";

const SendReminderPage = () => {
  const { userId, bookingId } = useParams();
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [subject, setSubject] = useState("Recordatorio de su reserva");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await ApiService.getUserById(userId);
        setUser(userData);

        const reserva = userData.bookings.find(b => b.id === parseInt(bookingId));
        setBooking(reserva);

        // Prellenar el cuerpo del correo
        if (reserva) {
          setBody(`Hola ${userData.name},

Este es un recordatorio de su reserva en nuestro hotel.

📅 Check-in: ${reserva.checkInDate}
📅 Check-out: ${reserva.checkOutDate}
👨‍👩‍👧‍👦 Adultos: ${reserva.numOfAdults}, Niños: ${reserva.numOfChildren}
🔑 Código de Confirmación: ${reserva.bookingConfirmationCode}

Por favor, confirme su asistencia respondiendo este correo.

Gracias,
Hotel Admin`);
        }
      } catch (error) {
        setStatus("Error al cargar los datos.");
      }
    };

    loadData();
  }, [userId, bookingId]);

  const handleSend = async () => {
    try {
      const result = await ApiService.sendEmail(user.email, subject, body);
      setStatus("Correo enviado correctamente.");
    } catch (error) {
      setStatus("Error al enviar el correo.");
    }
  };

  if (!user || !booking) return <p>Cargando...</p>;

  return (
    <div className="container py-4">
      <h2>Enviar recordatorio</h2>
      {status && <p>{status}</p>}
      <div className="mb-3">
        <label>Para:</label>
        <input type="text" value={user.email} className="form-control" disabled />
      </div>
      <div className="mb-3">
        <label>Asunto:</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} className="form-control" />
      </div>
      <div className="mb-3">
        <label>Mensaje:</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} className="form-control" rows={10}></textarea>
      </div>
      <button className="btn btn-primary" onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default SendReminderPage;
