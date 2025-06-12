import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EditRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [roomDetails, setRoomDetails] = useState({
    roomPhotoUrl: '',
    roomType: '',
    roomPrice: '',
    roomDescription: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails({
          roomPhotoUrl: response.room.roomPhotoUrl,
          roomType: response.room.roomType,
          roomPrice: response.room.roomPrice,
          roomDescription: response.room.roomDescription,
        });
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('roomType', roomDetails.roomType);
      formData.append('roomPrice', roomDetails.roomPrice);
      formData.append('roomDescription', roomDetails.roomDescription);
      if (file) {
        formData.append('photo', file);
      }

      const result = await ApiService.updateRoom(roomId, formData);
      if (result.statusCode === 200) {
        setSuccess('Habitación actualizada exitosamente.');
        setTimeout(() => {
          setSuccess('');
          navigate('/admin/manage-rooms');
        }, 2500);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      try {
        const result = await ApiService.deleteRoom(roomId);
        if (result.statusCode === 200) {
          setSuccess('Habitación eliminada exitosamente.');
          setTimeout(() => {
            setSuccess('');
            navigate('/admin/manage-rooms');
          }, 2500);
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  return (
    <div className="container py-5">
  <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
    <h3 className="mb-4 text-center">
      <i className="bi bi-pencil-square me-2"></i>Editar Habitación
    </h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label className="form-label fw-bold">Foto de la habitación</label>
          <div
            className="border rounded p-3 text-center mb-2"
            style={{ borderStyle: 'dashed', cursor: 'pointer' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Vista previa"
                className="img-fluid rounded"
                style={{ maxHeight: '250px', objectFit: 'cover' }}
              />
            ) : roomDetails.roomPhotoUrl ? (
              <img
                src={roomDetails.roomPhotoUrl}
                alt="Habitación"
                className="img-fluid rounded"
                style={{ maxHeight: '250px', objectFit: 'cover' }}
              />
            ) : (
              <span className="text-muted">Arrastra una imagen o haz clic para seleccionar</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Tipo</label>
          <input
            type="text"
            name="roomType"
            className="form-control"
            value={roomDetails.roomType}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Precio</label>
          <input
            type="text"
            name="roomPrice"
            className="form-control"
            value={roomDetails.roomPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Descripción</label>
          <textarea
            name="roomDescription"
            className="form-control"
            rows="4"
            value={roomDetails.roomDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleUpdate}>
            <i className="bi bi-arrow-repeat me-2"></i>Actualizar
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <i className="bi bi-trash me-2"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomPage;
