import React, { useState, useEffect } from 'react';
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
];

function Appointment() {
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    setSelectedDoctor(null);
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(doc => doc.id === parseInt(doctorId));
    setSelectedDoctor(doctor);
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

      {filteredDoctors.length > 0 && (
        <>
          <label htmlFor="doctor">Choose Doctor:</label>
          <select id="doctor" onChange={handleDoctorChange} value={selectedDoctor?.id || ''}>
            <option value="">Select Doctor</option>
            {filteredDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
        </>
      )}

      {selectedDoctor && (
        <div className="appointment">
          <h2>Book Appointment with {selectedDoctor.name}</h2>
          <img 
            src={doctorImage} 
            alt="Doctor"
            className="doctor-image" 
          />
          <div className="doctor-details">
            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
            <p><strong>Fees per consultation:</strong> {selectedDoctor.fees}</p>
            <p><strong>Experience:</strong> {selectedDoctor.experience}</p>
            <p><strong>Timing:</strong> {selectedDoctor.timing}</p>
          </div>
          <button onClick={() => alert(`Appointment booked with ${selectedDoctor.name}`)}>
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}

export default Appointment;
