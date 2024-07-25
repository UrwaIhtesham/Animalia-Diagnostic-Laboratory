import React, { useState, useEffect } from 'react';
import './Appointment.css';
import doctorImage from './Doctor.png';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';


function Appointment() {
//   const { email } = useContext(UserContext);
const location = useLocation();
const email = location.state?.email;

  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleSpecializationChange = (e) => {
    
    setSelectedSpecialization(e.target.value);
    setIsDisabled(true)
    setSelectedDoctor(null);
  };
  const handleBookAppointment = async(doctor) => {
    const docid=doctor.id;
    const fee= doctor.fees;
    console.log(docid,fee,email);
    setSelectedDoctor(doctor)
    // try {
    //   // Make the POST request and await the response
    //   const response = await axios.post('http://127.0.0.1:5000/appointment', {
    //     docid,
    //     useremail: email,
    //     fee
    //   });
    //   console.log(response.status)
    //   if(response.status===201)
    //   {
    //     alert(`Appointment is booked with ${doctor.name}`)
    //     // Redirect to the dashboard after a successful response
    //     navigate('/home');

    //   }
  
      
    // } catch (error) {
    //   // Handle any errors that occur during the request
    //   console.error('Error booking appointment:', error);
    //   // Optionally, you can show an error message to the user here
    // }
  };
  const uniqueSpecializations = Array.from(new Set(doctors.map(doctor => doctor.specialization)));
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialization === selectedSpecialization
  );
  const handleappoint = async (selectedDoctor)=>{
    const docid=selectedDoctor.id;
    const fee= selectedDoctor.fees;
    console.log("In FInal");
    console.log(docid,fee,email);
    console.log(selectedDoctor.name, selectedDay,selectedTime);
    try {
      // Make the POST request and await the response
      const response = await axios.post('http://127.0.0.1:5000/appointment', {
        docid,
        useremail: email,
        fee,
        selectedDay,
        selectedTime
      });
      console.log(response.status)
      if(response.status===201)
      {
        alert(`Appointment is booked with ${selectedDoctor.name}`)
        // Redirect to the dashboard after a successful response
        navigate('/home');

      }
  
      
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error booking appointment:', error);
      // Optionally, you can show an error message to the user here
    }

  }
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

     
        <h1 className="heading">Doctor Appointment Booking</h1>

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
          <div className="appointment-schedule">
            <label htmlFor="day-select">Select a day:</label>
              <select id="day-select" value={selectedDay} onChange={handleDayChange}>
                <option value="">--Select a day--</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
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
            {selectedTime &&(
              <div>
                <button className='bookAppointment' onClick={() => handleappoint(selectedDoctor)}>
                    Book Appointment
                </button>
              </div>
            )
            }

          </div>
        </div>
      )}
    </div>
  );
}

export default Appointment;
