import React, { useState } from 'react';
import './Appointment.css';
import doctorImage from './Doctor.png'; 

const doctors = [
  { id: 1, name: 'Dr. Harris Ali', specialization: 'Dog', fees: 'Rs.1000', experience: '5 years', timing: '10:00 AM - 4:00 PM' },
  { id: 2, name: 'Dr. Ali Imran', specialization: 'Cat', fees: 'Rs.1000', experience: '3 years', timing: '9:00 AM - 2:00 PM' },
  { id: 3, name: 'Dr. Hashir', specialization: 'Parrot', fees: 'Rs.1500', experience: '2 years', timing: '11:00 AM - 5:00 PM' },
  { id: 4, name: 'Dr. Saif Khan', specialization: 'Buffalo', fees: 'Rs.500', experience: '3 years', timing: '8:00 AM - 3:00 PM' },
  { id: 5, name: 'Dr. Awais Ali', specialization: 'Goat', fees: 'Rs.500', experience: '4 years', timing: '10:00 AM - 6:00 PM' },
  { id: 6, name: 'Dr. Haider Ali', specialization: 'Sheep', fees: 'Rs.1500', experience: '6 years', timing: '9:00 AM - 4:00 PM' },
  { id: 7, name: 'Dr. Abrar', specialization: 'Cow', fees: 'Rs.1000', experience: '5 years', timing: '12:00 PM - 6:00 PM' },
  { id: 8, name: 'Dr. Faizan', specialization: 'Chicken', fees: 'Rs.500', experience: '1 year', timing: '8:00 AM - 1:00 PM' },
  { id: 9, name: 'Dr. Ali Kamran', specialization: 'Dog', fees: 'Rs.800', experience: '2 years', timing: '3:00 PM - 8:00 PM' },
  { id: 10, name: 'Dr. Hamza', specialization: 'Cat', fees: 'Rs.800', experience: '4 years', timing: '2:00 PM - 7:00 PM' },
  { id: 11, name: 'Dr. Shakeel', specialization: 'Parrot', fees: 'Rs.1500', experience: '3 years', timing: '6:00 PM - 9:00 PM' },
  { id: 12, name: 'Dr. Yasoob', specialization: 'Buffalo', fees: 'Rs.500', experience: '1 year', timing: '8:00 AM - 1:00 PM' },
  { id: 13, name: 'Dr. Mudassar Ali', specialization: 'Goat', fees: 'Rs.500', experience: '2 years', timing: '8:00 AM - 1:00 PM' },
  { id: 14, name: 'Dr. Ahmad Hassan', specialization: 'Sheep', fees: 'Rs.500', experience: '4 years', timing: '8:00 AM - 1:00 PM' },
  { id: 15, name: 'Dr. Farooq', specialization: 'Cow', fees: 'Rs.800', experience: '2 years', timing: '8:00 AM - 1:00 PM' },
  { id: 16, name: 'Dr. Javed Iqbal', specialization: 'Chicken', fees: 'Rs.500', experience: '3 years', timing: '2:00 PM - 6:00 PM' },
  { id: 17, name: 'Dr. Atif', specialization: 'Dog', fees: 'Rs.1000', experience: '1 years', timing: '5:00 PM - 9:00 PM' },
  { id: 18, name: 'Dr. Zubair', specialization: 'Cat', fees: 'Rs.800', experience: '4 years', timing: '6:00 PM - 6:00 PM' },
  { id: 19, name: 'Dr. Shafique', specialization: 'Parrot', fees: 'Rs.1500', experience: '3 years', timing: '2:00 PM - 5:00 PM' },
  { id: 20, name: 'Dr. Hamza Iqbal', specialization: 'Buffalo', fees: 'Rs.800', experience: '3 years', timing: '1:00 PM - 8:00 PM' },
  { id: 21, name: 'Dr. Yaseen Muhammad', specialization: 'Goat', fees: 'Rs.1000', experience: '3 years', timing: '3:00 PM - 6:00 PM' },
  { id: 22, name: 'Dr. Javed Asghar', specialization: 'Sheep', fees: 'Rs.1000', experience: '3 years', timing: '12:00 PM - 3:00 PM' },
  { id: 23, name: 'Dr. Ibraheem', specialization: 'Cow', fees: 'Rs.1000', experience: '3 years', timing: '2:00 PM - 8:00 PM' },
  { id: 24, name: 'Dr. Zikria', specialization: 'Chicken', fees: 'Rs.500', experience: '3 years', timing: '12:00 PM - 6:00 PM' },

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
