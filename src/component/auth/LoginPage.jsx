import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.loginUser({ email, password });
            if (response.statusCode === 200) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                navigate(from, { replace: true });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al iniciar sesión');
            setTimeout(() => setError(''), 5000);
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
                    <h2 className="text-center mb-4 fw-bold text-primary">Iniciar sesión</h2>

                    {error && (
                        <div className="alert alert-danger text-center py-2" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="emailInput">Correo electrónico</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="passwordInput">Contraseña</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                            Entrar
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <small className="text-muted">
                            ¿No tienes una cuenta?{' '}
                            <a href="/register" className="text-decoration-none text-primary fw-semibold">
                                Regístrate aquí
                            </a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
