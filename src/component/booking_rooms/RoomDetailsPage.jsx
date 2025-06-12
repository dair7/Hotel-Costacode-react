import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  const handleConfirmBooking = () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
      setErrorMessage('Please enter valid numbers for adults and children.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;
    const guests = numAdults + numChildren;
    const price = roomDetails.roomPrice * totalDays;

    setTotalGuests(guests);
    setTotalPrice(price);
  };

  const acceptBooking = async () => {
    try {
      const formattedCheckInDate = new Date(checkInDate.getTime() - checkInDate.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(checkOutDate.getTime() - checkOutDate.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms');
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (isLoading) return <div className="text-center mt-5">Loading room details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!roomDetails) return <div className="text-center mt-5">Room not found.</div>;

  const { roomType, roomPrice, roomPhotoUrl, roomDescription } = roomDetails;

  return (
    
    <div className="container my-5" style={{ maxWidth: '900px' }}>
      {showMessage && (
        <div className="alert alert-success shadow-sm rounded">
          ¡Reserva realizada con éxito! Código: <strong>{confirmationCode}</strong>. Revisa tu SMS y correo.
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger shadow-sm rounded">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="card shadow-lg rounded-4 border-0 p-4">
        <h2 className="mb-4 text-center text-dark fs-3 fw-bold">Detalles de la Habitación</h2>

        <div className="text-center mb-4">
          <img
            src={roomPhotoUrl}
            alt={roomType}
            className="img-fluid rounded-4 border border-3 border-info shadow"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        <div className="mb-4">
          <h3 className="text-dark fw-semibold fs-4 mb-3">{roomType}</h3>
          <p className="mb-2"><strong> $ Precio:</strong> ${roomPrice} / noche</p>
          <p className="mb-0"><strong>📝 Descripción:</strong> {roomDescription}</p>
        </div>

        <div className="d-flex gap-3 justify-content-center my-3">
          <button className="btn btn-outline-primary px-4 rounded-pill" onClick={() => setShowDatePicker(true)}>Reservar Ahora</button>
          <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setShowDatePicker(false)}>Ocultar Reserva</button>
        </div>

        {showDatePicker && (
          <div className="border rounded-4 p-4 bg-light shadow-sm mb-4">
            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label fw-medium">Fecha de Entrada</label>
                <DatePicker
                  className="form-control rounded-pill"
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  selectsStart
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  placeholderText="Check-in"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Fecha de Salida</label>
                <DatePicker
                  className="form-control rounded-pill"
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  selectsEnd
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={checkInDate}
                  placeholderText="Check-out"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-medium">Adultos</label>
                <input
                  type="number"
                  className="form-control rounded-pill"
                  min="1"
                  value={numAdults}
                  onChange={(e) => setNumAdults(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-medium">Niños</label>
                <input
                  type="number"
                  className="form-control rounded-pill"
                  min="0"
                  value={numChildren}
                  onChange={(e) => setNumChildren(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="mt-4 text-end">
              <button className="btn btn-success px-4 rounded-pill" onClick={handleConfirmBooking}>Confirmar Reserva</button>
            </div>
          </div>
        )}

        {totalPrice > 0 && (
          <div className="alert alert-info shadow-sm rounded-4 mt-4">
            <p><strong>Total a Pagar:</strong> ${totalPrice}</p>
            <p><strong>Total de Huéspedes:</strong> {totalGuests}</p>
            <button className="btn btn-warning px-4 rounded-pill" onClick={acceptBooking}>Aceptar Reserva</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
