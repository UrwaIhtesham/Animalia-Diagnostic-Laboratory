import React, { useState } from 'react';
import './dropdown.css';

const SymptomsDropdown = ({ options, data, onSelect }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const animalType = data?.animalType || 'undefined';

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== symptom));
    } else {
      // if (selectedSymptoms.length < 4) {
      //   setSelectedSymptoms([...selectedSymptoms, symptom]);
      // } else {
      //   console.log("Cannot select more than 4 symptoms.");
      //   // Optionally display a message to the user
      // }
      if (animalType === 'cow' || animalType === 'buffalo' || animalType === 'sheep' || animalType === 'goat'){
        if (selectedSymptoms.length < 3){
          setSelectedSymptoms([...selectedSymptoms, symptom]);
        } else {
          console.log("Cannot select more than 3 symptoms.");
        }
      } else {
        if (selectedSymptoms.length < 4) {
          setSelectedSymptoms([...selectedSymptoms, symptom]);
        } else {
          console.log("Cannot select more than 4 symptoms.");
        }
      }
    }
  };

  const handleConfirmSelection = () => {
    if (
      ((animalType === 'cow' || animalType === 'buffalo' || animalType === 'sheep' || animalType === 'goat') && selectedSymptoms.length === 3) || 
      (!(animalType === 'cow' || animalType === 'buffalo' || animalType !== 'sheep' || animalType !== 'goat') && selectedSymptoms.length === 4)
    ) {
      onSelect(selectedSymptoms); // Pass selected symptoms to parent component
      setIsOpen(false); // Close dropdown after selection
    } else {
      console.log("Please select exactly 4 symptoms."); 
      // Optionally display a message to the user
    }
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-header" onClick={toggleDropdown}>
        <p>Select 4 symptoms for {animalType}</p>
        <span style={{ cursor: 'pointer' }}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="dropdown-content">
          <div className="symptoms-list">
            <ul>
              {options.map((symptom, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      id={symptom}
                      name={symptom}
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => handleCheckboxChange(symptom)}
                    />
                    {symptom}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={handleConfirmSelection} 
            disabled={
              ((animalType === 'cow' || animalType === 'buffalo' || animalType === 'sheep' || animalType === 'goat') && selectedSymptoms.length !== 3) ||
              (!(animalType === 'cow' || animalType === 'buffalo' || animalType === 'sheep' || animalType === 'goat') && selectedSymptoms.length !== 4)
            }
          >
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default SymptomsDropdown;
