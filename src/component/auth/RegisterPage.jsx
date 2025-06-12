import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;
        return name && email && password && phoneNumber;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setErrorMessage('Por favor, completa todos los campos.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        try {
            const response = await ApiService.registerUser(formData);

            if (response.statusCode === 200) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                setSuccessMessage('Usuario registrado con éxito.');
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error al registrar el usuario.');
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
            }}
        >
            <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                <div className="card border-0 shadow-lg rounded-4 p-4 bg-white">
                    <h2 className="text-center mb-4 fw-bold text-primary">Registro</h2>

                    {errorMessage && (
                        <div className="alert alert-danger text-center py-2" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success text-center py-2" role="alert">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="nameInput"
                                name="name"
                                placeholder="Nombre completo"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="nameInput">Nombre completo</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                name="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="emailInput">Correo electrónico</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="phoneInput"
                                name="phoneNumber"
                                placeholder="Número de teléfono"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="phoneInput">Número de teléfono</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="passwordInput">Contraseña</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                            Registrarse
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <small className="text-muted">
                            ¿Ya tienes una cuenta?{' '}
                            <a href="/login" className="text-decoration-none text-primary fw-semibold">
                                Iniciar sesión
                            </a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
