import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import { Container, Row, Col, Card } from "react-bootstrap";

const HomePage = () => {
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

  const manejarResultadoBusqueda = (resultados) => {
    setResultadosBusqueda(resultados);
  };

  return (
    <div
      className="home"
      style={{
        background: 'linear-gradient(135deg, #e6f0ff, #f7faff)', // azul clarito muy suave
        minHeight: '100vh',
        paddingBottom: '2rem',
      }}
    >
      {/* HERO / BANNER */}
      <header className="position-relative text-white text-center">
        <img
          src="./assets/images/hotel.webp"
          alt="Hotel Phegon"
          className="w-100"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="position-absolute top-50 start-50 translate-middle text-light">
          <h1>
            Bienvenido a <span className="text-warning">Hotel Costacode</span>
          </h1>
          <h4>Entra en un refugio de comodidad y cuidado</h4>
        </div>
      </header>

      {/* BÚSQUEDA DE HABITACIONES */}
      <Container className="my-5">
        <RoomSearch handleSearchResult={manejarResultadoBusqueda} />
        <RoomResult roomSearchResults={resultadosBusqueda} />

        <div className="text-center mt-4">
          <a href="/rooms" className="btn btn-outline-primary">
            Ver Todas las Habitaciones
          </a>
        </div>
      </Container>

      {/* SERVICIOS */}
      <Container className="my-5">
        <h2 className="text-center mb-4">
          Servicios en <span className="text-warning">Hotel Costacode</span>
        </h2>
        <Row xs={1} sm={2} md={4} className="g-4">
          {[
            {
              img: "./assets/images/ac.png",
              title: "Aire Acondicionado",
              desc:
                "Mantente fresco y cómodo con aire acondicionado individual en cada habitación.",
            },
            {
              img: "./assets/images/mini-bar.png",
              title: "Mini Bar",
              desc:
                "Disfruta de bebidas y snacks del mini bar sin costo adicional.",
            },
            {
              img: "./assets/images/parking.png",
              title: "Estacionamiento",
              desc:
                "Estacionamiento disponible en el lugar. Consulta opciones de valet parking.",
            },
            {
              img: "./assets/images/wifi.png",
              title: "WiFi",
              desc:
                "Wi-Fi de alta velocidad gratuito en habitaciones y áreas comunes.",
            },
          ].map((servicio, idx) => (
            <Col key={idx}>
              <Card className="h-100 text-center shadow-sm">
                <Card.Img
                  variant="top"
                  src={servicio.img}
                  style={{ height: "120px", objectFit: "contain", marginTop: "1rem" }}
                />
                <Card.Body>
                  <Card.Title>{servicio.title}</Card.Title>
                  <Card.Text>{servicio.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
