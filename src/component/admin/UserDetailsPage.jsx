import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import moment from "moment";
import 'moment/locale/es';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alertReservations, setAlertReservations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const userData = await ApiService.getUserById(userId);
      setUser(userData);

      const now = moment();
      const reservationsToAlert = (userData.bookings || []).filter((booking) => {
        const checkIn = moment(booking.checkInDate);
        const diffInHours = checkIn.diff(now, "hours");
        return diffInHours <= 48 && !booking.confirmed; // ✅ Usar campo booleano
      });

      setAlertReservations(reservationsToAlert);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      setMessage("No se pudieron cargar los detalles del usuario.");
    }
  };

  // Frontend: UserDetailsPage.jsx


  const handleSendReminderEmail = (bookingId) => {
    navigate(`/admin/send-reminder/${userId}/${bookingId}`);
  };

  if (!user) return <p>Cargando datos del usuario...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Detalles del Usuario</h2>
      {message && <div className="alert alert-warning">{message}</div>}

      <div className="mb-4">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Teléfono:</strong> {user.phoneNumber}</p>
      </div>

      <h4>Reservas</h4>
      {user.bookings && user.bookings.length > 0 ? (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Fecha Check-in</th>
              <th>Fecha Check-out</th>
              <th>Adultos</th>
              <th>Niños</th>
              <th>Código de Confirmación</th>
              <th>Estado</th>
          
            </tr>
          </thead>
          <tbody>
            {user.bookings.map((booking) => {
              const isAlert = alertReservations.some(r => r.id === booking.id);
              return (
                <tr key={booking.id}>
                  <td>{moment(booking.checkInDate).format("LL")}</td>
                  <td>{moment(booking.checkOutDate).format("LL")}</td>
                  <td>{booking.numOfAdults}</td>
                  <td>{booking.numOfChildren}</td>
                  <td>{booking.bookingConfirmationCode}</td>
          
                  <td>
                    {isAlert && (
                      <>
                        <span className="text-danger d-block mb-2">
                          Menos de 48h para Check-in.
                        </span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleSendReminderEmail(booking.id)}
                        >
                          Enviar recordatorio
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Este usuario no tiene reservas.</p>
      )}
    </div>
  );
};

export default UserDetailsPage;
