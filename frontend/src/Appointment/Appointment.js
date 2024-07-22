import React, { useState } from 'react';
import './Appointment.css';
import doctorImage from './Doctor.png'; 

const doctors = [
  { id: 1, name: 'Dr. Harris Ali', specialization: 'Poultry', fees: 'Rs.500', experience: '5 years', timing: '10:00 AM - 4:00 PM' },
  { id: 2, name: 'Dr. Ali Imran', specialization: 'LiveStock', fees: 'Rs.1000', experience: '3 years', timing: '9:00 AM - 2:00 PM' },
  { id: 3, name: 'Dr. Hashir', specialization: 'Pet', fees: 'Rs.1500', experience: '2 years', timing: '11:00 AM - 5:00 PM' },
  { id: 4, name: 'Dr. Saif Khan', specialization: 'Poultry', fees: 'Rs.800', experience: '3 years', timing: '8:00 AM - 3:00 PM' },
  { id: 5, name: 'Dr. Awais Ali', specialization: 'LiveStock', fees: 'Rs.800', experience: '4 years', timing: '12:00 AM - 6:00 PM' },
  { id: 6, name: 'Dr. Haider Ali', specialization: 'Pet', fees: 'Rs.1500', experience: '6 years', timing: '12:00 PM - 4:00 PM' },
  { id: 7, name: 'Dr. Abrar', specialization: 'Poultry', fees: 'Rs.1000', experience: '5 years', timing: '12:00 PM - 6:00 PM' },
  { id: 8, name: 'Dr. Faizan', specialization: 'LiveStock', fees: 'Rs.500', experience: '1 year', timing: '8:00 AM - 1:00 PM' },
  { id: 9, name: 'Dr. Ali Kamran', specialization: 'Pet', fees: 'Rs.800', experience: '2 years', timing: '8:00 AM - 12:00 PM' },
  

];

function Appointment() {
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
  };

  const uniqueSpecializations = Array.from(new Set(doctors.map(doctor => doctor.specialization.toLowerCase().trim())));

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialization.toLowerCase() === selectedSpecialization.toLowerCase()
  );

  return (
    <div className="appointment-container">
      <h1>Doctor Appointment Booking</h1>
      
      <label htmlFor="specialization">Choose Animal Specialization:</label>
      <select id="specialization" onChange={handleSpecializationChange} value={selectedSpecialization}>
        <option value="">Select Specialization</option>
        {uniqueSpecializations.map((specialization, index) => (
          <option key={index} value={specialization}>{specialization.charAt(0).toUpperCase() + specialization.slice(1)}</option>
        ))}
      </select>

      {selectedSpecialization && (
        <div className="doctor-list">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <img src={doctorImage} alt="Doctor" className="doctor-image" />
              <div className="doctor-info">
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Fees:</strong> {doctor.fees}</p>
                <p><strong>Experience:</strong> {doctor.experience}</p>
                <p><strong>Timing:</strong> {doctor.timing}</p>
                <button onClick={() => alert(`Appointment booked with ${doctor.name}`)}>Book Appointment</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!selectedSpecialization && (
        <div className="doctor-list">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <img src={doctorImage} alt="Doctor" className="doctor-image" />
              <div className="doctor-info">
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Fees:</strong> {doctor.fees}</p>
                <p><strong>Experience:</strong> {doctor.experience}</p>
                <p><strong>Timing:</strong> {doctor.timing}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointment;
