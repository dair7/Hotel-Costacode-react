import React from 'react';
import { Link } from 'react-router-dom';

const BookingResult = ({ bookingSearchResults }) => {
  return (
    <div
      className="grid gap-4 mt-6"
      style={{
        background: 'linear-gradient(135deg,rgb(58, 75, 101), #f7faff)', // azul clarito muy suave
        padding: '1rem',
        borderRadius: '0.5rem',
      }}
    >
      {bookingSearchResults.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron reservas.</p>
      ) : (
        bookingSearchResults.map((booking) => (
          <div
            key={booking.id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-indigo-600">Reserva #{booking.id}</h3>
              <Link
                to={`/admin/edit-booking/${booking.id}`}
                className="text-sm text-blue-500 hover:underline"
              >
                Editar
              </Link>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-medium">ID de Habitación:</span> {booking.roomId}</p>
              <p><span className="font-medium">ID de Usuario:</span> {booking.userId}</p>
              <p><span className="font-medium">Fecha Inicio:</span> {booking.startDate}</p>
              <p><span className="font-medium">Fecha Fin:</span> {booking.endDate}</p>
              <p>
                <span className="font-medium">Estado:</span>{' '}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {booking.status}
                </span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingResult;
