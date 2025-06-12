import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.getUserProfile();
        setUser(response.user);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await ApiService.updateMyProfile({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      });
      setSuccess("Perfil actualizado exitosamente.");
      setError(null);
    } catch (error) {
      setError("Error al actualizar perfil.");
      setSuccess(null);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('¿Estás seguro que quieres eliminar tu cuenta?')) return;
    try {
      await ApiService.deleteMe(); // ✅ Ahora llamamos al endpoint correcto
      ApiService.logout();         // Limpia token/cookies si aplica
      navigate('/signup');
    } catch (error) {
      setError("Error al eliminar cuenta.");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center px-3"
      style={{
        background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
  className="shadow-sm rounded-4 p-5 bg-white"
  style={{
    maxWidth: '420px',
    width: '100%',
    border: '2px solid #0d6efd',
  }}
>


        <h2 className="text-center mb-4" style={{ color: '#1e3a8a', fontWeight: '700' }}>
          Editar Perfil
        </h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">{success}</div>}

        {user && (
          <div style={{ fontSize: '1rem', color: '#374151' }}>
            <div className="mb-3">
              <label className="form-label"><strong>Nombre</strong></label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><strong>Email</strong></label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><strong>Teléfono</strong></label>
              <input
                type="text"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              className="btn btn-primary w-100 mb-3"
              style={{ fontWeight: '600' }}
            >
              Actualizar Perfil
            </button>

            <button
              onClick={handleDeleteProfile}
              className="btn btn-danger w-100"
              style={{ fontWeight: '600' }}
            >
              Eliminar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;
