import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import { PencilSquare, ClipboardCheck, PersonCircle } from 'react-bootstrap-icons';
import { Row, Col, Card, Button } from 'react-bootstrap';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getUserProfile();
        const userPlusBookings = await ApiService.getUserBookings(response.user.id);
        setUser(userPlusBookings.user);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => navigate('/edit-profile');

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch(() => {});
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('¿Cancelar reserva?')) {
      try {
        await ApiService.cancelBooking(bookingId);
        const updatedBookings = user.bookings.filter(b => b.id !== bookingId);
        setUser({ ...user, bookings: updatedBookings });
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const isBookingNearEnd = (checkOutDate) => {
    const now = new Date();
    const outDate = new Date(checkOutDate);
    const diffTime = outDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 2;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        paddingTop: '3rem',
        paddingBottom: '3rem',
      }}
    >
      <div className="container">
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {user && (
          <>
            {/* Tarjeta de perfil */}
            <div className="mx-auto mb-5" style={{ maxWidth: '400px' }}>
              <Card className="room-card border-3 rounded-4 p-4 bg-white text-center">
                <div
                  className="mx-auto mb-4"
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    backgroundColor: '#4b5563',
                    color: 'white',
                    fontSize: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonCircle />
                </div>
                <h3 className="fw-bold text-dark">{user.name}</h3>
                <p className="text-secondary mb-1">Correo electrónico</p>
                <p className="text-dark fs-5">{user.email}</p>
                <p className="text-secondary mb-1 mt-3">Teléfono</p>
                <p className="text-dark fs-5">{user.phoneNumber}</p>
                <Button
                  onClick={handleEditProfile}
                  className="rounded-pill mt-3 px-4 py-2 fw-semibold"
                  style={{ backgroundColor: '#0d6efd', border: 'none' }}
                >
                  <PencilSquare size={20} className="me-2" />
                  Editar perfil
                </Button>
              </Card>
            </div>

            {/* Historial de reservas */}
            <div>
              <h3 className="mb-4 text-center text-black fw-bold">
                Historial de Reservas
              </h3>
              {user.bookings.length > 0 ? (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {user.bookings.map((booking) => {
                    const nearEnd = isBookingNearEnd(booking.checkOutDate);
                    const isCopied = copiedCode === booking.bookingConfirmationCode;

                    return (
                      <Col key={booking.id}>
                        <Card className="h-100 room-card border-3 rounded-4 overflow-hidden">
                          <div className="image-container">
                            <Card.Img
                              variant="top"
                              src={booking.room.roomPhotoUrl}
                              alt="Foto habitación"
                              className="room-img"
                            />
                          </div>
                          <Card.Body className="d-flex flex-column justify-content-between p-4">
                            <div>
                              <Card.Title
                                className="fs-5 fw-bold text-primary"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleCopyCode(booking.bookingConfirmationCode)}
                                title="Haz clic para copiar el código"
                              >
                                Código:{' '}
                                <span className="text-decoration-underline">
                                  {booking.bookingConfirmationCode}
                                </span>
                                {isCopied && (
                                  <ClipboardCheck className="ms-2 text-success" title="¡Copiado!" />
                                )}
                              </Card.Title>
                              <Card.Text className="text-muted mb-1">
                                <strong className="text-dark">Entrada:</strong> {booking.checkInDate}
                              </Card.Text>
                              <Card.Text className="text-muted mb-1">
                                <strong className="text-dark">Salida:</strong> {booking.checkOutDate}
                              </Card.Text>
                              <Card.Text className="text-muted mb-1">
                                <strong className="text-dark">Huéspedes:</strong> {booking.totalNumOfGuest}
                              </Card.Text>
                              <Card.Text className="text-muted">
                                <strong className="text-dark">Tipo habitación:</strong> {booking.room.roomType}
                              </Card.Text>
                              {nearEnd && (
                                <div className="alert alert-warning py-2 mt-2 text-center" style={{ fontSize: '0.9rem' }}>
                                  Recuerda que tienes una reserva próxima a finalizar.
                                </div>
                              )}
                            </div>
                            <div className="mt-4">
                              <Button
                                variant="danger"
                                className="w-100 rounded-pill"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancelar reserva
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <p className="text-center text-muted fs-5">
                  No tienes reservas registradas.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Estilos personalizados */}
      <style>{`
        .room-card {
          border-color: #0D6EFD !important;
          box-shadow: 0 0.5rem 1.2rem rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease-in-out, box-shadow 0.2s;
        }
        .room-card:hover {
          transform: scale(1.015);
          box-shadow: 0 1rem 2rem rgba(0,0,0,0.12);
        }
        .room-img {
          height: 230px;
          object-fit: cover;
          transition: transform 0.3s ease-in-out;
        }
        .room-img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
