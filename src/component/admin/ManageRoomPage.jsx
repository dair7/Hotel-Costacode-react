import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../common/RoomResult';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        const allRooms = response.roomList;
        setRooms(allRooms);
        setFilteredRooms(allRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching room types:', error.message);
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, []);

  const handleRoomTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedRoomType(selectedType);
    if (selectedType === '') {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter((room) => room.roomType === selectedType));
    }
    setCurrentPage(1);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Gestión de Habitaciones</h2>
        <button className="btn btn-success" onClick={() => navigate('/admin/add-room')}>
          <i className="bi bi-plus-lg me-2"></i> Añadir Habitación
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Filtrar por tipo:</label>
          <select
            className="form-select"
            value={selectedRoomType}
            onChange={handleRoomTypeChange}
          >
            <option value="">Todas</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <RoomResult roomSearchResults={currentRooms} />

      <div className="mt-4">
        <Pagination
          roomsPerPage={roomsPerPage}
          totalRooms={filteredRooms.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default ManageRoomPage;
