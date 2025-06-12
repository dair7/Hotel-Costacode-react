import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(6);
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await ApiService.getAllBookings();
        const allBookings = response.bookingList;
        setBookings(allBookings);
        setFilteredBookings(allBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings(searchTerm);
  }, [searchTerm, bookings]);

  const filterBookings = (term) => {
    if (term.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter((booking) =>
        booking.bookingConfirmationCode &&
        booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(`Código "${text}" copiado!`);
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(() => {
      setCopySuccess('Error al copiar.');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold text-dark">Reservas Registradas</h2>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <input
            type="search"
            className="form-control form-control-lg shadow-sm"
            placeholder="Buscar por código de reserva..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Buscar reservas"
          />
        </div>
      </div>

      {/* Aviso de copia */}
      {copySuccess && (
        <div className="alert alert-success text-center py-2" role="alert" style={{ maxWidth: '300px', margin: '0 auto 20px' }}>
          {copySuccess}
        </div>
      )}

      {currentBookings.length === 0 ? (
        <div className="text-center text-muted fst-italic py-5">
          No se encontraron reservas que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="row g-4">
          {currentBookings.map((booking) => (
            <div key={booking.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow border border-primary rounded-4">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-3">
                    <span className="text-dark fw-semibold">Código: </span>
                    <span
                      className="text-primary fw-bold"
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => copyToClipboard(booking.bookingConfirmationCode)}
                      title="Haz clic para copiar el código"
                    >
                      {booking.bookingConfirmationCode}
                    </span>
                  </h5>
                  <p className="mb-2">
                    <strong>Entrada:</strong> {booking.checkInDate}
                  </p>
                  <p className="mb-2">
                    <strong>Salida:</strong> {booking.checkOutDate}
                  </p>
                  <p className="mb-4">
                    <strong>Huéspedes:</strong> {booking.totalNumOfGuest}
                  </p>
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)}
                  >
                    Gestionar Reserva
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center mt-5">
        <Pagination
          roomsPerPage={bookingsPerPage}
          totalRooms={filteredBookings.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default ManageBookingsPage;
