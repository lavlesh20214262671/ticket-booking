import React from 'react';

export default function SeatGrid({ seats }) {
  return (
    <div>
      {seats.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
          {row.map((seat, j) => (
            <div key={j} style={{ width: 30, height: 30, backgroundColor: seat === 'X' ? 'red' : 'green', color: 'white', textAlign: 'center', lineHeight: '30px' }}>
              {i * 7 + j + 1}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
