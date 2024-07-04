// components/SymptomsDropdown.js
import React, {useEffect} from 'react';
import './dropdown.css'

const SymptomsDropdown = ({ options, data }) => {
  //const symptoms = ["Fatigue", "Fever", "Loss of Appetite", "Coughing", "Sneezing"];
  useEffect(() => {
    console.log("Symptoms received in dropdown:", options);
  });
  
  const animalType=data;
  console.log(animalType,data);
  return (
    <select  className='dropdown' >
      <option value="">Select a symptom</option>
      {options && options.map((symptom, index) => (
        <option key={index} value={symptom}>{symptom}</option>
      ))}
    </select>
  );
};

export default SymptomsDropdown;






