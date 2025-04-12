import React, { useState, useEffect } from 'react';
import axios from '../utils/api';  // Using axios instance with baseURL set
import SeatGrid from '../components/SeatGrid';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [seats, setSeats] = useState([]);
  const [seatInput, setSeatInput] = useState('');
  const [cancelInput, setCancelInput] = useState('');
  const navigate = useNavigate();


  const fetchSeats = async () => {
    const res = await axios.get('/seats');  // This will automatically use the baseURL (http://localhost:3000/api)
    setSeats(res.data.layout);
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const handleBook = async () => {
    const seatCount = parseInt(seatInput);
    const seatIds = Array.from({ length: seatCount }, (_, i) => i + 1); // for demo
    await axios.post('/seats/book', { desiredSeats: seatIds.length, userId: localStorage.getItem('token') });
    fetchSeats();
  };

  const handleCancel = async () => {
    const ids = cancelInput.split(',').map(id => parseInt(id));
    await axios.post('/seats/cancel', { seatIds: ids, userId: localStorage.getItem('token') });
    navigate('/home');
    fetchSeats();
  };

  return (
    <div>
      <h2>Seat Booking</h2>
      <SeatGrid seats={seats} />
      <input placeholder="Seats to book" value={seatInput} onChange={e => setSeatInput(e.target.value)} />
      <button onClick={handleBook}>Book</button>
      <br /><br />
      <input placeholder="Cancel Seat IDs (e.g. 1,2)" value={cancelInput} onChange={e => setCancelInput(e.target.value)} />
      <button onClick={handleCancel}>Cancel seats</button>
    </div>
  );
}
