import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import ApiService from '../../service/ApiService';

const RoomResult = ({ roomSearchResults }) => {
  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();

  if (!roomSearchResults || roomSearchResults.length === 0) return null;

  return (
    <section className="mt-5">
      <Row xs={1} md={2} lg={3} className="g-4">
        {roomSearchResults.map((room) => (
          <Col key={room.id}>
            <Card className="h-100 room-card border-3 rounded-4 overflow-hidden">
              <div className="image-container">
                <Card.Img
                  variant="top"
                  src={room.roomPhotoUrl}
                  alt={room.roomType}
                  className="room-img"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between p-4">
                <div>
                  <Card.Title className="fs-4 fw-bold room-type">
                    {room.roomType}
                  </Card.Title>
                  <Card.Text className="text-muted mb-2">
                    <strong className="text-dark">Precio:</strong> ${room.roomPrice} / noche
                  </Card.Text>
                  <Card.Text className="text-secondary">
                    <strong className="text-dark">Descripción:</strong> {room.roomDescription}
                  </Card.Text>
                </div>
                <div className="mt-4">
                  {isAdmin ? (
                    <Button
                      variant="outline-warning"
                      className="w-100 rounded-pill"
                      onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                    >
                      Editar Habitación
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="w-100 rounded-pill"
                      onClick={() => navigate(`/room-details-book/${room.id}`)}
                    >
                      Ver / Reservar
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Estilos personalizados */}
      <style>{`
        .room-card {
          border-color: #0D6EFD !important; /* azul bootstrap */
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
        .room-type {
          color: #FDC500; /* amarillo ojo */
        }
      `}</style>
    </section>
  );
};

export default RoomResult;
