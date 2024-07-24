import React, { useState, useEffect } from 'react';
import './Appointment.css';
import doctorImage from './Doctor.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Appointment() {
//   const { email } = useContext(UserContext);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSpecializationChange = (e) => {
    
    setSelectedSpecialization(e.target.value);
    setIsDisabled(true)
    setSelectedDoctor(null);
  };
  const handleBookAppointment = (doctor) => {
    alert(`Appointment booked with ${doctor.name}`);
    navigate('/dashboard'); // Redirect to the dashboard
  };
  const uniqueSpecializations = Array.from(new Set(doctors.map(doctor => doctor.specialization)));
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialization === selectedSpecialization
  );

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/doctors')
        .then(response => {
            setDoctors(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the doctors!', error);
        });
  }, []);

  return (
    <div className="appointment-container">
     <div className="sticky-header">

     
        <h1>Doctor Appointment Booking</h1>

        <label htmlFor="specialization">Choose Animal Specialization:</label>
        <select id="specialization" onChange={handleSpecializationChange} value={selectedSpecialization} disabled={isDisabled}>
            <option value="">Select Specialization</option>
            {uniqueSpecializations.map((specialization, index) => (
            <option key={index} value={specialization}>{specialization}</option>
            ))}
        </select>
      </div>

      {selectedSpecialization === '' && doctors.length > 0 && (
        <div className="doctor-list">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <img src={doctorImage} alt="Doctor" className="doctor-image" />
              <div className="doctor-info">
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Fees:</strong> Rs {doctor.fees}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Timing:</strong> {doctor.timing}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSpecialization !== '' && filteredDoctors.length > 0 && (
        <div className="doctor-list2">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <img src={doctorImage} alt="Doctor" className="doctor-image" />
              <div className="doctor-info">
                <p><strong>Name:</strong> {doctor.name}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Fees:</strong> Rs {doctor.fees}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Timing:</strong> {doctor.timing}</p>
                <button onClick={() => handleBookAppointment(doctor)}>
                    Book Appointment
                </button>
              </div>
            </div>
          ))}
          
        </div>
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
          
        </div>
      )}
    </div>
  );
}

export default Appointment;
