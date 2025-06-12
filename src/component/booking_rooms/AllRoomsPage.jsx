import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import 'bootstrap/dist/css/bootstrap.min.css';

const AllRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);

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

  const handleSearchResult = (results) => {
    setRooms(results);
    setFilteredRooms(results);
    setCurrentPage(1);
  };

  const handleRoomTypeChange = (e) => {
    const type = e.target.value;
    setSelectedRoomType(type);
    if (type === '') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === type);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Todas las Habitaciones</h2>
        <p className="text-muted">Encuentra la habitación perfecta para tu estadía</p>
      </div>

      {/* Buscar habitación disponible por fecha */}
      {/* Buscar habitación disponible por fecha */}
<div className="row justify-content-center mb-3">
  <div className="col-12 col-lg-11">
    <RoomSearch handleSearchResult={handleSearchResult} />
  </div>
</div>


      {/* Filtro por tipo de habitación */}
      <div className="row justify-content-start mb-4">
        <div className="col-md-6 col-lg-4">
          <label htmlFor="roomType" className="form-label fw-bold">Filtrar por tipo de habitación:</label>
          <select
            id="roomType"
            className="form-select"
            value={selectedRoomType}
            onChange={handleRoomTypeChange}
          >
            <option value="">Todas las habitaciones</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-3 text-center">
        <p className="fw-light">
          Mostrando <strong>{currentRooms.length}</strong> de <strong>{filteredRooms.length}</strong> habitaciones
          {selectedRoomType && (
            <span> • Filtrado por: <strong>{selectedRoomType}</strong></span>
          )}
        </p>
      </div>

      {/* Tarjetas centradas y más anchas */}
      <div className="d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: '1400px' }}>
          <RoomResult roomSearchResults={currentRooms} />
        </div>
      </div>

      {/* Paginación */}
      <div className="mt-4 d-flex justify-content-center">
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

export default AllRoomsPage;
