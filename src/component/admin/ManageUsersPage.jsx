import React, { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await ApiService.getAllUsers();
            console.log("Usuarios:", response);
            const onlyUsers = response.filter(user => user.role === "USER");
            setUsers(onlyUsers);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            setMessage("No se pudieron obtener los usuarios.");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

        try {
            const response = await ApiService.deleteUser(userId);
            if (response.statusCode === 200) {
                setMessage("Usuario eliminado correctamente.");
                fetchUsers();
            } else {
                setMessage("Error: " + response.message);
            }
        } catch (error) {
            console.error("Error deleting user:", error.message);
            setMessage("Error al eliminar el usuario.");
        }
    };

    const handleViewDetails = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Usuarios Registrados</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Correo (Gmail)</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => navigate(`/admin/user/${user.id}`)}
                                        >
                                            Ver detalles
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Eliminar Usuario
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-secondary mt-3" onClick={() => navigate('/admin')}>
                Volver al Panel
            </button>
        </div>
    );
};

export default ManageUsersPage;
