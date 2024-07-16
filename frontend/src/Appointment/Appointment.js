import React, { useState, useEffect } from 'react';
import './Appointment.css';
import doctorImage from './Doctor.png'; 

const doctors = [
  { id: 1, name: 'Dr. Harris Ali', specialization: 'Dog' },
  { id: 2, name: 'Dr. Ali Imran', specialization: 'Cat' },
  { id: 3, name: 'Dr. Hashir', specialization: 'Parrot' },
  { id: 4, name: 'Dr. Saif Khan', specialization: 'Buffalo' },
  { id: 5, name: 'Dr. Awais Ali', specialization: 'Goat' },
  { id: 6, name: 'Dr. Maryam Shakeel', specialization: 'Sheep' },
  { id: 7, name: 'Dr. Abrar', specialization: 'Cow' },
  { id: 8, name: 'Dr. Faiza', specialization: 'Chicken' },
];

function Appointment() {
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    setSelectedDoctor(null);
  };

  const uniqueSpecializations = Array.from(new Set(doctors.map(doctor => doctor.specialization)));
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialization === selectedSpecialization
  );

  useEffect(() => {
    if (filteredDoctors.length > 0) {
      setSelectedDoctor(filteredDoctors[0]);
    }
  }, [selectedSpecialization, filteredDoctors]);

  return (
    <div className="appointment-container">
      <h1>Doctor Appointment Booking</h1>

      <label htmlFor="specialization">Choose Animal Specialization:</label>
      <select id="specialization" onChange={handleSpecializationChange} value={selectedSpecialization}>
        <option value="">Select Specialization</option>
        {uniqueSpecializations.map((specialization, index) => (
          <option key={index} value={specialization}>{specialization}</option>
        ))}
      </select>

      {selectedDoctor && (
        <div className="appointment">
          <h2>Book Appointment with {selectedDoctor.name}</h2>
          <img 
            src={doctorImage} 
            alt="Doctor"
            className="doctor-image" 
          />
          <button onClick={() => alert(`Appointment booked with ${selectedDoctor.name}`)}>
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}

export default Appointment;
