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
      if (selectedSymptoms.length < 4) {
        setSelectedSymptoms([...selectedSymptoms, symptom]);
      } else {
        console.log("Cannot select more than 4 symptoms.");
        // Optionally display a message to the user
      }
    }
  };

  const handleConfirmSelection = () => {
    onSelect(selectedSymptoms); // Pass selected symptoms to parent component
    setIsOpen(false); // Close dropdown after selection
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
          <button onClick={handleConfirmSelection}>Confirm Selection</button>
        </div>
      )}
    </div>
  );
};

export default SymptomsDropdown;
