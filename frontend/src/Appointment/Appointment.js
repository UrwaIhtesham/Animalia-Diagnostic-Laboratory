import React, { useState, useEffect } from 'react';
import './Appointment.css';
import doctorImage from './Doctor.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Loading from '../Components/Loading/Loading';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

function Appointment() {
  const email = localStorage.getItem('userEmail');

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDays, setAvailableDays] = useState([]); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/home');
  };

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
    setIsDisabled(true);
    setSelectedDoctor(null);
  };

  const handleBookAppointment = (doctor) => {
    const docid = doctor.id;
    const fee = doctor.fees;
    console.log(docid, fee, email);
    console.log(doctor.days);
    setSelectedDoctor(doctor);
    setAvailableDays(doctor.days ? doctor.days.split(',').map(days => days.trim()) : []); // Parse available days from doctor data
  };

  const uniqueSpecializations = Array.from(new Set(doctors.map((doctor) => doctor.specialization)));
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialization === selectedSpecialization
  );

  const handleappoint = async (selectedDoctor) => {
    const docid = selectedDoctor.id;
    const fee = selectedDoctor.fees;
    console.log("In FInal");
    console.log(docid, fee, email);
    console.log(selectedDoctor.name, selectedDay, selectedTime);
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      setLoading(true);
      const response = await axios.post(
        'http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/appointments',
        {
          docid,
          useremail: email,
          fee,
          selectedDay,
          selectedTime,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
        { withCredentials: true }
      );
      console.log(response.status);
      if (response.status === 201) {
        // alert(`Appointment is booked with ${selectedDoctor.name}`);
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert(`Error: ${error.response.data.error}`);
        } else if (error.response.status === 401) {
          alert('Unauthorized access. Please log in.');
        } else if (error.response.status === 409) {
          alert('An appointment already exists for this doctor at the selected day and time. Please select another day or time.');
        } else if (error.response.status === 500) {
          alert(`Server error: ${error.response.data.error}`);
        } else {
          alert(`Error booking appointment: ${error.response.data.error}`);
        }
      } else {
        alert(`Error ajeeb: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const parseTimeRange = (timeRange) => {
    const [startTime, endTime] = timeRange.split(' - ');
    return {
      start: moment(startTime, 'h:mm A'),
      end: moment(endTime, 'h:mm A'),
    };
  };

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let currentTime = start;

    while (currentTime.isBefore(end)) {
      slots.push(currentTime.format('h:mm A'));
      currentTime = currentTime.add(30, 'minutes');
    }

    return slots;
  };

  const handleDayChange = (event) => {
    console.log("Handle day change", selectedDoctor.days);
    setSelectedDay(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  useEffect(() => {
    if (selectedDoctor) {
      const { start, end } = parseTimeRange(selectedDoctor.timing);
      setTimeSlots(generateTimeSlots(start, end));
    }
  }, [selectedDoctor]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);

    axios
      .get('http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('Response headers:', response.data);
        setDoctors(response.data);
        setLoading(true);
      })
      .catch((error) => {
        console.error('There was an error fetching the doctors!', error);
        if (error.response) {
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
        }
      }) .finally(()=> {
        setLoading(false);
      });
  }, []);

  return (
    <div className="appointment-container">
      {loading && <Loading/>}
      <div className="sticky-header">
        <h1 className="appoint-h1">Doctor Appointment Booking</h1>

        <p className='pp'>Note: Please Select Specific Specialization to Book an Appointment with Veterinary Doctor</p>
        <label className='label-label' htmlFor="specialization">Choose Animal Specialization:</label>
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
                <p><strong>Day:</strong> {doctor.days}</p>
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
                <p><strong>Day:</strong> {doctor.days}</p>
                <button className='bookAppointment' onClick={() => handleBookAppointment(doctor)}>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDoctor && (
        <div className="appointment">
          <h2 className='appoint-h2'>Book Appointment with {selectedDoctor.name}</h2>
          <img src={doctorImage} alt="Doctor" className="doctor-image" />
          <div className="doctor-details">
            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
            <p><strong>Fees per consultation:</strong> {selectedDoctor.fees}</p>
            <p><strong>Experience:</strong> {selectedDoctor.experience}</p>
            <p><strong>Timing:</strong> {selectedDoctor.timing}</p>
          </div>
          <div className="appointment-schedule">
            <label htmlFor="day-select">Select a day:</label>
            <select id="day-select" value={selectedDay} onChange={handleDayChange}>
              <option value="">--Select a day--</option>
              {Array.isArray(availableDays) && availableDays.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {selectedDay && (
              <div>
                <label htmlFor="time-select">Select a time:</label>
                <select id="time-select" value={selectedTime} onChange={handleTimeChange}>
                  <option value="">--Select a time--</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedTime && (
              <div>
                <button className='bookAppointment' onClick={() => handleappoint(selectedDoctor)}>
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

<Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Booking Confirmation"
        ariaHideApp={false}
        overlayClassName="modal-overlay"
      >
          <div className="modal-class">
            <h2>Payment Confirmation</h2>
            {/* <FontAwesomeIcon icon={faUserCheck} size="3x" className='icon-red' /> */}
            <FontAwesomeIcon icon={faUserCheck} size="3x" className="icon-red bounce" />

            {selectedDoctor ? (
      <p>Appointment Booking with {selectedDoctor.name} at {selectedDay}, {selectedTime} is successful</p>
    ) : (
      <p>Appointment Booking is successful</p>
    )}
            <button onClick={closeModal}>Close</button>
          </div>

      </Modal>
    </div>
  );
}

export default Appointment;