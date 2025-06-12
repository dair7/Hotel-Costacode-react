import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const FindBookingPage = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!confirmationCode.trim()) {
      setError("Please enter a booking confirmation code");
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
      setBookingDetails(response.booking);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Find Booking</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter your booking confirmation code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Find</button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {bookingDetails && (
        <div className="card mt-4">
          <div className="card-body">
            <h4 className="card-title">Booking Details</h4>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">Confirmation Code: {bookingDetails.bookingConfirmationCode}</li>
              <li className="list-group-item">Check-in Date: {bookingDetails.checkInDate}</li>
              <li className="list-group-item">Check-out Date: {bookingDetails.checkOutDate}</li>
              <li className="list-group-item">Adults: {bookingDetails.numOfAdults}</li>
              <li className="list-group-item">Children: {bookingDetails.numOfChildren}</li>
            </ul>

            <hr className="my-4" />

            <h5>Booker Details</h5>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">Name: {bookingDetails.user.name}</li>
              <li className="list-group-item">Email: {bookingDetails.user.email}</li>
              <li className="list-group-item">Phone Number: {bookingDetails.user.phoneNumber}</li>
            </ul>

            <hr className="my-4" />

            <h5>Room Details</h5>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">Room Type: {bookingDetails.room.roomType}</li>
              <li className="list-group-item text-center">
                <img
                  src={bookingDetails.room.roomPhotoUrl}
                  alt="Room"
                  className="img-fluid rounded"
                  style={{ maxHeight: '300px' }}
                />
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindBookingPage;
