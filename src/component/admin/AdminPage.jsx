import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPage = () => {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const response = await ApiService.getUserProfile();
        setAdminName(response.user.name);
      } catch (error) {
        console.error('Error fetching admin details:', error.message);
      }
    };

    fetchAdminName();
  }, []);

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg rounded-4 p-4" style={{ maxWidth: '400px', width: '100%', border: '2px solid #0d6efd' }}>

        <div className="text-center mb-4">
          <h2 className="fw-bold">Panel del Administrador</h2>
          <p className="text-secondary">Bienvenido, <span className="text-primary">{adminName || 'Cargando...'}</span></p>
        </div>
        <div className="d-grid gap-3">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/admin/manage-rooms')}
          >
            Gestión de Habitaciones
          </button>
          <button
            type="button"
            className="btn btn-danger btn-lg"
            onClick={() => navigate('/admin/manage-bookings')}
          >
            Gestión de Reservas
          </button>
          <button
            type="button"
            className="btn btn-warning btn-lg"
            onClick={() => navigate('/admin/manage-users')}
          >
            Ver Usuarios Registrados
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
