import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddRoomPage = () => {
  const navigate = useNavigate();
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
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching room types:', error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomTypeChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setNewRoomType(true);
      setRoomDetails(prev => ({ ...prev, roomType: '' }));
    } else {
      setNewRoomType(false);
      setRoomDetails(prev => ({ ...prev, roomType: value }));
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const addRoom = async () => {
    if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
      setError('Todos los campos son obligatorios.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (!window.confirm('¿Deseas agregar esta habitación?')) return;

    try {
      const formData = new FormData();
      formData.append('roomType', roomDetails.roomType);
      formData.append('roomPrice', roomDetails.roomPrice);
      formData.append('roomDescription', roomDetails.roomDescription);
      if (file) formData.append('photo', file);

      const result = await ApiService.addRoom(formData);
      if (result.statusCode === 200) {
        setSuccess('Habitación agregada exitosamente.');
        setTimeout(() => {
          setSuccess('');
          navigate('/admin/manage-rooms');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="container py-4">
      <div className="card mx-auto shadow p-4 border-0 rounded-4" style={{ maxWidth: '600px' }}>
        <h2 className="text-center fw-bold mb-4">Agregar Nueva Habitación</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div
          className={`mb-3 p-3 border rounded text-center ${dragOver ? 'bg-light border-primary' : ''}`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="img-thumbnail mb-2" style={{ maxHeight: 250 }} />
          ) : (
            <p className="text-muted">Arrastra una imagen aquí o haz clic para seleccionar un archivo</p>
          )}
          <input
            type="file"
            className="form-control mt-2"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Tipo de habitación</label>
          <select
            className="form-select"
            value={roomDetails.roomType}
            onChange={handleRoomTypeChange}
          >
            <option value="">Seleccione un tipo</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
            <option value="new">Otro (especificar)</option>
          </select>
          {newRoomType && (
            <input
              type="text"
              name="roomType"
              className="form-control mt-2"
              placeholder="Ingrese un nuevo tipo"
              value={roomDetails.roomType}
              onChange={handleChange}
            />
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Precio</label>
          <input
            type="text"
            name="roomPrice"
            className="form-control"
            value={roomDetails.roomPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            name="roomDescription"
            className="form-control"
            rows="4"
            value={roomDetails.roomDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-success px-4" onClick={addRoom}>
            Crear Habitación
          </button>
          <button
            className="btn btn-danger px-4"
            onClick={() => navigate('/admin/manage-rooms')}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomPage;
