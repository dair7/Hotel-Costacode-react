import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FooterComponent = () => {
  const linkStyle = {
    color: '#374151',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  };

  const linkHoverStyle = {
    color: '#1e3a8a',
  };

  return (
    <footer
      className="pt-5 border-top position-relative"
      style={{
        backgroundColor: '#e5e7eb',
        color: '#4b5563',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        width: '100%',
        overflow: 'hidden',
        minHeight: '350px',
      }}
      aria-label="Pie de página"
    >
      <Container>
        <Row className="mb-5">
          <Col md={4} className="mb-4">
            <h5 className="fw-semibold mb-3" style={{ color: '#1e3a8a' }}>
              Información
            </h5>
            <p style={{ fontStyle: 'italic', maxWidth: '280px', lineHeight: '1.6', color: '#6b7280' }}>
              Tu experiencia de hospedaje moderna y confiable.
            </p>
            <address
              style={{
                fontStyle: 'normal',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                color: '#374151',
              }}
            >
              <strong>Dirección:</strong> Calle 123, Playa Digital, Webland
              <br />
              <strong>Teléfono:</strong>{' '}
              <a
                href="tel:+581234567890"
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
              >
                +58 123-456-7890
              </a>
              <br />
              <strong>Email:</strong>{' '}
              <a
                href="mailto:contacto@costacodehotel.com"
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
              >
                contacto@costacodehotel.com
              </a>
            </address>
          </Col>

          <Col md={4} className="mb-4">
            <h5 className="fw-semibold mb-3" style={{ color: '#1e3a8a' }}>
              Políticas del Hotel
            </h5>
            <ul className="list-unstyled" style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4b5563' }}>
              <li>Check-in: 2:00 PM</li>
              <li>Check-out: 11:00 AM</li>
              <li>Cancelaciones hasta 24h antes sin costo</li>
              <li>No se permite fumar</li>
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h5 className="fw-semibold mb-3" style={{ color: '#1e3a8a' }}>
              Enlaces Rápidos
            </h5>
            <ul className="list-unstyled" style={{ fontSize: '0.95rem', color: '#4b5563' }}>
              {[ 
                { href: '/', label: 'Inicio' },
                { href: '/rooms', label: 'Habitaciones' },
                { href: '/contact', label: 'Contacto' },
                { href: '/book', label: 'Reservar' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverStyle.color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <Row className="justify-content-between align-items-end">
          <Col md={6} className="text-start text-muted" style={{ fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} CostaCode Hotel. Todos los derechos reservados.
          </Col>
        </Row>

        {/* Imagen fija en esquina superior derecha */}
        <img
          src="/assets/images/al el logotipo de costacode que es un hotel (3).jpg"
          alt="Logo CostaCode"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '230px',
            height: '300px',
            objectFit: 'contain',
            borderRadius: '40px',
            zIndex: 0,
          }}
        />
      </Container>
    </footer>
  );
};

export default FooterComponent;
