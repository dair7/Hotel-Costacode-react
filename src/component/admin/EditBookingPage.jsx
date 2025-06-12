import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditBookingPage = () => {
  const navigate = useNavigate();
  const { bookingCode } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccessMessage] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await ApiService.getBookingByConfirmationCode(bookingCode);
        setBookingDetails(response.booking);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBookingDetails();
  }, [bookingCode]);

  const acheiveBooking = async (bookingId) => {
    if (!window.confirm('¿Estás seguro que quieres archivar esta reserva?')) return;

    try {
      const response = await ApiService.cancelBooking(bookingId);
      if (response.statusCode === 200) {
        setSuccessMessage('La reserva fue archivada exitosamente');
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/admin/manage-bookings');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Función para copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Código copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(() => {
      setCopySuccess('Error al copiar');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold text-dark">Detalle de la Reserva</h2>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success text-center" role="alert">
          {success}
        </div>
      )}
      {copySuccess && (
        <div className="alert alert-info text-center" role="alert">
          {copySuccess}
        </div>
      )}

      {bookingDetails ? (
        <div className="card shadow rounded-4 p-4 mx-auto" style={{ maxWidth: '720px' }}>
          <section className="mb-4">
            <h5 className="fw-semibold mb-3 border-bottom pb-2">Información de la Reserva</h5>
            <p>
              <strong>Código de Confirmación:</strong>{' '}
              <span
                className="text-primary"
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Haz click para copiar"
                onClick={() => copyToClipboard(bookingDetails.bookingConfirmationCode)}
              >
                {bookingDetails.bookingConfirmationCode}
              </span>
            </p>
            <p><strong>Fecha de Entrada:</strong> {bookingDetails.checkInDate}</p>
            <p><strong>Fecha de Salida:</strong> {bookingDetails.checkOutDate}</p>
            <p><strong>Adultos:</strong> {bookingDetails.numOfAdults}</p>
            <p><strong>Niños:</strong> {bookingDetails.numOfChildren}</p>
            <p><strong>Email del Huésped:</strong> {bookingDetails.user.email}</p>
          </section>

          <section className="mb-4">
            <h5 className="fw-semibold mb-3 border-bottom pb-2">Información del Reservante</h5>
            <p><strong>Nombre:</strong> {bookingDetails.user.name}</p>
            <p><strong>Email:</strong> {bookingDetails.user.email}</p>
            <p><strong>Teléfono:</strong> {bookingDetails.user.phoneNumber}</p>
          </section>

          <section className="mb-4">
            <h5 className="fw-semibold mb-3 border-bottom pb-2">Detalles de la Habitación</h5>
            <p><strong>Tipo:</strong> {bookingDetails.room.roomType}</p>
            <p><strong>Precio:</strong> ${bookingDetails.room.roomPrice}</p>
            <p><strong>Descripción:</strong> {bookingDetails.room.roomDescription}</p>
            <img
              src={bookingDetails.room.roomPhotoUrl}
              alt="Room"
              className="rounded my-3 shadow-sm"
              style={{
                maxHeight: '300px',
                maxWidth: '100%',
                objectFit: 'cover',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                imageRendering: 'auto'
              }}
            />

          </section>

          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger btn-lg"
              onClick={() => acheiveBooking(bookingDetails.id)}
            >
              Archivar Reserva
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted fst-italic mt-5">Cargando detalles de la reserva...</div>
      )}
    </div>
  );
};

export default EditBookingPage;
