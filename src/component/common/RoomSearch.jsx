import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card
} from 'react-bootstrap';
 // Asegúrate de importar el CSS personalizado

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error al obtener tipos de habitación:', error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => setError(''), timeout);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError('Por favor completa todos los campos');
      return;
    }

    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      const response = await ApiService.getAvailableRoomsByDateAndType(
        formattedStartDate,
        formattedEndDate,
        roomType
      );

      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          showError('No hay habitaciones disponibles para este rango de fechas y tipo.');
        } else {
          handleSearchResult(response.roomList);
          setError('');
        }
      }
    } catch (error) {
      showError(
        'Ocurrió un error: ' + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
       <Card
        className="shadow-sm p-4 border border-primary rounded-4 w-100"
        style={{ maxWidth: '1200px', backgroundColor: '#fdfdfd', borderWidth: '1px', borderColor: '#cce5ff' }}
      >
        <Card.Body>
          <h3 className="text-center mb-4 text-warning fw-semibold">

            🔍 Buscar habitación disponible
          </h3>
          <Form>
            <Row className="g-4 align-items-end">
              <Col md={4}>
                <Form.Group controlId="checkInDate">
                  <Form.Label className="fw-bold label-black">Fecha de entrada</Form.Label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="fecha de entrada"
                    className="form-control form-control-lg input-focus-blue"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="checkOutDate">
                  <Form.Label className="fw-bold label-black">Fecha de salida</Form.Label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="fecha de salida"
                    className="form-control form-control-lg input-focus-blue"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="roomType">
                  <Form.Label className="fw-bold label-black">Tipo de habitación</Form.Label>
                  <Form.Select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="form-select-lg input-focus-blue"
                  >
                    <option value="" disabled>
                      Tipo de habitación
                    </option>
                    {roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                className="px-4 py-2 fs-5 fw-bold rounded-pill"
                onClick={handleInternalSearch}
              >
                Ver habitaciones
              </Button>
            </div>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-4 text-center fs-6 rounded-3">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RoomSearch;
