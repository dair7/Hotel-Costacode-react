import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';
import ApiService from '../../service/ApiService';
import { BoxArrowRight, PersonCircle } from 'react-bootstrap-icons'; // Asegúrate de tener instalado react-bootstrap-icons

function Navbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isUser = ApiService.isUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    const isLogout = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (isLogout) {
      ApiService.logout();
      navigate('/home');
    }
  };

  return (
    <BSNavbar bg="light" expand="lg" className="shadow-sm py-2">
      <Container>
        <BSNavbar.Brand as={NavLink} to="/home" className="fw-bold text-primary">
          HOTEL COSTACODE
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar" />
        <BSNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/rooms">Habitaciones</Nav.Link>
            <Nav.Link as={NavLink} to="/find-booking">Buscar reserva</Nav.Link>
          </Nav>

          <Nav>
            {isUser && (
              <Nav.Link as={NavLink} to="/profile">
                <PersonCircle className="me-1" />
                Perfil
              </Nav.Link>
            )}

            {isAdmin && (
              <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>
            )}

            {!isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Registrarse</Nav.Link>
              </>
            )}

            {isAuthenticated && (
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <BoxArrowRight className="me-1" />
                Cerrar sesión
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
